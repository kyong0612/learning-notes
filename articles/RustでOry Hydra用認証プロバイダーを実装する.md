---
title: "RustでOry Hydra用認証プロバイダーを実装する"
source: "https://syu-m-5151.hatenablog.com/entry/2026/01/06/004244"
author:
  - "nwiizo (id:syu-m-5151)"
published: 2026-01-06
created: 2026-01-11
description: |
  OAuth2認可コードフローにおいて、Ory Hydraと連携するLogin/Consent ProviderをRustとAxumで実装する方法を解説。認証にはArgon2idを採用し、ユーザー列挙攻撃への対策も含めたセキュリティベストプラクティスを網羅した実践的な記事。
tags:
  - Rust
  - OAuth2
  - Ory Hydra
  - 認証/認可
  - セキュリティ
  - Axum
---

## はじめに

この記事は、Ory Hydraと連携するLogin/Consent ProviderをRustで実装するための実践ガイド。著者はインフラやプラットフォームを10年近く触ってきたが、「Login Providerをゼロから書け」と言われると手が動かない経験があった。その原因は技術的な難しさではなく、**「何をどの順番で実装すればいいのか」が見えていない**ことだと気づき、この記事を書いた。

> **前提知識**: この記事は[前回の記事](https://syu-m-5151.hatenablog.com/entry/2026/01/04/133007)の続編。OAuth2認可コードフローの基礎知識と、Ory Hydraのアーキテクチャ（Login/Consent Providerの役割）を理解している前提で進める。

---

## 作るもの

Login/Consent Providerとは、Ory Hydraと連携してOAuth2認証フローを処理するWebアプリケーション。以下の5つのエンドポイントを実装する。

| エンドポイント | 役割 |
|---------------|------|
| GET /login | ログインフォームを表示する |
| POST /login | 認証処理を行い、Hydraに結果を通知する |
| GET /consent | スコープ承認画面を表示する |
| POST /consent | 承認結果をHydraに通知し、トークン発行へ進む |
| GET /logout | ログアウト処理を行い、セッションを破棄する |

---

## 全体の流れ

OAuth2認可コードフローの中で、Login/Consent Providerがどう動くかを示す。

1. ユーザーがクライアントアプリで「ログイン」をクリック
2. クライアントがHydraの `/oauth2/auth` にリダイレクト
3. **Hydra が Login Provider の GET /login にリダイレクト（login_challenge付き）**
4. Login Provider がログインフォームを表示
5. ユーザーがメール・パスワードを入力して送信
6. **Login Provider が認証し、Hydra に accept_login を送信**
7. **Hydra が Consent Provider の GET /consent にリダイレクト（consent_challenge付き）**
8. Consent Provider がスコープ承認画面を表示
9. ユーザーが承認
10. **Consent Provider が Hydra に accept_consent を送信**
11. Hydra がクライアントにリダイレクト（認可コード付き）
12. クライアントが認可コードをトークンに交換

**Login/Consent Providerが担当するのは3〜10**。Hydraとの通信には以下6つのAPIを使う。

| API | 役割 |
|-----|------|
| GET /admin/oauth2/auth/requests/login | login_challengeからリクエスト情報を取得 |
| PUT /admin/oauth2/auth/requests/login/accept | 認証成功をHydraに通知 |
| GET /admin/oauth2/auth/requests/consent | consent_challengeからリクエスト情報を取得 |
| PUT /admin/oauth2/auth/requests/consent/accept | 承認結果をHydraに通知 |
| GET /admin/oauth2/auth/requests/logout | logout_challengeからリクエスト情報を取得 |
| PUT /admin/oauth2/auth/requests/logout/accept | ログアウトをHydraに通知 |

---

## Login Handler

### GET /login

1. クエリパラメータから`login_challenge`を取得する
2. Hydra APIで`login_challenge`を検証し、リクエスト情報を取得する
3. **`skip`フラグが立っていれば（既にセッションがあれば）、フォームを表示せず即座に`accept_login`**
4. そうでなければログインフォームを表示する

### POST /login

1. フォームから`email`、`password`、`login_challenge`を受け取る
2. 認証サービスでパスワードを検証する
3. 認証成功なら、ユーザー情報を`context`に詰めて`accept_login`を呼ぶ
4. Hydraが返すリダイレクトURLへ転送する

```rust
pub async fn login_submit(
    State(state): State<AppState>,
    Form(form): Form<LoginForm>,
) -> Result<Redirect, AppError> {
    // 1. 認証処理
    let user = state.auth.authenticate(&form.email, &form.password).await?;

    // 2. ユーザー情報をcontextに保存（Consent時にDBルックアップ不要）
    let user_context = UserContext {
        email: user.email.clone(),
        role: "customer".to_string(),
        tenant_id: None,
    };

    // 3. Hydraに認証成功を通知
    let completed = state
        .hydra
        .accept_login(
            &form.login_challenge,
            &user.id.to_string(),
            false,
            Some(serde_json::to_value(&user_context)?),
        )
        .await?;

    // 4. Consent画面へリダイレクト
    Ok(Redirect::to(&completed.redirect_to))
}
```

**重要ポイント: `context`の活用**
- Login時に認証したユーザー情報（email、role、tenant_id）をJSON形式で保存
- Consent Providerへ受け渡すことで、Consent処理でDBルックアップが不要になる

---

## Consent Handler

### GET /consent

1. クエリパラメータから`consent_challenge`を取得する
2. Hydra APIでリクエスト情報（要求されたスコープ、クライアント情報）を取得する
3. **`skip`フラグが立っていれば（既に承認済みなら）、即座に`accept_consent`**
4. そうでなければスコープ承認画面を表示する

### POST /consent

1. フォームから`consent_challenge`と承認するスコープを受け取る
2. Login時に保存した`context`からユーザー情報を取得する
3. **IDトークンにカスタムクレーム（`email`、`role`、`tenant_id`）を追加する**
4. `accept_consent`を呼び、Hydraが返すリダイレクトURLへ転送する

> IDトークンにクレームを追加することで、クライアントアプリケーションはトークンをデコードするだけでユーザー情報を取得できる。

---

## Logout Handler

### GET /logout

Login/Consentと比べてシンプル。

1. クエリパラメータから`logout_challenge`を取得する
2. Hydra APIで`accept_logout`を呼び出す
3. Hydraが返すリダイレクトURLへ転送する

```rust
pub async fn logout_handler(
    State(state): State<AppState>,
    Query(query): Query<LogoutQuery>,
) -> Result<Redirect, AppError> {
    let completed = state.hydra.accept_logout(&query.logout_challenge).await?;
    Ok(Redirect::to(&completed.redirect_to))
}
```

> 本番環境では「本当にログアウトしますか？」という確認画面を挟むことを検討してもよい。

---

## 認証サービスの実装

### パスワードハッシュ: Argon2id

OWASPの[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)に従い、**Argon2id**を採用。

`Argon2::default()`を使用しているが、これは意図的。`argon2`クレートのデフォルト値はOWASP推奨設定に準拠している。「専門家が作ったものを信頼する方が合理的」という論理。

### ユーザー列挙攻撃（User Enumeration Attack）対策

```rust
pub async fn authenticate(&self, email: &str, password: &str) -> Result<User, AppError> {
    let users = self.users.read().await;
    let user = users.get(email).ok_or(AppError::InvalidCredentials)?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::InvalidCredentials)?;

    Ok(user.clone())
}
```

**重要**: ユーザーが存在しない場合も、パスワードが間違っている場合も、返すエラーは同じ`InvalidCredentials`。

- 「ユーザーが見つかりません」というエラーを返すと、攻撃者に情報を与えてしまう
- 攻撃者はまず有効なメールアドレスを特定しようとするため

**注意点**: 完全な対策にはタイミング攻撃への考慮も必要。ユーザーが存在しない場合はArgon2の検証が走らないため、レスポンス時間の差で存在を推測される可能性がある。本番環境では、**ユーザー不在時もダミーハッシュを検証する**ことを検討。

参考: [OWASP - Testing for Account Enumeration](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account)

---

## テスト設計

認証システムのバグは「静かに」起きる。普通の機能開発では「この操作をしたらこうなる」というテストを書くが、認証システムでは**「この操作をしてもこうならない」**というテストの方に価値がある。

```rust
#[tokio::test]
async fn test_login_does_not_reveal_user_existence() {
    let service = AuthService::new();
    service.register("exists@example.com", "password").await.unwrap();

    let err1 = service.authenticate("exists@example.com", "wrong").await.unwrap_err();
    let err2 = service.authenticate("nobody@example.com", "password").await.unwrap_err();

    assert_eq!(err1.to_string(), err2.to_string());
}
```

このテストは「エラーメッセージが同じ」という実装の意図を明示化している。将来誰かが「親切なエラーメッセージにしよう」と思って変更しても、このテストが警告を出す。

### 責任分界点

全ての攻撃をアプリケーション層で防ぐ必要はない。何を守り、何をインフラに任せるかを明確にする。

| 対策 | 担当 |
|------|------|
| ブルートフォース対策 | Nginxのrate limitで弾く |
| セッション固定化攻撃 | フレームワーク（Axum + tower-sessions）に委譲 |
| HTTPS強制 | インフラ設定の問題 |

---

## プロジェクト構成

Axumを使用。

```
src/
├── main.rs          # サーバーエントリーポイント
├── auth.rs          # 認証サービス
├── handlers.rs      # Login/Consent/Logoutハンドラー
├── hydra.rs         # Hydra Admin APIクライアント
├── models.rs        # Hydra API型定義
└── error.rs         # エラー型定義
```

ハンドラー層とサービス層を分離。認証ロジックは`auth.rs`に置き、ハンドラーはHTTPリクエストの受け取りとレスポンスの返却だけを担う。

**フルコード**: [GitHub - nwiizo/workspace_2026/samples/ory-hydra-verification](https://github.com/nwiizo/workspace_2026/tree/main/samples/ory-hydra-verification)

---

## 動作確認

```bash
docker compose up -d
./scripts/e2e-test.sh
```

IDトークンに`email`、`role`、`sub`が含まれていれば成功。

---

## 実装チェックリスト

### 必須の実装

- [ ] **Hydra APIクライアント** - 6つのAPI呼び出し
- [ ] **GET /login** - `login_challenge`検証、`skip`フラグ確認、フォーム表示
- [ ] **POST /login** - 認証、`context`にユーザー情報、`accept_login`
- [ ] **GET /consent** - `consent_challenge`検証、`skip`フラグ確認、承認画面表示
- [ ] **POST /consent** - `context`取得、IDトークンにクレーム追加、`accept_consent`
- [ ] **GET /logout** - `logout_challenge`取得、`accept_logout`
- [ ] **認証サービス** - Argon2id、ユーザー列挙攻撃対策

### 忘れがちなポイント

- `login_challenge`と`consent_challenge`はhiddenフィールドでフォームに埋め込む
- `skip`フラグが立っている場合は画面を表示せず即座にacceptする
- `context`でLogin→Consent間のユーザー情報受け渡し
- エラーメッセージはユーザーの存在を漏らさない

---

## おわりに

著者は「キーボードに手を置いたまま止まってしまう」感覚は、たぶんまた来ると述べている。次に認証システムを書くときも、OAuth2のフローを思い出すところから始めるだろうと。

> 認証は「一度理解したら終わり」という領域ではない気がする。毎回、RFCを確認しながら、慎重に実装する。ユーザー列挙攻撃のテストを書いたのも、将来の自分が「親切なエラーメッセージ」を入れようとしたときに止めるためだ。

**重要な結論**: 本番の認証システムはOry Hydraに任せる。Login Providerは自分で書く。その**境界線**が見えることが重要。

---

## 関連記事

- [Ory HydraでOAuth2認可サーバーを構築する](https://syu-m-5151.hatenablog.com/entry/2026/01/04/133007) - 前編
- [Next.jsでOry Hydra認証を実装する ― マルチテナントSaaSでの実践](https://syu-m-5151.hatenablog.com/entry/2026/01/09/104616)
- [OAuth2認証をE2Eテストしたら、5つのバグが出てきた話](https://syu-m-5151.hatenablog.com/entry/2026/01/11/064311)
