---
title: "Post Mortem: axios npm supply chain compromise · Issue #10636 · axios/axios"
source: "https://github.com/axios/axios/issues/10636#issuecomment-4180237789"
author:
  - "[[jasonsaayman]]"
published: 2026-04-02
created: 2026-04-04
description: "2026年3月31日に発生したaxiosのnpmサプライチェーン攻撃のポストモーテム。攻撃者がリードメンテナーのPCにRATマルウェアを仕込み、npmアカウントを乗っ取って悪意あるバージョン（1.14.1、0.30.4）を公開。約3時間でリモートアクセス型トロイの木馬をインストールする依存パッケージが配布された。"
tags:
  - "clippings"
  - "supply-chain-attack"
  - "npm-security"
  - "open-source-security"
  - "social-engineering"
  - "axios"
---

## 概要

2026年3月31日、axiosのリードメンテナーJason Saaymanのアカウントが侵害され、悪意あるバージョン `axios@1.14.1` と `axios@0.30.4` がnpmレジストリに公開された。これらのバージョンは `plain-crypto-js@4.2.1` という依存パッケージを注入し、macOS・Windows・Linuxにリモートアクセス型トロイの木馬（RAT）をインストールするものだった。悪意あるバージョンは約3時間で削除された。

---

## 影響の確認方法

ロックファイルで以下のコマンドを実行：

```bash
grep -E "axios@(1\.14\.1|0\.30\.4)|plain-crypto-js" package-lock.json yarn.lock bun.lock pnpm-lock.yaml 2>/dev/null
```

**影響を受けた場合の対処：**

1. `axios@1.14.0`（0.x系は `0.30.3`）にダウングレード
2. `node_modules/plain-crypto-js/` を削除
3. そのマシン上のすべてのシークレット・トークン・認証情報をローテーション
4. `sfrclak[.]com` または `142.11.206.73:8000` への接続をネットワークログで確認
5. CIランナーで発生した場合、影響を受けたビルド中に注入されたシークレットをすべてローテーション

2026年3月31日 00:21〜03:15 UTC の間に新規インストールを実行していなければ影響なし。

---

## 攻撃タイムライン

| 時刻 (UTC) | 事象 |
|---|---|
| 約2週間前 | リードメンテナーへのソーシャルエンジニアリングキャンペーン開始 |
| 3月30日 05:57 | `plain-crypto-js@4.2.0` をnpmに公開 |
| 3月31日 00:21 | `axios@1.14.1` を `plain-crypto-js@4.2.1` 付きで公開 |
| 3月31日 ~01:00 | `axios@0.30.4` を同一ペイロードで公開 |
| 3月31日 ~01:00 | 外部による最初の検出。コミュニティが問題を報告するも攻撃者が侵害アカウントで削除 |
| 3月31日 01:38 | コラボレーターDigitalBrainJSがPR #10591で侵害バージョンの非推奨化、npmへ直接連絡 |
| 3月31日 03:15 | 悪意あるバージョンがnpmから削除 |
| 3月31日 03:29 | `plain-crypto-js` がnpmから削除 |

---

## 攻撃手法の詳細

### ソーシャルエンジニアリング

