# プロジェクト概要

## 基本情報

- プロジェクト名：[プロジェクト名]
- 目的：[プロジェクトの目的]
- リポジトリURL：[GitHubなどのURL]

## 技術スタック

- フロントエンド：Next.js 14+ (App Router), TypeScript 5.0+, Tailwind CSS
- バックエンド：Node.js 18+, Express.js, TypeScript
- データベース：PostgreSQL, Prisma ORM
- インフラ：Vercel, Docker
- テスト：Jest, Playwright
- その他：ESLint, Prettier

## プロジェクト構造

```
/src
  /app         # Next.js App Routerページ
  /components  # Reactコンポーネント
    /ui        # 汎用UIコンポーネント
    /features  # 機能固有コンポーネント
  /lib         # ユーティリティ関数
    /api       # API通信関連
    /utils     # 汎用ユーティリティ
  /hooks       # カスタムReact Hooks
  /types       # TypeScript型定義
  /config      # 設定ファイル
/prisma        # Prismaスキーマとマイグレーション
/public        # 静的アセット
/tests         # テストファイル
  /unit        # ユニットテスト
  /integration # 統合テスト
  /e2e         # E2Eテスト
/docs          # ドキュメント
```

# コーディングガイドライン

## 一般原則

- DRY (Don't Repeat Yourself) 原則を守る
- SOLID原則に従う
- 単一責任の原則を遵守する
- 複雑な条件よりも早期リターンを優先する
- 副作用を最小限に抑え、純粋関数を優先する
- クラスよりも関数とComposition APIを優先する

## TypeScript規約

- すべての関数、変数に明示的な型定義を使用する
- `any`型の使用は避ける、必要な場合は`unknown`を使用する
- インターフェースよりも型エイリアス (type) を優先する
- Zodによる実行時の型検証を使用する
- 複雑な型にはコメントで説明を追加する
- インデックスシグネチャの使用は避ける

```typescript
// 良い例
type UserId = string;
type UserData = {
  id: UserId;
  name: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
};

// 避けるべき例
type Data = any;
```

## Reactコンポーネント規約

- コンポーネントはアトミックデザイン原則に従う
- React.FCの使用は避ける（TypeScriptの型推論を活用）
- Props型は各コンポーネントの直前に定義する
- デフォルトProps値はES6のデフォルトパラメータを使用する
- コンポーネントファイル名はPascalCaseを使用する
- ロジックとUIを分離し、カスタムフックに抽出する

```typescript
// 良い例
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
};

function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## 状態管理

- ローカルな状態には useState を使用する
- 複雑な状態には useReducer を使用する
- グローバル状態には Context API を使用する
- サーバー状態には Tanstack Query または SWR を使用する
- 状態の更新は不変性を保つ
- ステート管理の最適化のためメモ化を適切に使用する

## API通信

- API関数は /lib/api に集約する
- エラーハンドリングは一貫したパターンで行う
- データフェッチには SWR または React Query を使用する
- アクセストークンの扱いには注意する
- API呼び出しは型安全にする
- レスポンスは必ず型検証を行う

```typescript
// 良い例
async function fetchUser(id: string): Promise<UserData> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new ApiError(`Failed to fetch user: ${response.statusText}`, response.status);
    }
    const data = await response.json();
    // Zodで型検証
    return userSchema.parse(data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
```

# セキュリティルール

## 機密情報の取り扱い

- 以下のファイルは読み込み・変更しないこと:
  - .env ファイル
  - **/config/secrets.**
  - **/*.pem
  - API キーを含むファイル
- 環境変数を使用して秘密情報を管理する
- ログやコンソール出力に機密情報を含めない
- 本番環境のシークレットはソースコードにハードコーディングしない

## ユーザー入力の検証

- すべてのユーザー入力は検証する
- クライアント側とサーバー側の両方で検証を実施する
- SQLインジェクションとXSSを防止する
- 入力サイズに制限を設ける

## 認証と認可

- JWT認証には適切な有効期限を設定する
- セッション管理は適切に行う
- HTTPS通信のみを許可する
- CORS設定を適切に行う
- CSRFトークンを使用する

# 開発ワークフロー

## ブランチ戦略

- メインブランチ: `main`（本番環境）
- 開発ブランチ: `develop`（テスト環境）
- フィーチャーブランチ: `feature/[機能名]`
- バグ修正ブランチ: `fix/[バグ名]`
- リリースブランチ: `release/[バージョン]`

## コミット規約

- コミットメッセージは以下の形式で記述:
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント更新
  - `style:` コードスタイルの変更（動作に影響なし）
  - `refactor:` リファクタリング
  - `test:` テスト追加・修正
  - `chore:` ビルドプロセスやツールの変更
- コミット前に lint と test を実行する

## コードレビュープロセス

- PRを作成する前にself-reviewを行う
- コードレビューを依頼する前にCIが成功していることを確認する
- レビュープロセスで指摘された問題は必ず修正する
- レビュー完了後、PRマージは作成者が行う

## デプロイメント

- CI/CDパイプラインで自動デプロイを実施
- 本番デプロイ前には必ずステージング環境でテスト
- デプロイ後の検証手順を実施

# テスト戦略

## テスト種類と対象

- ユニットテスト: 関数、コンポーネント、hooks
- 統合テスト: フォーム送信、API連携
- E2Eテスト: 重要なユーザーフロー
- テストカバレッジ目標: 80%以上

## テスト記述規約

- 各テストは独立して実行できるようにする
- モックは最小限に留め、実際の動作に近づける
- データベーステストには独立したテスト環境を使用
- テスト名は「何をテストしているか」が明確になるようにする

```typescript
// 良い例
test('ユーザーが正しい認証情報を入力すると、ログインに成功する', async () => {
  // テストコード
});

// 避けるべき例
test('ログインテスト', async () => {
  // テストコード
});
```

# エラー防止とトラブルシューティング

## 一般的なミスパターン

- ファイル編集前に必ず現在の内容を確認する
- API呼び出しは必ずtry/catchで囲む
- 型定義は慎重に行い、`as`キャストの使用は最小限にする
- 不確実な対応を行う前にユーザーに確認を取る

## デバッグ手順

1. エラーメッセージを詳細に分析する
2. コードの流れを追跡する
3. 最小再現コードを作成する
4. 変更前後の動作を比較する

## 品質チェックリスト

- テストが追加/更新されているか
- ドキュメントが更新されているか
- エラーハンドリングが適切か
- パフォーマンスへの影響は考慮されているか
- セキュリティリスクは評価されているか

# パフォーマンス最適化

## フロントエンド

- 画像は Next.js Image コンポーネントを使用
- コンポーネントの不要な再レンダリングを防止する
- React.memo, useMemo, useCallbackを適切に使用
- バンドルサイズを監視し、コード分割を活用
- Web Vitalsスコアを監視する

## バックエンド

- データベースクエリの最適化
- N+1問題を避ける
- 適切なインデックス設計
- キャッシュ戦略の実装
- 大量データ処理時はストリーミングを検討

# プロジェクト知識ベース

## 重要な設計決定

- 非同期処理にはPromiseベースのアプローチを採用（理由：エラーハンドリングの一貫性のため）
- 状態管理にはReduxよりContext APIを使用（理由：ボイラープレート削減と学習曲線のため）
- CSSフレームワークにはTailwindを採用（理由：カスタマイズ性と開発速度のバランスのため）

## 既知の問題と対処法

- IE11でのレンダリング問題：polyfillを使用して対応
- 大量データ処理時のメモリリーク：chunking処理で解決
- モバイルでのタッチイベント遅延：passive event listenerを使用

# 技術的負債と改善計画

## 認識されている技術的負債

- レガシーAPIとの互換性コード
- テスト不足のモジュール
- 重複したビジネスロジック
- 最適化されていないデータベースクエリ

## 将来の技術導入計画

- GraphQLへの段階的移行
- マイクロフロントエンド採用の検討
- サーバーレスアーキテクチャの段階的導入
- コンテナオーケストレーション強化

## 非推奨予定の技術

- jQuery（React/Vueへの置き換え）
- REST API（GraphQLへの移行）
- 旧認証システム（OAuth 2.0への移行）
