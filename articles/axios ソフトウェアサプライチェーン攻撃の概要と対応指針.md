---
title: "axios ソフトウェアサプライチェーン攻撃の概要と対応指針"
source: "https://blog.flatt.tech/entry/axios_compromise"
author:
  - "[[flattsecurity]]"
published: 2026-03-31
created: 2026-04-01
description: "2026年3月31日、週間約1億DLを誇るHTTPクライアントライブラリ axios の npm パッケージが侵害された。攻撃者はメンテナのnpmアカウントを乗っ取り、悪性バージョン1.14.1/0.30.4を公開。悪性依存パッケージ plain-crypto-js の postinstall フックにより、npm install 時にRAT（Remote Access Trojan）がドロップされる。本記事は事象の概要、侵害の仕組み、環境別の対応手順、IoCs、および npm min-release-age 等の自衛策を包括的に解説する。"
tags:
  - "clippings"
  - "security"
  - "supply-chain-attack"
  - "npm"
  - "axios"
  - "malware"
  - "rat"
  - "nodejs"
---

## 概要

2026年3月31日、HTTPクライアントライブラリ [axios](https://github.com/axios/axios) の npm パッケージが侵害された。攻撃者はメンテナ `jasonsaayman` の npm アカウントを乗っ取り、マルウェアを含むバージョン **`1.14.1`**（latest タグ）および **`0.30.4`**（legacy タグ）を公開した。axios は npm エコシステムで **週間約1億ダウンロード**を誇る主要パッケージであり、影響範囲は極めて広い。

悪性バージョンは axios 自体のソースコードには手を加えず、`package.json` の `dependencies` に悪性パッケージ `plain-crypto-js` を追加する手法を採用。`npm install` 時に `postinstall` フックで **RAT（Remote Access Trojan）** をドロップする。痕跡の自己消去機能を備えており、事後検査では検知が困難。

## タイムライン

| 日時 (JST) | イベント |
|---|---|
| 3月31日 08:59 | 悪性パッケージ `plain-crypto-js@4.2.1` が npm に公開（悪性 postinstall フック付き） |
| 3月31日 09:21 | 悪性バージョン `axios@1.14.1` が npm に公開（`latest` タグ） |
| 3月31日 10:00 | 悪性バージョン `axios@0.30.4` が npm に公開（`legacy` タグ） |
| 3月31日 ~12:15 | npm が悪性 axios バージョンを削除 |

悪性 `axios@1.14.1` の露出時間は**約2時間53分**、`axios@0.30.4` は**約2時間15分**。

## 侵害の仕組み

### 侵害の起点

悪性バージョンには GitHub 上に対応するタグやコミットが存在せず、メンテナアカウント経由で npm へ直接 CLI アップロードされた。npm registry manifest を比較すると以下の差異がある:

| フィールド | v1.14.0（正規） | v1.14.1（悪性） |
|---|---|---|
| `_npmUser.name` | `GitHub Actions` | `jasonsaayman` |
| `_npmUser.email` | `npm-oidc-no-reply@github.com` | `ifstap@proton.me` |
| `_npmUser.trustedPublisher` | あり（OIDC） | なし |
| `gitHead` | `46bee3dea75e...` | なし |
| `dependencies` | 3個 | 4個（`plain-crypto-js` 追加） |
| `maintainers[jasonsaayman].email` | `jasonsaayman@gmail.com` | `ifstap@proton.me` |

正規リリースは GitHub Actions OIDC（`trustedPublisher` 付き）で行われていたため、`trustedPublisher` なし・`gitHead` なしの手動 CLI パブリッシュは**明確な異常シグナル**。ただし v1.x の [publish workflow](https://github.com/axios/axios/blob/v1.x/.github/workflows/publish.yml) は `NODE_AUTH_TOKEN` 環境変数も併用しており、npm はトークンと OIDC が両方存在する場合トークンを優先する。この構成が侵害の一因となった可能性がある。

### 発火経路

axios 自体のソースコードには悪性コードが注入されていない。`package.json` の `dependencies` に `plain-crypto-js` を追加し、その `postinstall` フック（`setup.js`）が攻撃の起点となる。

- **発火条件**: `npm install` 時（`--ignore-scripts` を付けていない限り）
- **手口の特徴**: axios のソースコードから一切 import されておらず、依存追加だけで攻撃が成立。event-stream 侵害でも用いられた手法

### 環境別の動作

いずれも C2 サーバ `sfrclak[.]com:8000` から Stage 2 ペイロードをダウンロードして実行。C2 への通信時に `packages.npm.org/product{0,1,2}` という偽装文字列を送信（npm 正規ドメインへの偽装）。

| プラットフォーム | 動作内容 |
|---|---|
| **macOS** | AppleScript 経由で RAT バイナリを `/Library/Caches/com.apple.act.mond` にダウンロード・バックグラウンド実行。スクリプトは削除 |
| **Windows** | PowerShell を `%PROGRAMDATA%\wt.exe` にコピーし、VBScript 経由で RAT をバックグラウンド実行。スクリプトは削除 |
| **Linux** | `curl` で Python RAT を `/tmp/ld.py` にダウンロード、`nohup` でバックグラウンド実行。スクリプトは削除 |

**痕跡消去**: `setup.js` は実行後に自身を削除し、`postinstall` フックを含む `package.json` をクリーンな `package.md` で差し替え。感染後に `node_modules/plain-crypto-js/` を検査しても完全にクリーンに見える（ディレクトリ自体の存在が唯一の痕跡）。

## 対応指針

### 1. 影響有無の確認

**「疑わしきは罰する」方針を推奨**。間接依存も含め axios は広範に利用されており、直接依存していない環境でも影響が及びうる。EDR やプロキシの入っていない CI/CD 環境（GitHub Actions 等）も対象にすべき。

#### バックドアファイルの確認

```bash
# macOS
ls -la /Library/Caches/com.apple.act.mond

# Windows
dir "%PROGRAMDATA%\wt.exe"
dir "%TEMP%\6202033.vbs"
dir "%TEMP%\6202033.ps1"

# Linux
ls -la /tmp/ld.py
```

#### 端末内の全プロジェクトを走査

```bash
# plain-crypto-js ディレクトリの存在自体が痕跡
find / -type d -name "plain-crypto-js" -path "*/node_modules/*" 2>/dev/null
```

#### lockfile の走査

```bash
find / -name "package-lock.json" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
find / -name "yarn.lock" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
find / -name "pnpm-lock.yaml" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
```

#### ネットワークログの確認

C2 ドメイン `sfrclak[.]com` および IP `142[.]11[.]206[.]73` へのアウトバウンド通信（ポート `8000`）の有無を確認。悪性バージョンの露出期間（3月31日 09:21〜12:15 JST）に `npm install` が実行された形跡も照合。

### 2. バックドアの除去とプロセスの停止

```bash
# macOS
rm -f /Library/Caches/com.apple.act.mond
ps aux | grep com.apple.act.mond

# Windows
del "%PROGRAMDATA%\wt.exe"
del "%TEMP%\6202033.vbs"
del "%TEMP%\6202033.ps1"
tasklist | findstr wt.exe

# Linux
rm -f /tmp/ld.py
ps aux | grep ld.py
```

### 3. 悪性パッケージの除去とダウングレード

```bash
rm -rf node_modules/plain-crypto-js
npm install axios@1.14.0 --ignore-scripts  # レガシー: axios@0.30.3
```

`overrides`/`resolutions` でのバージョン固定も推奨:

```json
{
  "dependencies": { "axios": "1.14.0" },
  "overrides": { "axios": "1.14.0" }
}
```

### 4. クレデンシャルのローテーション

感染が確認された、または否定しきれない端末では以下を優先的にローテーション:

- npm トークン
- AWS / GCP / Azure 等のクラウドクレデンシャル
- SSH 秘密鍵
- CI/CD シークレット
- `.env` ファイル内の値

### 5. CI/CD 環境の確認

パイプラインで悪性バージョンの `npm install` が実行された場合、注入されたシークレットも漏洩している可能性がある。実行ログを確認し、シークレットをローテーション。

## 自衛手段の整備

3月中のサプライチェーン攻撃は **Trivy、LiteLLM、Telnyx、axios** と連続しており、次の標的は予測不能。

### npm の min-release-age

npm v11 以降、`.npmrc` に `min-release-age` を設定することで、公開から一定期間が経過していないバージョンのインストールを抑止可能。**7日間を推奨**（最低でも3日間）。

```
# .npmrc
min-release-age=7
```

大規模パッケージの侵害は数時間でテイクダウンされるが、小規模パッケージや依存の深い階層での侵害は数日間残存しうる。検疫期間はそのようなケースに効果的。

### pnpm の trustPolicy: no-downgrade

パッケージの信頼度が下がる更新（OIDC → 手動パブリッシュ等）をブロックする。今回の axios の悪性2バージョンはこの設定でブロック可能だった。

### Takumi Guard（GMO Flatt Security）

npm レジストリとの間に位置するセキュリティプロキシ。全新規パッケージを検査し、悪意あるパッケージをブロックする。**無料**で利用可能。

```bash
# 導入（registry URL の変更のみ）
npm config set registry https://npm.flatt.tech/
# yarn v1
yarn config set registry https://npm.flatt.tech
# yarn v2+
yarn config set npmRegistryServer https://npm.flatt.tech
# pnpm
pnpm config set registry https://npm.flatt.tech/
```

後日の通知機能も無料で提供（メールアドレス登録が必要）。

## IoCs（Indicators of Compromise）

### ネットワーク

| 種別 | 値 | 備考 |
|---|---|---|
| ドメイン | `sfrclak[.]com` | C2 ドメイン |
| IP | `142[.]11[.]206[.]73` | C2 IP アドレス |
| URL | `http://sfrclak[.]com:8000/6202033` | C2 エンドポイント |

### パッケージ

| 種別 | 値 |
|---|---|
| 侵害バージョン | `axios@1.14.1`, `axios@0.30.4` |
| 悪性依存パッケージ | `plain-crypto-js@4.2.1` |

### 攻撃者アカウント

| アカウント | メールアドレス | 備考 |
|---|---|---|
| `jasonsaayman`（npm/GitHub） | `ifstap@proton.me`（変更後） | 侵害されたメンテナアカウント |
| `nrwise`（npm） | `nrwise@proton.me` | `plain-crypto-js` 公開用の使い捨てアカウント |

### 永続化ファイル

| プラットフォーム | パス | 備考 |
|---|---|---|
| macOS | `/Library/Caches/com.apple.act.mond` | Apple デーモンを偽装した RAT バイナリ |
| Windows | `%PROGRAMDATA%\wt.exe` | Windows Terminal に偽装した PowerShell コピー |
| Windows | `%TEMP%\6202033.vbs` | VBScript ローダー（自己削除） |
| Windows | `%TEMP%\6202033.ps1` | PowerShell RAT スクリプト（自己削除） |
| Linux | `/tmp/ld.py` | Python RAT スクリプト |

## 重要な教訓

1. **依存追加だけで攻撃が成立する**: axios のソースコードには一切の変更なし。`postinstall` フックが起点
2. **痕跡消去が巧妙**: `setup.js` の自己削除、`package.json` の差し替えにより事後検査では検知困難
3. **間接依存でも発火**: `postinstall` フックは直接依存・間接依存問わず実行される
4. **Trusted Publishing の併用構成に脆弱性**: OIDC と `NODE_AUTH_TOKEN` が併存する場合、npm はトークンを優先するため OIDC の保護が無効化される
5. **検疫期間（`min-release-age`）が有効**: 数時間でテイクダウンされる大規模侵害には特に効果的

## 参考リンク

- [StepSecurity 社による整理](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan)
- [Elastic 社のリサーチャーによる分析](https://gist.github.com/joe-desimone/36061dabd2bc2513705e0d083a9673e7)
- [Takumi Guard npm エンドポイント](https://shisho.dev/docs/ja/r/202603-takumi-guard)