攻撃はGoogle Cloud Threat Intelligenceが文書化した [UNC1069の手法](https://cloud.google.com/blog/topics/threat-intelligence/unc1069-targets-cryptocurrency-ai-social-engineering) に酷似。メンテナーに対して以下のようにカスタマイズされた攻撃が行われた：

1. **偽の企業創設者になりすまし**: 実在する企業の創設者の身元とブランドを複製
2. **精巧なSlackワークスペース**: 企業CIに合わせたブランディング、LinkedInの投稿を共有するチャンネル、偽のチームメンバープロフィール、他のOSSメンテナーの偽プロフィールも配置
3. **MS Teamsでの偽ミーティング**: 複数の参加者がいるように見せかけた会議を設定
4. **RATのインストール誘導**: 会議中に「システムが古い」と表示させ、アップデートを装ってRATマルウェアをインストールさせた

### RATマルウェアの動作（@tayvanoの解説）

この攻撃はBlueNoroff（北朝鮮関連）の手法と一致：

1. 偽のZoom/Teams通話でソーシャルエンジニアリング（自然な会話で警戒を解く）
2. ブラウザ内で実際のSDKとCSSを使用した精巧な偽UI。音声が機能しない→修正を促す
3. AppleScriptのダウンロードまたはターミナルへのコピペを誘導（1行のコードに偽装用の行を追加）
4. デバイスに常駐し、UUIDを生成、60秒ごとにC2サーバーへ通信（「何か実行すべきコマンドはあるか？」）
5. キーロガー、スティーラー、Chrome拡張の置換など多数のモジュールを個別に配信可能。**攻撃者がターゲットごとにカスタムペイロードを作成**

---

## 修復と今後の対策

| アクション | 種別 |
|---|---|
| すべてのデバイス・認証情報のリセット | Prevention |
| イミュータブルなリリースセットアップ | Prevention |
| OIDC フローによるパブリッシングの適切な導入 | Prevention |
| 全体的なセキュリティ態勢の改善 | Prevention |
| GitHub Actionsのベストプラクティス導入 | Prevention |

---

## 重要な教訓

### メンテナー側

- **個人アカウントからの直接パブリッシュはリスク**: OIDCフローとイミュータブルリリースは事前に導入すべきだった
- **不正パブリッシュの自動検出手段がなかった**: コミュニティの目視に依存
- **高影響パッケージのメンテナーは高度なソーシャルエンジニアリングの標的**: 個人的な領域でも超警戒が必要

### エコシステム全体の課題（@shaanmajid、@ferossらの指摘）

- **axiosはすでに多くの推奨対策を実施済みだった**: v1.xはGitHub Actions + Trusted Publishingで公開（provenance attestation付き）。2FA有効。**それでも防げなかった**
- **npmにはOIDCオンリーパブリッシングを強制する設定がない**: 最も厳格な設定でもローカル `npm publish` をブロックできない。RATが入ったマシンではソフトウェアTOTPは無力
- **FIDO2ハードウェアキーのみがRATに対して有効な2FA**: ソフトウェアベースの2FAはRATで回避可能
- **依存性クールダウン期間**: 悪意あるバージョンは約3時間のみ有効だった。3日間のクールダウンがあれば被害はなかった（Dependabot、Renovate、uv、bunは `minimumReleaseAge` をサポート）
- **provenance検証の普及不足**: 正規のv1リリースにはすべてOIDC provenanceがあり、悪意あるバージョンにはなかった。検証ツールがあれば即座にフラグ可能だが、実質的に誰も行っていない

### 追加リスク（@ahmadnassriの指摘）

- `npx` の実行は非決定的な依存解決を行い、package-lockにトレースが残らない
- `npx @latest` をCI/MCPツールのセットアップドキュメントが推奨していることが問題
- `npx` のハードニング: pre-install + lockファイル生成 + `--no --offline` の使用

---

## コミュニティの反応と追加情報

- **@tayvano**: OSSメンテナーが組織的に標的にされる傾向を警告。暗号通貨業界では以前から同様の攻撃が確認。**専用デバイスの使用**（パッケージ更新用に隔離されたデバイス）を強く推奨
- **@voxpelli**: ポッドキャスト出演を装った類似攻撃を報告（未認証のネイティブアプリのインストールを誘導）
- **@aeneasr**: システム全体スキャンツール [was-i-axios-pwned](https://github.com/aeneasr/was-i-axios-pwned) を公開。npmキャッシュの検査も必要
- **@TrySound**: 攻撃に使用されたペルソナ（Joan Alaverda / OpenFort）が他の開発者にも接触していたことを報告

### 参考リンク

- [StepSecurity: 技術分析と修復ガイド](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan)
- [Snyk: アドバイザリーとスキャンガイダンス](https://snyk.io/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/)
- [Socket: サプライチェーン攻撃分析](https://socket.dev/blog/axios-npm-package-compromised)
- [Datadog Security Labs: 攻撃フローと応答分析](https://securitylabs.datadoghq.com/articles/axios-npm-supply-chain-compromise/)
- [BlueNoroff GhostCall/GhostHire分析](https://securelist.com/bluenoroff-apt-campaigns-ghostcall-and-ghosthire/117842/)
- [Huntress: BlueNoroff Web3侵入分析](https://www.huntress.com/blog/inside-bluenoroff-web3-intrusion-analysis)
- [SentinelOne: DPRK Nim-Based Malware](https://www.sentinelone.com/labs/macos-nimdoor-dprk-threat-actors-target-web3-and-crypto-platforms-with-nim-based-malware/)
