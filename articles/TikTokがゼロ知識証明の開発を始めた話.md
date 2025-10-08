---
title: "TikTokがゼロ知識証明の開発を始めた話"
source: "https://zenn.dev/mameta29/articles/d05f0c9d9dff90"
author:
  - "mameta_zk"
published: 2025-09-23
created: 2025-10-08
description: |
  TikTokがTEE（Trusted Execution Environment）のRemote Attestationにゼロ知識証明（ZKP）を使った仕組みをOSSで公開。信頼の境界を縮小し、数学的な証明によってプライバシー保護を実現する最先端の取り組みについて解説。
tags:
  - "ゼロ知識証明"
  - "TEE"
  - "Remote Attestation"
  - "セキュリティ"
  - "暗号技術"
  - "TikTok"
  - "zkSNARKs"
  - "Circom"
  - "プライバシー"
---

## はじめに

TikTokが2025年に入ってから、TEE（Trusted Execution Environment）のRA（Remote Attestation）に、ゼロ知識証明（ZKP）を使った仕組みをOSSで公開しました。本記事では、TEEやRemote Attestationとは何か、どのような場面でゼロ知識証明が使われるのか、そしてTikTokがこのような最先端な暗号技術を積極的に取り入れようとしている理由を解説します。

## 1. TEE（Trusted Execution Environment）とは

### 基本概念

**TEE**は、物理的なCPUチップ内に組み込まれた特別なセキュリティ機能によって、**外部から隔離された安全な実行環境**です。ハッキングなどでOSや管理者権限を持つ攻撃者が介入したとしても、中身の計算を守ることができます。

### 主要な実装

- **Intel SGX**: Intelのセキュリティ技術
- **ARM TrustZone**: ARMプロセッサのセキュリティ機能

### クラウドサービス上のTEE

GCPやAWS、Azureなどのクラウドプロバイダーは、TEEを使った「**機密コンピューティング（Confidential Computing）**」というサービスを提供しています。クラウド上のサーバーがTEEを搭載していれば、ユーザーがそのサーバーにデータを送っても、サーバー管理者やOSから内容をのぞかれたり改ざんされたりするリスクはありません。

## 2. Remote Attestation（リモート認証）

### アテステーションの基本概念

**Remote Attestation**（RA）は、「クラウド側の環境が本当に信頼できるか確認する仕組み」です。ユーザー（データを送る側）が「本当に相手のTEEが正しく動作しているのか？」をチェックするために必要な仕組みをアテステーションと呼びます。

### アテステーションに含まれる証拠

TEEを持つサーバー側は、自分のTEEが正規のもので改ざんされていないと証明するための「証拠」を発行します：

- **ハードウェアベンダー（IntelやAMDなど）によるデジタル署名付きの証明書**
- **TEEのファームウェアバージョン**
- **TEE内部で動かしているソフトウェアのハッシュ値**

### Remote Attestation Serviceの必要性

リモート環境（クラウドなど）では、ユーザーが直接サーバーのハードウェアに触れられず、アテステーションの証拠を全部自分で検証するのは現実的ではありません。そこで登場するのが**Remote Attestation Service**です。

### 一般的な仕組み

1. サーバー（TEE）側でハードウェアベンダーの証明書などを活用してアテステーションレポートを作成
2. Remote Attestation Service（クラウドプロバイダや専用の検証サービス）が、ハードウェアベンダーに登録されている正しい証明書や最新のファームウェア情報などと照合
3. 正しく照合できれば「OK」と判定し、ユーザーに報告する

## 3. Remote Attestationの課題

### Trust Boundary（信頼すべき領域）の拡大

本来であれば、ユーザーはハードウェアベンダー（例: Intel, AMD など）のTEE技術さえ信頼すればOKでした。しかし、Remote Attestation Serviceを使うと、**サービス提供者も信頼しなくてはいけない**ということになります。

### セキュリティリスクの増加

信頼すべき対象が増えるということは、それだけ攻撃の余地が増えることでもあります。攻撃者から見ると、本来なら突破すべき壁がハードウェア1つだけだったのが、認証サービスという別のレイヤーも狙えるようになります。

## 4. ゼロ知識証明によるRemote Attestationの課題解決

### ゼロ知識証明（Zero-Knowledge Proof）のおさらい

ゼロ知識証明は、**ある主張が「正しい」ことだけを証明して、その中身を一切明かさない**という技術です。計算結果の詳細や途中経過を示さずに、「正しく計算した」という事実だけを証明できます。

### ZKPを使ったRemote Attestation

**TEEの証拠を確認したということをゼロ知識証明で示す**ことで問題を解決します：

1. TikTok（またはクラウド運営者）はTEEの検証プロセスを行い、その結果を**証明書の形ではなくZKPの「証明」の形**でユーザに提供
2. ユーザ側はそのZKPの証明を検証するだけで、TEEの実行が正しく行われていると納得できる

### 重要なポイント

