---
title: "Hardening GitHub Actions: Lessons from Recent Attacks"
source: "https://www.wiz.io/blog/github-actions-security-guide"
author:
  - "[[Rami McCarthy]]"
  - "[[Shay Berkovich]]"
published: 2026-04-15
created: 2026-04-18
description: "tj-actions・trivy-action・Axiosといった近年のGitHub Actionsサプライチェーン攻撃から得られた教訓と、組織・ワークフロー・ランナーの各レイヤーで実施すべき実践的なハードニング手法をまとめた包括的ガイド。"
tags:
  - "clippings"
  - "GitHub Actions"
  - "Security"
  - "CI/CD"
  - "Supply Chain Attack"
  - "DevSecOps"
  - "Secrets Management"
---

## 概要

Wiz社のRami McCarthyとShay Berkovichによる、GitHub Actionsのセキュリティハードニングに関する実践ガイド（2025年5月初版、2026年4月更新版）。過去4年にわたりGitHub Actionsのリスクは研究者によって警告されてきたが、2025年3月の **tj-actions事件** で現実のものとなり、さらに2026年3月には **trivy-action（TeamPCP）** と **Axios** への攻撃が発生。本ガイドは、こうしたインシデントを踏まえてGitHubの公式ドキュメントでは十分にカバーされていない領域も含めた実践的なチートシートとして機能する。

**共通パターン**: 資格情報（credential）の窃取によって横展開（lateral movement）が可能となり、侵害の検知までの時間は数日ではなく **数時間** 単位。

## 近年の主要インシデント（2026年3月）

### TeamPCP / Trivy-action

- 攻撃者が **trivy-actionの76個中75個のバージョンタグ** をforce-pushで侵害
- Trivyスキャンを実行するあらゆるパイプラインからシークレットを窃取
- 窃取された資格情報はPyPIの侵害（**LiteLLM** 等）に連鎖

### Axios

- 悪意あるバージョン `1.14.1` と `0.30.4` が **約3時間** 公開
- 依存を実行時解決するパイプラインに影響
- ペイロードはAxios本体ではなく挿入された依存 `plain-crypto-js` に隠蔽

## GitHub Actions基本用語

| 用語 | 定義 |
|------|------|
| **GitHub Actions** | SDLC内のタスクを自動化するGitHubの自動化スイート |
| **Workflow** | YAMLで定義された自動化タスクの集合。イベントに応答して実行 |
| **Action** | Workflow内で参照・実行される再利用可能な自動化ユニット（プログラミングの関数に相当） |
| **Event** | Workflowを起動するトリガー（push、PR、スケジュール、手動など） |
| **Job** | Workflow内の作業単位。ランナー上で実行される最小スケジュール単位 |

## 1. 組織レベルでのGitHub設定

### 1.1 デフォルトWorkflow権限をRead-Onlyに

2023年2月以前はデフォルトが **read-write** だった。書き込み権限はWorkflowがリポジトリとデータを意図せず／悪意的に変更する余地を与えるため、最小権限の原則から **read-only** に設定することが必須。

### 1.2 Actionsを検証済みとAllowlistに制限

- **GitHub製Actions**（`actions/`, `github/`）
- **Marketplace Verified Creators** のAction
- 追加で信頼できるActionのallowlistを定義

**2025年8月以降の新機能**:
- **SHA pinning enforcement**: pinされていないActionを使うWorkflowを警告ではなく失敗にできる
- **`!` prefix によるAction blocking**（例: `!compromised-org/action`）: インシデント時の迅速なブロックが可能

### 1.3 Workflow採用とランナーの範囲制限

- リポジトリallowlistでWorkflow採用範囲を制御
- 自ホストランナーを特定リポジトリに限定

### 1.4 "Allow GitHub Actions to Create and Approve Pull Requests" を無効化

この設定を有効にすると、Workflowがマニュアルチェックなしに PR の作成・承認を行える。必ず無効化する。

## 2. ブランチ保護

ブランチ保護（Branch Protection）とrulesetsはmainやreleaseブランチへのマージ前に規則を強制するが、以下の制限がある:

