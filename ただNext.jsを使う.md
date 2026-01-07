---
title: "ただNext.jsを使う"
source: "https://kaminashi-developer.hatenablog.jp/entry/2026/01/06/just-use-next"
author:
  - "osuzu"
published: 2026-01-06
created: 2026-01-07
description: "2025年12月のReact/Next.jsセキュリティ問題を受け、Next.jsをBFFとして採用する際のポイントと構成について解説。DB接続情報やビジネスロジックを持たせず、UIのためのデータ整形・APIアグリゲーション・認可プロキシに徹する設計思想を提唱している。"
tags:
  - "Next.js"
  - "React"
  - "RSC"
  - "BFF"
  - "フロントエンド"
  - "セキュリティ"
  - "アーキテクチャ"
---

## 概要

カミナシエンジニアのosuzuによる記事。2025年12月のReact/Next.jsのセキュリティ問題（CVE）を受けて、Next.jsをプロダクションで採用する際のポイントと、BFF（Backend for Frontend）として意識した構成について解説している。

---

## 1. BFFとして使う

### 基本方針

Next.jsをプロダクションで運用する際、**フルスタックフレームワークやバックエンドを兼ねる形で採用しない**。必ず**BFFとして使う**。

### BFFの構成について

「Next.jsをBFFとして使う」構成とは、物理的にも論理的にもバックエンドAPIと明確に分離された状態を指す。

**Next.jsが担う役割:**

- UIのためのデータ整形
- APIアグリゲーション
- API認可プロキシ

**Next.jsが担わない役割:**

- データベースへの接続
- ビジネスロジック

![BFF構成図](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20260105/20260105171258.png)

---

## 2. 「ブラウザの延長」と捉え、機密情報を保持しない

### 設計思想

Next.jsサーバー（Node.js/Edge Runtime）を「信頼できるサーバー（Trusted）」とは見なさず、**「ブラウザが少し権限を持った延長線上の環境（Untrusted）」**として扱う。

> 「ブラウザのDevToolsで見えて困るロジックや変数は、Next.jsのサーバーサイドにも置かない」

### 実践的なポイント

- DBのパスワードやAWSのシークレットキーを環境変数として渡さない
- 万が一RSCの境界設定ミスでコードが流出しても、攻撃者が手に入れられるのは「画面構築のためのロジック」だけに限定

---

## 3. BFFのインフラ権限を最小化

### IAM権限の最小化

BFFが実行されるコンテナや関数自体の権限（IAM Role等）は最小限に絞る。

**例（AWS上での運用）:**

- ❌ `dynamodb:FullAccess`
- ✅ `dynamodb:GetItem`, `dynamodb:PutItem` など最小限の権限

### トークンの検証責務

認証認可のフローにおいてNext.jsはあくまで**トークンの「運搬役」**に徹する。

**カミナシでの実装例:**

1. バックエンドAPIはOAuthのクライアントでトークンイントロスペクションをリクエスト
2. Next.jsはCookieからトークンを取り出しAPIへ転送するだけ
3. バックエンドAPI側がそのトークンを検証し認可

### 追加のセキュリティ対策

- コンテナをイミュータブルにする
- CookieにHttpOnly, Secure, SameSite属性を設定
- Content Security Policyを設定
- サーバーのアウトバウンド通信を制限
- WAFを導入

> ⚠️ これらはRCE（遠隔コード実行）が存在する場合にセッション乗っ取りリスクをゼロにするものではない

---

## 4. そこまでしてNext.jsを使う必要があるか

### BFFは必要なのか？

「そこまで制約を課すならSPA + APIで良いのではないか？」という議論に対する回答。

**BFFを置くメリット:**

#### Token Handler（認可の橋渡し）

現代のバックエンド（特にマイクロサービス構成）はステートレスな`Bearer Token`を要求することが一般的。

**SPA単体での問題点:**

- JSでトークンを扱う（XSSリスク）
- バックエンド側すべてにCookie認証を対応させる（実装コスト増・CORS問題）

**BFFを挟むメリット:**

- ブラウザとはCookie（セッション）で通信
- バックエンドとはTokenで通信

![Token Handler構成図](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20260105/20260105171404.png)

#### APIアクセスの集約（APIアグリゲーション）

- APIが同一VPCのinternalなリクエストで通信可能
- APIとBFFを同じリージョンにまとめることでネットワーク効率が向上
- Boomer Fetching問題（ブラウザから大量の遅いリクエストが飛ぶ問題）の解消

---

## 5. RSCはBFFとして優れている

### RSCの利点

RSCを**「宣言的なBFF」**として捉えると非常に優秀。

**従来のBFF:**

- Expressを使ったりGraphQLを使うなどの「詰め替え業」が必要

**RSCの場合:**

- コンポーネントツリーの中で直接非同期データを取得
- それをPropsとして流し込むだけで済む
- データの取得とUIの構造がコロケーション（同居）
- 型安全にバックエンドAPIのレスポンスをクライアントコンポーネントへ渡せる
- Reactを同期的に書くことができ、非同期で発生する難しさを解消

---

## 6. なぜNext.jsじゃなくても良いか

### フルスタックフレームワークとしての道を失った

Next.jsはApp Router以降、フルスタックフレームワークとしての道を失った。

**Page Router時代:**

- ServerからClientへのPropsの境界が明確（getServerSidePropsで境界が分かれていた）
- 貧者の選択としてNext.jsでサーバーを実装する選択も取り得た

**App Router以降（特にCVE以降）:**

- そうした構成を取ることは明確に難しくなった

### 対抗フレームワークの出現

**Tanstack Start:**

- UIライブラリがReactに依存していない
- サーバー/クライアントの境界を明確に区別する思想

参考: [Server Functions vs Server Actions比較](https://tanstack.com/start/latest/docs/framework/react/comparison#server-functions-vs-server-actions)

### React以外の選択肢

Tanstack StartもReact Routerも将来的にRSCを取り入れていく方針。現在のシンプルさはRSC未対応ゆえであり、今後の混乱は不明。

React以外という道を考える人もいるかもしれないが、採用市場やフレームワーク自体の完成度を見ると難しい選択になる。

---

## 7. 結論：ただNext.jsを使う

### ドメインに時間を使う

著者が大切にしているテーマ：

> **「どうでもいいことは流行に従い、重大なことは標準に従い、ドメインのことは自ら設計する」**

### 著者の姿勢

- カミナシには「現場ドリブン」というバリューが存在
- 2025年だけでCS活動やプロダクトディスカバリや商談同席など現場に10件以上訪問
- エンジニアとしての時間をドメインを考えることに使いたいという想いが強まっている

### 最終メッセージ

> 技術選定の正解探しに時間を溶かすのではなく、**選んだ技術を正解にするためのオーナーシップ**と、何より**ユーザーへの価値提供**を大切にしていきたい

---

## 関連リンク

- [React Server Componentの解説（登壇資料）](https://speakerdeck.com/kaminashi/what-do-react-server-components-solve-and-what-do-they-not-solve)
- [Next.jsに関する記事](https://zenn.dev/suzu_4/articles/2e6dbb25c12ee5)
- [ReactのCVE情報](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [Next.jsのCVE情報](https://nextjs.org/blog/CVE-2025-66478)
- [著者の前職でのSPA構築経験](https://zenn.dev/atamaplus/articles/30832dda37da52)
- [カミナシ採用サイト](https://careers.kaminashi.jp/)
- [カミナシ求人一覧](https://herp.careers/v1/kaminashi)