ユーザは**サービス提供者を信頼する必要はなく、数学的な証明の正しさだけを信じればよい**という点です。これにより、**信頼の境界（Trust boundary）を縮小**でき、ユーザは「ハードウェアベンダ（Intelなど）さえ信じればOK」となり、Attestationの部分は数学で保証済みということにできます。

## 5. TikTokの具体的な取り組み

### OSSプロジェクト

TikTokは、**TEEのRemote Attestationの信頼性問題をゼロ知識証明で解決する**ために、OSSを公開しています：
<https://github.com/tiktok-privacy-innovation/trustless-attestation-verification-circom>

### 技術スタック

#### zkSNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)

コンパクトな証明サイズでオフチェーン証明・オンチェーン検証が可能。Groth16やPlonkといったプロトコルがあります。

#### Circom

ZK-SNARKsを扱うためのドメイン特化言語（DSL）。論理回路（Arithmetic circuits）を記述することで、ZK回路を比較的直感的に書けるようになっています。

### システムモデル

1. **回路化**: TEEの証明書検証アルゴリズムをCircomで記述
2. **鍵生成**: その回路に対して証明鍵と検証鍵を生成
3. **クラウド側のRemote Attestation Service**: 証明鍵を使ってアテステーション報告をZKP証明として生成
4. **ユーザ側（Relying Parties）**: 検証鍵を用いてZKPの証明を検証し、「本当に正しいアテステーションが行われたか」を判定

### 現在の実装状況

TikTokはプロトタイプ実装として、まず**TEE Attestationレポート内の証明書チェーンを検証する回路**を提供しています。証明書チェーンが有効なら「正規のTEEです」と言えるので、まずはそこを回路でチェックできるようにしています。

## 6. TikTokが最先端暗号技術を採用している背景

### 技術的課題

先述した**Remote Attestation Serviceへの信頼問題**です。TEEではハードウェアベンダだけを信頼すればよいはずですが、RAサービスを導入することでTrust Boundary（信頼の境界）が広がってしまいます。いかに「信頼すべき対象」を減らすかを考えた結果の技術選定です。

### 社会的・政治的な背景

TikTokは全世界で膨大なユーザデータを扱うプラットフォームです。

#### 米国での懸念

アメリカでは「中国政府にデータを渡すのではないか」という懸念から、国内のTikTokの**禁止もありうる**と宣言されています。2023年にはTikTok CEOが米議会で「中国政府からデータ提供の要求を受けたこともなければ、要求があっても応じない」と証言しています。

#### 各国での取り組み

**プロジェクト・テキサス**

- アメリカ向けの取り組み
- アメリカ人ユーザーデータを米国内（オラクル社）に保存・管理させる計画

**プロジェクト・クローバー**

- ヨーロッパ向けの取り組み
- ヨーロッパのユーザーデータをヨーロッパ内のデータセンターに移管
- NCCグループという独立機関による監査の下で「セキュアなエンクレーブ（強化された保護環境）」にデータを置く計画

### TEE+ZKP採用の意義

今回のTEE＋ZKP技術の採用は、こうした流れの一環と考えられます。TikTokにとっては、利用制限されないためにも各国政府の信頼を得ることが重要です。そのために、**技術的に証明可能なプライバシー保護**によって周囲の評価を得ようという戦略だと考えられます。

## まとめ

- **TEE**は物理的なCPUチップ内の隔離された安全な実行環境
- **Remote Attestation**はクラウド環境のTEEの信頼性を検証する仕組み
- 従来のRAは信頼すべき対象（Trust Boundary）が広がる問題がある
- **ゼロ知識証明**を使うことで、サービス提供者を信頼せず数学的証明のみで検証可能に
- TikTokは**zkSNARKs**と**Circom**を使った実装をOSSで公開
- 技術的課題と社会的・政治的な信頼獲得の両面から、TikTokがこの技術を採用

今までゼロ知識証明はブロックチェーン界隈や学術分野の話と思われがちでしたが、TikTokのような一般向けのサービスがZKPを使うとなると、今後のZKPの広がりに期待できます。もしTikTokがこのプロトタイプを実運用していくとなれば、SNS業界だけでなく他の業界でも、プライバシーや信用という面により光が当たって、ZKPなどの技術の使用が広がるのではないでしょうか。

## 参考資料

- [Trustless Attestation Verification With Zero-Knowledge Proofs | TikTok for Developers](https://developers.tiktok.com/blog/verifying-trusted-execution-environments)
- [TikTok CEO: App has never shared US data with Chinese government | Reuters](https://www.reuters.com/technology/tiktok-ceo-app-has-never-shared-us-data-with-chinese-goverment-2023-03-22)
- [Setting a new standard in European data security with Project Clover](https://newsroom.tiktok.com/en-ie/project-clover-ireland)
- [TikTok's Privacy Innovation 2024 Roadmap](https://developers.tiktok.com/blog/2024-privacy-innovation-roadmap)
- [GitHub: trustless-attestation-verification-circom](https://github.com/tiktok-privacy-innovation/trustless-attestation-verification-circom)
