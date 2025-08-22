# AWS Cognito認証付きReactアプリケーション

このプロジェクトは、AWS Cognitoを使用した認証機能を持つ最小限のReactアプリケーションです。

## 機能

- ユーザー登録（サインアップ）
- メール確認
- ログイン
- ログアウト
- 保護されたルート（認証が必要なページ）

## セットアップ

### 1. AWS Cognitoユーザープールの作成

1. AWSコンソールにログイン
2. Cognitoサービスに移動
3. 「ユーザープールを作成」をクリック
4. 以下の設定でユーザープールを作成:
   - サインイン オプション: メールアドレス
   - パスワードポリシー: 最小8文字
   - MFA: オプション（今回は無効）
   - セルフサービス サインアップ: 有効
   - メール検証: 有効

5. アプリケーションクライアントを作成:
   - パブリッククライアント
   - クライアントシークレットなし
   - 認証フロー: ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH

### 2. アプリケーションの設定

`src/aws-config.ts`ファイルを編集し、実際のCognito設定値を入力:

```typescript
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'YOUR_USER_POOL_ID', // 例: us-east-1_xxxxxxxxx
      userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID', // 例: 1234567890abcdefghijklmnop
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false
      }
    }
  }
};
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. アプリケーションの起動

```bash
npm start
```

アプリケーションは http://localhost:3000 で起動します。

## 使い方

1. **サインアップ**: `/signup`にアクセスし、メールアドレスとパスワードで新規登録
2. **メール確認**: 登録したメールアドレスに送信される確認コードを入力
3. **ログイン**: `/login`でメールアドレスとパスワードを使用してログイン
4. **ホーム画面**: ログイン後、保護されたホーム画面(`/home`)にアクセス可能
5. **ログアウト**: ホーム画面からサインアウト可能

## プロジェクト構造

```
src/
├── components/
│   ├── Login.tsx         # ログインコンポーネント
│   ├── SignUp.tsx        # サインアップコンポーネント
│   ├── Home.tsx          # ホーム画面コンポーネント
│   └── PrivateRoute.tsx  # 認証保護ルートコンポーネント
├── aws-config.ts         # AWS Cognito設定
└── App.tsx              # メインアプリケーション
```

## セキュリティに関する注意

- 本番環境では、Cognito設定値を環境変数として管理してください
- HTTPS接続を使用してください
- 適切なCORSポリシーを設定してください

## トラブルシューティング

- **ログインできない**: Cognitoユーザープールの設定を確認
- **確認コードが届かない**: スパムフォルダを確認、SESの設定を確認
- **CORS エラー**: Cognitoアプリクライアントの設定を確認
