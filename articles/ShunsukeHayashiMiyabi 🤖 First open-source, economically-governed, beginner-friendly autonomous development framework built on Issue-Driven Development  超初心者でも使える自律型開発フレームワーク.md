---
title: "ShunsukeHayashi/Miyabi: 🤖 First open-source, economically-governed, beginner-friendly autonomous development framework built on Issue-Driven Development | 超初心者でも使える自律型開発フレームワーク"
source: "https://github.com/ShunsukeHayashi/Miyabi"
author:
  - "Shunsuke Hayashi"
published: 2025-10-09
created: 2025-10-11
description: |
  MiyabiはGitHub as OSアーキテクチャに基づく完全自律型AI開発オペレーションプラットフォームです。Issue作成からコード実装、PR作成、デプロイまでを完全自動化し、7つの自律AIエージェントが協調してタスクを処理します。一つのコマンド（npx miyabi）で全てが完結し、10-15分でPRが完成します。Claude AI搭載、83%のテストカバレッジ、72%の効率化を実現。
tags:
  - "ai"
  - "automation"
  - "autonomous-agents"
  - "github-actions"
  - "claude-ai"
  - "issue-driven-development"
  - "typescript"
  - "devops"
  - "cicd"
  - "code-generation"
---

## 概要

**Miyabi（雅）** は、GitHub as OSアーキテクチャに基づいた完全自律型AI開発オペレーションプラットフォームです。たった一つのコマンド `npx miyabi` で、Issue作成からコード実装、PR作成、デプロイまでの開発ワークフロー全体を**完全自動化**します。

### プロジェクト情報