| 攻撃 | 説明 | 対策設定 |
|------|------|----------|
| **Malicious commits post-approval** | PR承認後、マージ前に悪意あるコミットを追加 | "Dismiss stale PR approvals when new commits are pushed" |
| **Pull request hijacking** | 他人のPRに悪意ある変更を追加し自身で承認 | "Require approval from someone other than the last person to push" |

アジャイル環境では厳格な運用が難しいため、 **commit signing** と **out-of-band detection**（例: Figma方式）を併用する。

**Action公開者向け**: [Immutable Releases](https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/) を有効化することで、trivy-action型のタグ書き換え攻撃から下流ユーザを守れる。

## 3. Secrets管理

GitHubのシークレットには3種類:

| 種類 | 用途 |
|------|------|
| **Repository** | 単一リポジトリ用（デフォルト推奨） |
| **Organization** | 複数リポジトリで共有（共通CIインフラ用） |
| **Environment** | 承認必須の本番環境など細粒度制御 |

**重要な注意点**:
- Forkから起動されたWorkflowには（`GITHUB_TOKEN`を除き）シークレットは渡されない
- **リポジトリへの書き込み権限を持つユーザは、すべてのシークレットを読める**
- 静的シークレットよりも **短命な資格情報（OIDC）** を優先

## 4. 安全なWorkflowの書き方

### 4.1 権限の明示

Workflowレベルで `permissions: {}` を指定することで、Jobレベルでの明示的な権限宣言を強制し、`GITHUB_TOKEN`の露出を最小化できる。

### 4.2 サードパーティActionの使用

- **Hash pinning（コミットSHAでのピン留め）** のみが同一コードの実行を保証（タグベースは不十分）
- **推移的リスク**: 自分がhash pinしていても、依存先のActionが弱いpinningだと依然として脆弱
- 選定基準:
  - コントリビュータ数（多い＝攻撃面拡大）
  - コード複雑性（複雑すぎる＝監査困難）
  - 人気度（多くの目によるチェック）
  - ベストプラクティス遵守状況

### 4.3 Cooldown（冷却期間）の採用

hash pinningであっても、リリース直後の侵害には脆弱。 **7〜14日の更新遅延** でサプライチェーン攻撃の **80〜90%** を捕捉できる（検知ウィンドウが1週間未満のため）。

