---
title: "vercel-labs/emulate: Local API emulation for CI and no-network sandboxes"
source: "https://github.com/vercel-labs/emulate"
author:
  - "[[Vercel Labs]]"
published: 2026-03-20
created: 2026-04-06
description: "Vercel Labsが開発したローカルAPIエミュレーションツール。CI環境やネットワークのないサンドボックスで、Vercel・GitHub・Google・Slack・Apple・Microsoft・AWSの各種APIをフルステートフルに再現する。モックではなく本番忠実度のAPIエミュレーションを提供し、ゼロコンフィグで即座に起動可能。"
tags:
  - "clippings"
  - "Vercel"
  - "API Emulation"
  - "CI/CD"
  - "Testing"
  - "TypeScript"
  - "OAuth"
  - "Developer Tools"
  - "Next.js"
---

## 概要

`emulate` は Vercel Labs が開発したオープンソースのローカルAPIエミュレーションツールである。CI環境やネットワーク接続のないサンドボックスにおいて、主要なクラウドサービスのAPIを**フルステートフル**かつ**本番忠実度**で再現する。単なるモックではなく、状態を保持し、関連エンティティへの変更を正しく伝播する本格的なエミュレーターである。

`npx emulate` の一行で7つのサービス（Vercel、GitHub、Google、Slack、Apple、Microsoft、AWS）を同時に起動でき、設定ファイルなしですぐに使い始められる。TypeScriptで実装されており、Apache License 2.0で公開されている。

## 主要なトピック

### クイックスタートとCLI

ゼロコンフィグでの起動が可能で、各サービスはデフォルトでポート4000から順に自動割り当てされる：

| サービス | デフォルトポート |
|----------|-----------------|
| Vercel | `http://localhost:4000` |
| GitHub | `http://localhost:4001` |
| Google | `http://localhost:4002` |
| Slack | `http://localhost:4003` |
| Apple | `http://localhost:4004` |
| Microsoft | `http://localhost:4005` |
| AWS | `http://localhost:4006` |

主なCLIコマンド：
- `emulate` — 全サービス起動
- `emulate --service vercel,github` — 特定サービスのみ起動
- `emulate --port 3000` — カスタムポート指定
- `emulate --seed config.yaml` — シード設定ファイル指定
- `emulate init` — スターター設定ファイル生成
- `emulate list` — 利用可能なサービス一覧

### プログラマティックAPI

npm パッケージとしてインストールし、`createEmulator()` 関数で各サービスを個別に起動できる：

```typescript
import { createEmulator } from 'emulate'

const github = await createEmulator({ service: 'github', port: 4001 })
const vercel = await createEmulator({ service: 'vercel', port: 4002 })

await github.close()
await vercel.close()
```

**Vitest/Jest との統合**も容易で、`beforeAll` でエミュレーター起動、`afterEach` で `reset()` による状態リセット、`afterAll` で `close()` によるシャットダウンという標準的なパターンが推奨されている。

インスタンスメソッド：
- `url` — 実行中サーバーのベースURL
- `reset()` — ストアをワイプしシードデータを再適用
- `close()` — HTTPサーバーをシャットダウン（Promise返却）

### 設定（Configuration）

設定はオプションで、以下の順序で自動検出される：
1. `emulate.config.yaml` / `.yml`
2. `emulate.config.json`
3. `service-emulator.config.yaml` / `.yml`
4. `service-emulator.config.json`

YAML/JSON形式のシード設定ファイルにより、ユーザー、チーム、リポジトリ、OAuthクライアント、S3バケット、SQSキュー等の初期データを定義できる。

### 対応サービス詳細

#### Vercel API

フルステートフルなVercelスタイルのJSON応答とカーソルベースのページネーションを提供：
- **ユーザー・チーム**: 認証ユーザー取得/更新、チームCRUD、メンバー管理
- **プロジェクト**: 作成（env変数・Git統合付き）、検索、更新、削除（カスケード）
- **デプロイメント**: 作成（自動でREADYに遷移）、一覧、キャンセル、エイリアス、ビルドログ、ファイルアップロード
- **ドメイン**: 追加（検証チャレンジ付き）、CRUD、ドメイン検証
- **環境変数**: 一覧（復号オプション付き）、作成（単体/バッチ/upsert）、更新、削除

