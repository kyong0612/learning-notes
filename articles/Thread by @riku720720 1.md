---
title: "Thread by @riku720720"
source: "https://x.com/riku720720/status/2038976598914019546?s=12"
author:
  - "[[@riku720720]]"
published: 2026-03-31
created: 2026-04-02
description: "npm axiosパッケージのメンテナーアカウント乗っ取りによるサプライチェーン攻撃（2026年3月31日発生）の原理・影響範囲・対策をまとめたスレッド。Flatt Security社の詳細分析記事への参照を含む。"
tags:
  - "clippings"
  - "npm"
  - "supply-chain-attack"
  - "axios"
  - "security"
  - "malware"
---

## 概要

2026年3月31日、HTTPクライアントライブラリ **axios** のnpmパッケージが侵害された。攻撃者はメンテナー `jasonsaayman` のnpmアカウントを乗っ取り、マルウェアを含む `axios@1.14.1` および `axios@0.30.4` を公開。axiosは週間約1〜3億ダウンロードを誇る超人気パッケージであり、影響範囲は極めて広い。npmは約3時間で悪性バージョンを削除済み。

> 元スレッド: [@riku720720 (2026-03-31)](https://x.com/riku720720/status/2038976598914019546)
> 参照記事: [axios ソフトウェアサプライチェーン攻撃の概要と対応指針 - GMO Flatt Security Blog](https://blog.flatt.tech/entry/axios_compromise)

---

## タイムライン

| 日時 (JST) | イベント |
|---|---|
| 3月31日 08:59 | 悪性パッケージ `plain-crypto-js@4.2.1` がnpmに公開 |
| 3月31日 09:21 | 悪性バージョン `axios@1.14.1` がnpmに公開（`latest`タグ） |
| 3月31日 10:00 | 悪性バージョン `axios@0.30.4` がnpmに公開（`legacy`タグ） |
| 3月31日 ~12:15 | npmが悪性axiosバージョンを削除 |

悪性 `axios@1.14.1` の露出時間は約2時間53分、`axios@0.30.4` は約2時間15分。

---

## 攻撃の流れ

### 1. メンテナーアカウントの乗っ取り

- axiosの主要メンテナー `jasonsaayman` のnpmアカウントが侵害された
- 攻撃者はアカウントの登録メールアドレスを `ifstap@proton.me`（Proton Mail）に変更
- npm publish権限を完全に掌握（GitHubの2FAやCI/CDはバイパス）
- アカウントまたは `NPM_TOKEN` がどのように侵害されたか（トークン窃取の経路）は現時点で不明

### 2. 悪意あるバージョンの公開

攻撃者は以下の2バージョンを短時間で公開：

- `axios@1.14.1`（1.xブランチ）
- `axios@0.30.4`（0.xブランチ、legacy版）

**axios本体に悪意あるコードは一切含まれていない**のが特徴。変更点は `package.json` のみで、偽の依存関係として `plain-crypto-js@^4.2.1`（本物の `crypto-js` を装ったパッケージ）を追加。

正規版（v1.14.0）と悪性版（v1.14.1）のnpm registryマニフェスト比較：

| フィールド | v1.14.0（正規） | v1.14.1（悪性） |
|---|---|---|
| `_npmUser.name` | `GitHub Actions` | `jasonsaayman` |
| `_npmUser.email` | `npm-oidc-no-reply@github.com` | `ifstap@proton.me` |
| `trustedPublisher` | あり（OIDC） | なし |
| `gitHead` | `46bee3dea75e...` | なし |
| `dependencies` | 3個 | 4個（`plain-crypto-js`追加） |

### 3. 悪意ある依存パッケージの仕組み

別アカウント（`nrwise`）で `plain-crypto-js@4.2.1` を公開。このパッケージの **postinstallスクリプト**（`setup.js`）がインストール時に自動実行される。

1. 難読化されたJavaScriptが実行
2. C2サーバー（`sfrclak[.]com:8000`）に接続
3. プラットフォーム別のRAT（Remote Access Trojan）ペイロードをダウンロード・実行
4. 実行後、自身（`setup.js`）を削除し、`package.json`をクリーンな `package.md` で差し替えて痕跡を隠蔽

C2通信時にPOSTボディとして `packages.npm.org/product0`（macOS）、`product1`（Windows）、`product2`（Linux）を送信。これはnpmの正規ドメインに見せかける偽装文字列。

### 4. プラットフォーム別の動作

| プラットフォーム | 動作内容 |
|---|---|
| **macOS** | AppleScript経由でRATバイナリを `/Library/Caches/com.apple.act.mond` にダウンロード・バックグラウンド実行 |
| **Windows** | PowerShellを `%PROGRAMDATA%\wt.exe` にコピーし、VBScript経由でRATをバックグラウンド実行 |
| **Linux** | `curl`でPython RATを `/tmp/ld.py` にダウンロード、`nohup`でバックグラウンド実行 |

### 5. 感染の広がり

- `npm install axios` や `npm update` で `^1.14.0` や `^0.30.0` を指定しているプロジェクトが自動的に悪意あるバージョンを引き込む
- 間接依存（transitive dependency）経由でも感染する可能性あり

---

## なぜ検知されにくかったか

- axios本体のソースコードは完全にクリーン（コード変更なし）
- 悪意は **隠し依存 + postinstallフック** に隠されている
- `plain-crypto-js` はインストール後に自身の痕跡を消去するため、事後の `node_modules` 検査では検知困難
- 攻撃者は先に偽パッケージを準備し、タイミングを合わせてaxiosを更新
- GitHubのリリースタグやCI/CD証明書をバイパスしてnpmに直接publish
- 依存追加だけで攻撃が成立する手口（event-stream侵害でも使用された既知の手法）

---

## 対応指針

### 1. 影響有無の確認

> **疑わしきは罰する**方向で調査・クレデンシャルローテーション等の対応を推奨。間接依存も含めaxiosはいたるところで利用があり、EDRやプロキシの入っていないCI/CD環境も対象にすること。

**バックドアファイルの確認：**

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

**端末内の全プロジェクトを走査：**

```bash
# plain-crypto-jsディレクトリの存在自体が痕跡
find / -type d -name "plain-crypto-js" -path "*/node_modules/*" 2>/dev/null
```

**lockfileの走査：**

```bash
find / -name "package-lock.json" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
find / -name "yarn.lock" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
find / -name "pnpm-lock.yaml" -exec grep -l "plain-crypto-js" {} \; 2>/dev/null
```

**ネットワークログの確認：**
- C2ドメイン `sfrclak[.]com` / IP `142[.]11[.]206[.]73` へのアウトバウンド通信（ポート `8000`）
- 露出期間（3月31日 09:21〜12:15 JST）に `npm install` が実行された形跡

### 2. バックドアの除去とプロセスの停止

```bash
# macOS
rm -f /Library/Caches/com.apple.act.mond
ps aux | grep com.apple.act.mond

# Windows
del "%PROGRAMDATA%\wt.exe"
tasklist | findstr wt.exe

# Linux
rm -f /tmp/ld.py
ps aux | grep ld.py
```

### 3. 悪性パッケージの除去とダウングレード

```bash
rm -rf node_modules/plain-crypto-js
npm install axios@1.14.0 --ignore-scripts  # レガシー利用は axios@0.30.3
```

`package.json` でバージョンをピン留めし、`overrides`/`resolutions`での固定も推奨：

```json
{
  "dependencies": { "axios": "1.14.0" },
  "overrides": { "axios": "1.14.0" }
}
```

### 4. クレデンシャルのローテーション（優先順位高）

- npmトークン
- AWS / GCP / Azure等のクラウドクレデンシャル
- SSH秘密鍵
- CI/CDシークレット
- `.env`ファイル内の値

### 5. CI/CD環境の確認

CI/CDパイプラインで悪性バージョンの `npm install` が実行された場合、パイプラインに注入されたシークレットも漏洩している可能性がある。

---

## 推奨：自衛手段の整備

### npm `min-release-age`（npm v11以降）

`.npmrc` に設定することで、公開から一定期間が経過していないバージョンのインストールを抑止：

```
# .npmrc
min-release-age=7
```

### pnpm `trustPolicy: no-downgrade`

パッケージの信頼度が下がるような更新（OIDC → 手動パブリッシュへの切り替え等）をブロック。今回のaxiosの2バージョンはこの設定で防げた。

### Takumi Guard（GMO Flatt Security）

npmレジストリとの間に位置するセキュリティプロキシ。全ての新規パッケージを検査し、悪意あるパッケージをブロックする。**無料で利用可能**。

```bash
npm config set registry https://npm.flatt.tech/
```

### その他の対策

- npmアカウントに **2FA（できればハードウェアキー）** を必須化
- 依存バージョンを厳密に固定（`^` や `~` を避ける）
- `npm audit` や Snyk/StepSecurity などのツールで定期チェック
- Trusted Publisher（GitHub OIDC）で直接npm publishを制限

---

## IoCs（Indicators of Compromise）

### ネットワーク

| 種別 | 値 | 備考 |
|---|---|---|
| ドメイン | `sfrclak[.]com` | C2ドメイン |
| IP | `142[.]11[.]206[.]73` | C2 IPアドレス |
| URL | `http://sfrclak[.]com:8000/6202033` | C2エンドポイント |

### パッケージ

| 種別 | 値 |
|---|---|
| 侵害バージョン | `axios@1.14.1`, `axios@0.30.4` |
| 悪性依存パッケージ | `plain-crypto-js@4.2.1` |

### 攻撃者アカウント

| アカウント | メールアドレス | 備考 |
|---|---|---|
| `jasonsaayman`（npm/GitHub） | `ifstap@proton.me`（変更後） | 侵害されたメンテナアカウント |
| `nrwise`（npm） | `nrwise@proton.me` | `plain-crypto-js`公開用の使い捨てアカウント |

### 永続化ファイル

| プラットフォーム | パス | 備考 |
|---|---|---|
| macOS | `/Library/Caches/com.apple.act.mond` | Appleデーモンを偽装したRATバイナリ |
| Windows | `%PROGRAMDATA%\wt.exe` | Windows Terminalに偽装したPowerShellコピー |
| Windows | `%TEMP%\6202033.vbs` | VBScriptローダー（自己削除） |
| Windows | `%TEMP%\6202033.ps1` | PowerShell RATスクリプト（自己削除） |
| Linux | `/tmp/ld.py` | Python RATスクリプト |

---

## 重要な結論

1. **典型的なnpmサプライチェーン攻撃パターン**：「アカウント乗っ取り → 最小変更で悪意注入 → postinstallでペイロード配信」
2. **axios本体は無変更**：依存パッケージの追加のみで攻撃が成立しており、コードレビューでは発見困難
3. **痕跡隠蔽が巧妙**：postinstallスクリプトとペイロードは自己削除、`package.json`もクリーンなものに差し替え
4. **影響範囲が極めて広い**：直接・間接依存を含め、多くのプロジェクトが影響を受ける可能性
5. **npmは悪性バージョンを削除済み**だが、キャッシュや古いlockfileを使っている環境はまだ危険
6. **2026年3月はサプライチェーン攻撃が多発**：Trivy、LiteLLM、Telnyx、axiosと続いており、自衛手段の整備が急務

---

## 原文

<details>
<summary>元スレッド全文（クリックで展開）</summary>

**Rikuo** @riku720720 [2026-03-31](https://x.com/riku720720/status/2038976598914019546/history)

全員全部のプロジェクトでClaudeCodeに下記コピペして。

\*\*npm axiosの乗っ取り（2026年3月31日発生）の原理\*\*は、\*\*npm maintainerアカウントの乗っ取りによるサプライチェーン攻撃\*\*です。

\### 攻撃の流れ（ステップバイステップ）

1\. \*\*メンテナーアカウントの乗っ取り\*\*

Axiosの主要メンテナー「jasonsaayman」の\*\*npmアカウント\*\*が侵害されました。

\- 攻撃者はアカウントの登録メールアドレスを自分のProton Mail（ifstap@proton.me）に変更。

\- これにより、npm publish権限を完全に掌握（GitHubの2FAやCI/CDはバイパスされる）。

2\. \*\*悪意あるバージョンの公開\*\*

攻撃者は以下の2バージョンを短時間で公開：

\- \`axios@1.14.1\`（1.xブランチ）

\- \`axios@0.30.4\`（0.xブランチ、legacy版）

これらは\*\*axios本体に悪意あるコードを一切入れていない\*\*のが特徴です。

変更点は\*\*package.jsonだけ\*\*：偽の依存関係として \`plain-crypto-js@^4.2.1\` を追加（本物の \`crypto-js\` を装ったパッケージ）。

3\. \*\*悪意ある依存パッケージの準備\*\*

別アカウント（nrwise）で \`plain-crypto-js@4.2.1\` を公開。

このパッケージの\*\*postinstallスクリプト\*\*（インストール時に自動実行される）が本体です。

\- 難読化されたJavaScript（setup.js）が実行される。

\- C&Cサーバー（例: http://sfrclak.com:8000）に連絡。

\- プラットフォーム別（Windows/macOS/Linux）の\*\*RAT（Remote Access Trojan）ペイロード\*\*をダウンロード・実行。

\- 実行後、自分自身を削除し、package.jsonをクリーンなものに置き換えて痕跡を隠蔽。

4\. \*\*感染の広がり\*\*

\- \`npm install axios\` や \`npm update\` で最新版（^1.14.0 や ^0.30.0）を指定しているプロジェクトが自動的に悪意あるバージョンを引き込む。

\- 依存関係経由（間接依存）でも感染する可能性あり。

\- Axiosは週に1億〜3億ダウンロードを超える超人気パッケージなので、影響範囲が非常に広い。

\### なぜ検知されにくかったか？

\- axios本体は完全にクリーンに見える（コード変更なし）。

\- 悪意は\*\*隠し依存 + postinstall\*\*に隠れている。

\- 攻撃者は先に偽パッケージを準備し、タイミングを合わせてaxiosを更新（検知ツールがスキャンしにくい）。

\- GitHubのリリースタグやCI/CD証明書をバイパスしてnpmに直接publish。

\### 実際の対策（今すぐやるべきこと）

\- \*\*影響バージョンを確認・削除\*\*：

\`\`\`bash

npm ls axios

\`\`\`

1.14.1 または 0.30.4 が入っていたら即時対応。

\- \*\*安全なバージョンに固定\*\*：

\`\`\`bash

npm install axios@1.14.0 # または axios@0.30.3

\`\`\`

package.jsonで \` "axios": "1.14.0" \` のようにピン留め推奨。

\- npmのキャッシュやnode\_modules、package-lock.jsonをクリア。

\- 感染の可能性があるマシンでは、\*\*秘密鍵・トークン・ウォレットなどのローテーション\*\*を強く推奨（RATなので情報窃取のリスク）。

\- 将来的には：

\- npmアカウントに\*\*2FA（できればハードウェアキー）\*\*を必須化。

\- 依存バージョンを厳密に固定（^ や ~ を避ける）。

\- \`npm audit\` や Snyk/StepSecurity などのツールで定期チェック。

\- Trusted Publisher（GitHub OIDC）など、直接npm publishを制限する仕組みを活用。

この攻撃は「アカウント乗っ取り → 最小変更で悪意注入 → postinstallでペイロード配信」という典型的な\*\*npmサプライチェーン攻撃\*\*のパターンです。過去にも似た事例（isパッケージなど）がありましたが、Axiosの人気度から特に影響が大きい事件になりました。

npm側はすでに該当バージョンを削除済みですが、キャッシュや古いlockfileを使っている環境はまだ危険です。早めに確認してください。

---

**Rikuo** @riku720720 [2026-03-31](https://x.com/riku720720/status/2038976956918812694)

この記事貼り付けるでも良さそう

> 2026-03-31
> 
> 本日発生したaxiosのnpmパッケージに対するマルウェア混入（ソフトウェアサプライチェーン攻撃）に関して、その概要と対応指針を整理しました。
> 
> 間接的な依存も多く、広い範囲に影響が出ています。確認の上、皆様の対応にお役立てください。
> 
> https://blog.flatt.tech/entry/axios\_compromise

</details>