- [pinact](https://github.com/suzuki-shunsuke/pinact) (`--min-age 7`)
- Renovate (`minimumReleaseAge`)

### 4.4 Workflowのlint

[zizmor](https://github.com/woodruffw/zizmor) 等で未pin Action、テンプレートインジェクション、危険なトリガーをCI導入前に検出する。

### 4.5 Secretsの扱い

**アンチパターン（絶対に避ける）**:

```yaml
# Bad, do not use this
env:
  SECRETS: ${{ toJson(secrets) }}
```

- シークレットは **Step単位の `env`** で必要な場所のみ個別名で参照
- 再利用可能Workflowでの `secrets: inherit` を避け、必要なシークレットのみ明示的に渡す

## 5. 主要なWorkflow脆弱性（PPE: Poisoned Pipeline Execution）

### 5.1 Pwn Request

`pull_request_target` や `workflow_run` は **ベースリポジトリのコンテキスト** で実行されるためシークレットにアクセスできる。forkのブランチを `actions/checkout` してその内容を実行すると、攻撃者が特権付きで任意コード実行可能。

**2025年12月の部分的緩和**: `pull_request_target` は常にデフォルトブランチのWorkflow定義を使うようになった。ただしforkのPRコードをcheckout＋実行する構造では依然危険。Astralは「これらのトリガーはほぼ安全に使うことが不可能」と言及。

### 5.2 Living Off The Pipeline

linter、テストランナー、ビルドシステム、セキュリティスキャナなど、リポジトリ内のファイルを処理するCI/CDツールの中には、設定や初期化時にコード実行機能を持つものがあり、これを悪用される。参考: [LOTP](https://boostsecurityio.github.io/lotp/)

### 5.3 GITHUB_ENV と GITHUB_PATH

これらのファイルは後続ステップに影響:

- `GITHUB_ENV`: 環境変数を設定
- `GITHUB_PATH`: システムパスを変更

攻撃者は悪意ある実行バイナリの差し込みや `LD_PRELOAD` の挿入に利用可能。攻撃者制御コンテンツが存在しうるステップでは書き込みを避ける。

### 5.4 コマンドインジェクション

```yaml
# 危険な例
run: some-command ${{ github.event.issue.title }}
```

イシュータイトル、ブランチ名、ファイル内容、ラベル等のユーザ制御値をシェルスクリプトに直接補間すると、コマンドインジェクションにつながる。**補間を避け、再利用可能Workflowの明示的なinputsとして渡す** のが安全。

### 5.5 Artifactと資格情報の扱い

`actions/checkout` はデフォルトで `.git/config` に資格情報を保持する。後続ステップが `actions/upload-artifact` で誤って公開した事例あり。不要な場合は `persist-credentials: false` を設定。

## 6. 安全なWorkflow実行（ランナー）

### 6.1 GitHub-hosted vs Self-hosted

- **GitHub-hosted**: デフォルトでephemeralかつサンドボックス化。大半のユースケースで推奨
- **Self-hosted**: デフォルトで **非ephemeral**（環境が永続化） → 侵害されると永続マルウェアやバックドアのリスク

### 6.2 Self-hostedのベストプラクティス

- **信頼レベルでランナーを隔離**（runner groups使用、public/privateを共有しない）
- **public repoでは絶対に使わない**（forkやPRからの信頼できないコード実行に晒される）
- プロダクション機密インフラとして計装: プロセス監視、活動ログ、挙動検査
- 可能な限りephemeralインフラ（Job毎にteardown）

### 6.3 Egress制御

- Self-hosted: デフォルトdeny-allのアウトバウンドポリシー、artifact repo/パッケージレジストリ/必要API のみallowlist
- GitHub-hosted: 予期しないアウトバウンド接続の検知・ブロック

### 6.4 資格情報の隔離

高価値操作（リリース、デプロイ）では **GitHub Apps** に資格情報を移すのが望ましい。Workflowはコードとシークレットが同一攻撃面に混在するが、GitHub Appsは分離された信頼境界を提供する。

### 6.5 OIDC

ダウンストリームシステム接続時は、静的シークレットではなく **OpenID Connect (OIDC)** による短命・ID束縛トークンを利用。

## 7. 今後のGitHub機能（2026ロードマップ）

| 機能 | 概要 |
|------|------|
| **`dependencies:` セクション** | Workflow lockfile。全direct/transitive依存をコミットSHAでpin（go.sumのWorkflow版） |
| **Workflow Execution Protections** | 中央集約的なruleset。actor rulesとevent rulesでトリガー制御 |
| **Evaluate Mode** | 新ポリシーを強制せずテスト可能 |

## 8. 主要な結論（Takeaways）

3つのコア対策に集中すべき:

1. **サードパーティ攻撃面の最小化**: Actionを制限、hash pinning、cooldown採用
2. **権限とシークレットの最小化**: 可能な限りOIDCを採用
3. **PPE（Poisoned Pipeline Execution）の回避**: 高特権トリガーと攻撃者制御要素の監査

### 推奨オープンソースツール

- **[zizmor](https://github.com/woodruffw/zizmor)**: GitHub Actionsの静的解析（一般的な設定ミス検出）
- **[trajan](https://github.com/praetorian-inc/trajan) / [Gato-X](https://github.com/AdnaneKhan/Gato-X)**: 列挙・攻撃ツール（自組織のテスト用）
- **[allstar](https://github.com/ossf/allstar)**: OpenSSF製、組織／リポジトリへのセキュリティポリシー強制GitHub App
- **[pinact](https://github.com/suzuki-shunsuke/pinact)**: Action pinning とcooldown自動化

## 制限事項・注意点

- ブランチ保護の厳格な運用はアジャイル環境と相性が悪く、補助的な仕組み（commit signing、out-of-band detection）が必要
- Hash pinningをしても **推移的依存** のリスクは残る
- `pull_request_target` は2025年12月の緩和後も fork PRコード実行パターンでは依然危険
- Self-hostedランナーはデフォルトでephemeralではないため、明示的な設計が必要
- シークレットはリポジトリ書き込み権限を持つ全ユーザに事実上読み取り可能

---

*Source: [Hardening GitHub Actions: Lessons from Recent Attacks](https://www.wiz.io/blog/github-actions-security-guide)*