#### GitHub API

フルステートフルで、作成・更新・削除がメモリ上で永続化され関連エンティティに影響する：
- **ユーザー/リポジトリ**: プロフィール、リポジトリCRUD（カスケード削除）、トピック、フォーク、コラボレーター、転送
- **Issue/Pull Request**: フィルタ付き一覧、CRUD、状態遷移、ロック/アンロック、タイムライン、アサイン管理、マージ（ブランチ保護の強制付き）、レビュアー管理
- **コメント/レビュー**: Issue・PR・コミットコメントのフルCRUD、インラインコメント付きレビュー作成、却下
- **ラベル/マイルストーン**: フルCRUD、状態遷移、Issue数カウント
- **ブランチ/Gitデータ**: ブランチ保護CRUD、Refs、コミット、ツリー（再帰対応）、Blob、タグ
- **組織/チーム**: CRUD、メンバー管理
- **リリース**: CRUD、アセットアップロード、リリースノート生成
- **Webhook**: リポジトリ/組織Webhook CRUD、登録URLへのリアルHTTP配信
- **検索**: リポジトリ、Issue、ユーザー、コード、コミット、トピック、ラベルの全文検索
- **Actions**: ワークフロー、ワークフロー実行、ジョブ、アーティファクト、シークレット
- **Checks**: チェックラン、チェックスイート、自動ステータスロールアップ
- **GitHub Apps**: JWT認証、インストールアクセストークン、Webhookペイロード配信

#### Google OAuth + Gmail, Calendar, Drive

OAuth 2.0、OpenID Connect対応。Gmail・Calendar・Driveの主要操作をローカルで再現：
- **Gmail**: メッセージCRUD（full/metadata/minimal/raw形式）、送信、インポート、ラベル操作、下書き、スレッド、フィルター、履歴
- **Calendar**: カレンダーリスト、イベントCRUD、空き時間検索
- **Drive**: ファイルCRUD、アップロード

#### Slack API

フルステートフルなSlack Web APIエミュレーション：
- **Auth/Chat**: 認証テスト、メッセージ投稿（スレッド対応）、更新、削除
- **Conversations**: チャンネルCRUD、履歴、スレッド返信、参加/退出
- **Users/Reactions**: ユーザー一覧、リアクション管理
- **OAuth**: OAuth v2フロー、ユーザーピッカーUI

#### Apple Sign In

Sign in with Appleエミュレーション：
- 認可コードフロー、PKCE対応
- RS256 IDトークン
- OIDC ディスカバリ、JWKS

#### Microsoft Entra ID

Azure AD v2.0 OAuth 2.0 / OIDC エミュレーション：
- 認可コードフロー、PKCE対応
- クライアントクレデンシャルグラント
- Microsoft Graph `/v1.0/me` エンドポイント
- トークン取り消し、ログアウト

#### AWS

S3、SQS、IAM、STSの各エミュレーション（AWS互換XML応答）：
- **S3**: バケットCRUD、オブジェクトCRUD（コピー対応）
- **SQS**: キュー作成/削除、メッセージ送受信
- **IAM**: ユーザー/アクセスキー/ロールCRUD
- **STS**: `GetCallerIdentity`、`AssumeRole`

### OAuth & インテグレーション

各サービスのOAuthアプリ/クライアントをYAMLで設定可能。OAuthアプリが未設定の場合は任意の `client_id` を受け入れる後方互換モードが適用され、設定がある場合は厳密なバリデーションが強制される。

GitHub Appsは完全対応で、JWT認証（RS256）、インストールアクセストークン、Webhook配信（`X-Hub-Signature-256`ヘッダー付き）を再現する。

### Next.js 統合

`@emulators/adapter-next` により、エミュレーターをNext.jsアプリに直接埋め込み、同一オリジンで動作させることが可能。これにより **VercelプレビューデプロイメントでのコールバックURL変更問題**を解決する。

```typescript
// app/emulate/[...path]/route.ts
import { createEmulateHandler } from '@emulators/adapter-next'
import * as github from '@emulators/github'

export const { GET, POST, PUT, PATCH, DELETE } = createEmulateHandler({
  services: {
    github: { emulator: github, seed: { /* ... */ } },
  },
})
```