- **バージョン**: v0.8.0（2025-10-09リリース）
- **ライセンス**: Apache License 2.0
- **Stars**: 24
- **Forks**: 3
- **言語**: TypeScript (59.5%), HTML (22.5%), JavaScript (11.6%)
- **npm**: [miyabi](https://www.npmjs.com/package/miyabi)

## クイックスタート

```bash
npx miyabi
```

**これだけで全てが自動で完結します。**10-15分でPRが完成し、レビューしてマージするだけです。

## 主な特徴

### 🤖 7つの自律AIエージェント

Miyabiは7つの専門エージェントが協調して動作します：

| エージェント | 役割 | 主な機能 |
|------------|------|---------|
| **CoordinatorAgent** | タスク統括 | DAG（有向非巡回グラフ）分解、並列実行制御、進捗管理 |
| **IssueAgent** | Issue分析 | 53ラベル自動分類、優先度判定 |
| **CodeGenAgent** | コード生成 | Claude Sonnet 4による高品質実装 |
| **ReviewAgent** | 品質判定 | 静的解析、セキュリティスキャン、品質スコアリング（0-100点） |
| **PRAgent** | PR作成 | Conventional Commits準拠のPR作成 |
| **DeploymentAgent** | デプロイ | Firebase自動デプロイ・Rollback |
| **TestAgent** | テスト | Vitest自動実行、80%以上のカバレッジ |

### 🔄 完全自動ワークフロー

```
Issue作成 → IssueAgent → CoordinatorAgent → CodeGenAgent 
→ TestAgent → ReviewAgent → PRAgent → DeploymentAgent → 完了
```

### 🏗️ GitHub OS統合（15コンポーネント）

GitHubの機能をOSのように活用：

- **Issues**: タスク管理
- **Actions**: CI/CDパイプライン
- **Projects V2**: データ永続化
- **Webhooks**: イベントバス
- **Pages**: ダッシュボード
- **Packages**: パッケージ配布
- **Discussions**: メッセージキュー
- **Releases**: バージョン管理
- **Environments**: デプロイ環境
- **Security**: 脆弱性スキャン
- **Labels**: 53ラベル体系
- **Milestones**: マイルストーン管理
- **Pull Requests**: コードレビュー
- **Wiki**: ドキュメント
- **API**: GraphQL/REST API

### 🏷️ 53ラベル体系

| カテゴリ | ラベル数 | 例 |
|---------|---------|-----|
| 優先度 | 4 | `P0-Critical`, `P1-High`, `P2-Medium`, `P3-Low` |
| ステータス | 8 | `status:backlog`, `status:implementing`, `status:done` |
| タイプ | 12 | `type:feature`, `type:bug`, `type:refactor` |
| エリア | 15 | `area:frontend`, `area:backend`, `area:infra` |
| Agent | 7 | `agent:coordinator`, `agent:codegen`, `agent:review` |
| 難易度 | 5 | `complexity:trivial`, `complexity:simple`, `complexity:complex` |
| その他 | 2 | `good-first-issue`, `help-wanted` |

## インストール方法

### 方法1: npx（推奨）

```bash
npx miyabi
```

### 方法2: グローバルインストール

```bash
npm install -g miyabi
miyabi
```

### 方法3: パッケージに追加

```bash
npm install --save-dev miyabi
npx miyabi
```

### 方法4: Claude Code Plugin（新機能）

MiyabiはClaude Codeの公式Pluginとしても利用可能：

```bash
# Claude Code内で実行
/plugin install miyabi
```

利用可能なコマンド：

- `/miyabi-init` - 新規プロジェクト作成
- `/miyabi-status` - ステータス確認
- `/miyabi-auto` - Water Spider自動モード
- `/miyabi-todos` - TODO検出・Issue化
- `/miyabi-agent` - Agent実行
- `/miyabi-docs` - ドキュメント生成
- `/miyabi-deploy` - デプロイ実行
- `/miyabi-test` - テスト実行

#### イベントフック（Plugin限定）

Claude Code Pluginとして使用すると、以下のフックが自動実行：

| Hook | タイミング | 実行内容 |
|------|----------|---------|
| `pre-commit` | コミット前 | Lint実行、Type check、テスト実行 |
| `post-commit` | コミット後 | コミット情報表示、メトリクス更新 |
| `pre-pr` | PR作成前 | Rebase確認、テスト実行、カバレッジ確認、Conventional Commits検証 |
| `post-test` | テスト後 | カバレッジレポート生成、HTMLレポート出力 |

## 使い方

### 新規プロジェクト作成

```bash
$ npx miyabi

? 何をしますか？ 🆕 新しいプロジェクトを作成
? プロジェクト名: my-awesome-app
? プライベートリポジトリにしますか？ No

🚀 セットアップ開始...
✓ GitHubリポジトリ作成
✓ ラベル設定（53個）
✓ ワークフロー配置（10+個）
✓ Projects V2設定
✓ ローカルにクローン

🎉 完了！
```

### 既存プロジェクトに追加

```bash
$ cd my-existing-project
$ npx miyabi

? 何をしますか？ 📦 既存プロジェクトに追加
? ドライランで確認しますか？ Yes

🔍 プロジェクト解析中...
✓ 言語検出: JavaScript/TypeScript
✓ フレームワーク: Next.js
✓ ビルドツール: Vite
✓ パッケージマネージャー: pnpm
```

### ステータス確認

```bash
$ npx miyabi

? 何をしますか？ 📊 ステータス確認

╔════════════════════════════════════╗
║   📊 Miyabi ステータス            ║
╚════════════════════════════════════╝

┌─────────────┬───────┬─────────────┐
│ State       │ Count │ Status      │
├─────────────┼───────┼─────────────┤
│ Pending     │   2   │ ⏳ 待機中   │
│ Implementing│   3   │ ⚡ 作業中   │
│ Reviewing   │   1   │ 🔍 レビュー │
│ Done        │  15   │ ✓ 完了      │
└─────────────┴───────┴─────────────┘
```

## アーキテクチャ

### 組織設計原則

Miyabiは明確な組織理論の**5原則**に基づいた自律型システム設計：

1. **責任の明確化（Clear Accountability）**: 各AgentがIssueに対する明確な責任を負う
2. **権限の委譲（Delegation of Authority）**: Agentは自律的に判断・実行可能
3. **階層の設計（Hierarchical Structure）**: Coordinator → 各専門Agent
4. **結果の評価（Result-Based Evaluation）**: 品質スコア、カバレッジ、実行時間で評価
5. **曖昧性の排除（Elimination of Ambiguity）**: DAGによる依存関係明示、状態ラベルで進捗可視化

### AIエージェント詳細

#### CoordinatorAgent - タスク統括

```typescript
// DAGベースの依存関係解析
const dag = await coordinator.analyzeDependencies(issue);

// 並列実行可能なタスクを自動検出
const parallelTasks = dag.getParallelizableTasks();

// Critical Path最適化
const optimizedPlan = dag.optimizeCriticalPath();
```

機能：

- DAG（有向非巡回グラフ）による依存関係解析
- 並列実行可能タスクの自動検出
- Critical Path最適化（72%効率化）
- リアルタイム進捗トラッキング

#### CodeGenAgent - AI駆動コード生成

```typescript
// Claude Sonnet 4による高品質コード生成
const code = await codeGen.generate({
  task: "Implement user authentication",
  framework: "Next.js",
  testFramework: "Vitest",
  coverage: 80
});
```

機能：

- Claude Sonnet 4による実装
- TypeScript/JavaScript完全対応
- テスト自動生成（80%+カバレッジ）
- Conventional Commits準拠

#### ReviewAgent - コード品質判定

```typescript
// 静的解析 + セキュリティスキャン
const review = await reviewer.analyze(code);

// 品質スコアリング（80点以上でマージ可能）
if (review.qualityScore >= 80) {
  await pr.approve();
}
```

機能：

- 静的解析（ESLint, TypeScript）
- セキュリティスキャン（CodeQL, Gitleaks）
- 品質スコアリング（0-100点）
- 自動修正提案

## パフォーマンス

### 並列実行効率: 72%向上

```
従来のシーケンシャル実行:
A → B → C → D → E → F   (36時間)

Miyabiの並列実行:
     ┌─ B ─┐
A ──┤      ├─ F         (26時間)
     └─ E ─┘
     ↓ 72%効率化 (-10時間)
```

### 品質指標

- **テストカバレッジ**: 83.78%（目標: 80%+）
- **品質スコア**: 80点以上でマージ可能
- **平均処理時間**: 10-15分（Issue → PR）
- **成功率**: 95%以上（自動PR作成）

## セキュリティ

### 多層セキュリティ対策

#### 静的解析

- CodeQL（GitHub Advanced Security）
- ESLintセキュリティルール
- TypeScript strict mode
- Dependency vulnerability scan

#### シークレット管理

- Gitleaks統合
- `.env`ファイル自動除外
- GitHub Secrets推奨
- gh CLI優先認証

#### 依存関係

- Dependabot自動PR
- npm audit統合
- SBOM生成（CycloneDX）
- OpenSSF Scorecard

#### アクセス制御

- CODEOWNERS自動生成
- ブランチ保護ルール
- 最小権限の原則
- 2FA推奨

## 環境変数

### GitHub認証（必須）

**推奨方法: gh CLI**

```bash
# GitHub CLIで認証（推奨）
gh auth login

# アプリケーションは自動的に 'gh auth token' を使用
```

**代替方法: 環境変数（CI/CD用）**

```bash
export GITHUB_TOKEN=ghp_xxxxx
```

### Anthropic API Key（Agent実行時に必要）

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### オプション設定

```bash
export MIYABI_LOG_LEVEL=info
export MIYABI_PARALLEL_AGENTS=3
```

## 必要要件

### 基本要件

- **Node.js**: >= 18.0.0（推奨: v20 LTS）
- **Git**: Latest
- **GitHubアカウント**: 必須
- **GitHub Personal Access Token**: 必須

### オプション

- **gh CLI**: GitHub CLI（推奨）
- **Anthropic API Key**: Agent実行時に必要

### サポート環境

- ✅ macOS (Intel / Apple Silicon)
- ✅ Linux (Ubuntu, Debian, RHEL系)
- ✅ Windows (WSL2推奨)
- ⚠️ Termux (一部機能制限あり)

## コマンドリファレンス

### 対話モード

```bash
npx miyabi

? 何をしますか？
  🌸 初めての方（セットアップガイド）
  🆕 新しいプロジェクトを作成
  📦 既存プロジェクトに追加
  📊 ステータス確認
  📚 ドキュメント生成
  ⚙️  設定
  ❌ 終了
```

### CLIモード

```bash
# 新規プロジェクト作成
npx miyabi init <project-name> [--private] [--skip-install]

# 既存プロジェクトに追加
npx miyabi install [--dry-run]

# ステータス確認
npx miyabi status [--watch]

# ドキュメント生成
npx miyabi docs [--input ./src] [--output ./docs/API.md] [--watch] [--training]

# 設定管理
npx miyabi config

# セットアップガイド
npx miyabi setup
```

## ドキュメント

### 公式ドキュメント

- [Termux環境ガイド](https://github.com/ShunsukeHayashi/Miyabi/blob/main/docs/TERMUX_GUIDE.md) - Android/Termux環境での使用方法
- [セキュリティポリシー](https://github.com/ShunsukeHayashi/Miyabi/blob/main/SECURITY.md) - セキュリティ脆弱性の報告方法
- [プライバシーポリシー](https://github.com/ShunsukeHayashi/Miyabi/blob/main/PRIVACY.md) - データ収集とプライバシー保護
- [コントリビューション](https://github.com/ShunsukeHayashi/Miyabi/blob/main/CONTRIBUTING.md) - プロジェクトへの貢献方法・CLA
- [コミュニティガイドライン](https://github.com/ShunsukeHayashi/Miyabi/blob/main/COMMUNITY_GUIDELINES.md) - Discordコミュニティの行動規範
- [パブリッシュガイド](https://github.com/ShunsukeHayashi/Miyabi/blob/main/docs/PUBLICATION_GUIDE.md) - npm公開手順
- [Agent開発ガイド](https://github.com/ShunsukeHayashi/Miyabi/blob/main/packages/miyabi-agent-sdk/README.md) - カスタムAgent作成
- [Claude Code統合](https://github.com/ShunsukeHayashi/Miyabi/blob/main/packages/cli/CLAUDE.md) - Claude Code設定

### コミュニティ・サポート

- **Discord**: 準備中（[Discord Community Plan](https://github.com/ShunsukeHayashi/Miyabi/blob/main/docs/DISCORD_COMMUNITY_PLAN.md)参照）
- **GitHub Discussions**: [議論・質問](https://github.com/ShunsukeHayashi/Miyabi/discussions)

## トラブルシューティング

### OAuth認証エラーが発生する

**エラー**: `Failed to request device code: Not Found`

**原因**: OAuth Appが未設定のため、デバイスフロー認証が使えません。

**解決方法**:

1. <https://github.com/settings/tokens/new> にアクセス
2. 以下の権限を選択:
   - `repo` - Full control of private repositories
   - `workflow` - Update GitHub Action workflows
   - `read:project`, `write:project` - Access projects
3. トークンを生成してコピー
4. プロジェクトのルートに `.env` ファイルを作成:

   ```bash
   echo "GITHUB_TOKEN=ghp_your_token_here" > .env
   ```

5. もう一度 `npx miyabi` を実行

### 古いバージョンが実行される

**解決方法**:

```bash
# グローバルインストールを削除
npm uninstall -g miyabi

# npxキャッシュをクリア
rm -rf ~/.npm/_npx

# 最新版を明示的に指定
npx miyabi@latest
```

### トークンが無効と表示される

**解決方法**:

```bash
# 古いトークンを削除
rm .env

# 新しいトークンを作成（上記の手順に従う）
echo "GITHUB_TOKEN=ghp_new_token" > .env
```

## ⚠️ AI生成コードに関する重要な注意事項

MiyabiはClaude AIを使用して自動的にコードを生成します。以下の点にご注意ください：

### ユーザーの責任

- ✅ **必ずレビュー**: 生成されたコードをマージ前に必ず確認してください
- ✅ **徹底的なテスト**: 本番環境以外で十分にテストしてください
- ✅ **エラーの可能性**: AIが生成するコードには予期しないエラーが含まれる可能性があります
- ✅ **本番デプロイの責任**: 本番環境へのデプロイはユーザーの責任です

### 免責事項

**Miyabiプロジェクトは、AI生成コードに起因する問題について一切の責任を負いません。** 生成されたコードの品質、セキュリティ、動作については、ユーザー自身で確認・検証してください。

詳細は[LICENSE](https://github.com/ShunsukeHayashi/Miyabi/blob/main/LICENSE)および[NOTICE](https://github.com/ShunsukeHayashi/Miyabi/blob/main/NOTICE)をご覧ください。

## コントリビューション

Miyabiへのコントリビューションを歓迎します！

### 報告・提案

- 🐞 **バグ報告**: [GitHub Issues](https://github.com/ShunsukeHayashi/Miyabi/issues)
- 💡 **機能提案**: [GitHub Discussions](https://github.com/ShunsukeHayashi/Miyabi/discussions)
- 🔒 **セキュリティ報告**: [SECURITY.md](https://github.com/ShunsukeHayashi/Miyabi/blob/main/SECURITY.md)

### 開発に参加

```bash
# 1. リポジトリをフォーク
# 2. フィーチャーブランチを作成
git checkout -b feature/amazing-feature

# 3. 変更をコミット（Conventional Commits準拠）
git commit -m 'feat: Add amazing feature'

# 4. ブランチをプッシュ
git push origin feature/amazing-feature

# 5. Pull Requestを作成
```

### コミットメッセージ規約

Conventional Commits準拠:

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント更新
- `chore:` - ビルド・設定変更
- `test:` - テスト追加・修正
- `refactor:` - リファクタリング
- `perf:` - パフォーマンス改善

## ライセンス

### Apache License 2.0

Copyright (c) 2025 Shunsuke Hayashi

このソフトウェアは**商標保護**と**特許保護**を含むApache 2.0ライセンスの下で提供されています。

#### ライセンス要件

- ✅ 「Miyabi」は Shunsuke Hayashi の商号です（未登録商標）
- ✅ 改変版を配布する場合は、変更内容を明示する必要があります
- ✅ 詳細は [LICENSE](https://github.com/ShunsukeHayashi/Miyabi/blob/main/LICENSE) および [NOTICE](https://github.com/ShunsukeHayashi/Miyabi/blob/main/NOTICE) ファイルをご覧ください

## サポート

### スポンサーになる

- [GitHub Sponsors](https://github.com/sponsors/ShunsukeHayashi)
- [Patreon](https://www.patreon.com/ShunsukeHayashi)

### コンタクト

- 🐦 **X (Twitter)**: [@The_AGI_WAY](https://x.com/The_AGI_WAY)
- 💬 **Discord**: [Miyabi Community](https://discord.gg/miyabi)
- 🌐 **Website**: [note.ambitiousai.co.jp](https://note.ambitiousai.co.jp/)

## 謝辞

このプロジェクトは以下の素晴らしい技術とコミュニティに支えられています：

- 🤖 **Claude AI** by [Anthropic](https://www.anthropic.com/) - AIペアプログラミング
- 📚 **組織マネジメント理論** - 階層的Agent設計の理論的基盤
- 💚 **オープンソース** - 全ての依存パッケージとコントリビューター

## バージョン情報

### v0.8.0 (2025-10-09)

最新の変更点:

- ✅ ライセンスをApache 2.0に変更（商標・特許保護強化）
- ✅ NOTICEファイル追加（帰属表示・商標保護）
- ✅ README英語版セクション追加
- ✅ GitHubトークンセキュリティ強化（gh CLI優先）
- ✅ Termux環境完全対応ガイド
- ✅ Discord MCP Server統合（コミュニティ運営）

---

**Miyabi** - *Beauty in Autonomous Development*

🤖 Powered by Claude AI • 🔒 Apache 2.0 License • 💖 Made with Love