**Auth.js / NextAuth** との統合では、プロバイダーのエンドポイントを同一オリジンのエミュレーターパスに向けるだけで動作する。

**永続化**: デフォルトではインメモリでコールドスタート毎にリセットされるが、`persistence` アダプターを渡すことでKVストアやファイルへの永続化が可能。`@emulators/core` には `filePersistence` が同梱されている。

### アーキテクチャ

```
packages/
  emulate/          # CLIエントリーポイント（commander）
  @emulators/
    core/           # HTTPサーバー、インメモリストア、プラグインインターフェース
    adapter-next/   # Next.js App Router統合
    vercel/         # Vercel APIサービス
    github/         # GitHub APIサービス
    google/         # Google OAuth + Gmail/Calendar/Drive
    slack/          # Slack Web API
    apple/          # Apple Sign In
    microsoft/      # Microsoft Entra ID
    aws/            # AWS S3/SQS/IAM/STS
apps/
  web/              # ドキュメントサイト（Next.js）
```

コアは汎用的な `Store` を提供し、型付き `Collection<T>` インスタンスがCRUD、インデキシング、フィルタリング、ページネーションをサポート。各サービスプラグインが共有の **Hono** アプリにルートを登録し、ストアを状態管理に使用する。

### 認証（Auth）

トークンはシード設定で定義され、ユーザーにマッピングされる。`Authorization: Bearer <token>` または `Authorization: token <token>` として渡す。

| サービス | 認証方式 | ページネーション |
|----------|---------|----------------|
| Vercel | Bearer トークン + teamId/slugクエリパラメータ | カーソルベース |
| GitHub | Bearer トークン（パブリックリポは認証不要） | page/per_page + Linkヘッダー |
| Google | OAuth 2.0 認可コードフロー | — |
| Slack | Bearer トークン | カーソルベース |
| Apple | OIDC 認可コードフロー（RS256 IDトークン） | — |
| Microsoft | OIDC + PKCE + クライアントクレデンシャル | — |
| AWS | Bearer トークンまたはIAMアクセスキー | — |

## 重要な事実・データ

- **GitHubスター数**: 906（2026年4月時点）
- **フォーク数**: 41
- **ライセンス**: Apache License 2.0
- **言語**: TypeScript
- **リポジトリ作成日**: 2026-03-20
- **対応サービス数**: 7（Vercel、GitHub、Google、Slack、Apple、Microsoft、AWS）
- **ゼロコンフィグ起動**: `npx emulate` の一行で全サービス起動可能
- **Honoベース**: HTTPサーバーフレームワークにHonoを採用
- **パッケージ構成**: 各エミュレーターは `@emulators/*` として独立パブリッシュ
- **AWSデフォルト認証情報**: `AKIAIOSFODNN7EXAMPLE` / `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

## 結論・示唆

### プロジェクトの意義

`emulate` は、外部APIに依存するアプリケーションの開発・テストにおける大きな課題を解決する。従来のモックやスタブでは再現が困難だった**ステートフルなAPI動作**（カスケード削除、ページネーション、Webhook配信など）を本番忠実度で提供することで、CI環境やサンドボックスでの統合テストの信頼性を大幅に向上させる。

### 実践的な示唆

- **CI/CDパイプライン**: ネットワーク不要でフルAPI統合テストを実行可能にし、テストの安定性と速度を向上させる
- **プレビューデプロイメント**: Next.js統合により、Vercelプレビューデプロイメントでも同一オリジンでOAuth認証フローをテスト可能
- **ローカル開発**: 外部サービスの契約やアカウント設定なしに、本番相当のAPI動作でローカル開発が可能
- **チーム標準化**: YAMLベースのシード設定により、チーム全体で統一された開発データセットを共有できる

## 制限事項・注意点

- 状態はデフォルトでインメモリのため、コールドスタートごとにリセットされる（永続化アダプターで対応可能）
- 各サービスのAPI対応は主要エンドポイントに限定されており、全てのAPIエンドポイントが網羅されているわけではない可能性がある
- GitHub Appsの秘密鍵はシード設定に直接記載する必要がある
- AWSエミュレーションはS3、SQS、IAM、STSに限定されており、DynamoDB、Lambda等は未対応

---

*Source: [vercel-labs/emulate](https://github.com/vercel-labs/emulate)*
