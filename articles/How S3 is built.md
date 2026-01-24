---
title: "How S3 is built"
source: "https://newsletter.pragmaticengineer.com/p/how-aws-s3-is-built"
author:
  - "[[Gergely Orosz]]"
  - "[[Mai-Lan Tomsen Bukovec]]"
published: 2026-01-21
created: 2026-01-24
description: "A behind-the-scenes look at how Amazon S3 is designed for durability and correctness at massive scale, drawing on over a decade of operating one of the world's largest distributed systems with Mai-Lan Tomsen Bukovec at AWS."
tags:
  - distributed-systems
  - aws
  - s3
  - storage
  - formal-methods
  - rust
  - durability
  - consistency
  - microservices
  - system-design
---

## 概要

Amazon S3は世界最大の分散ストレージシステムの一つであり、インターネットのかなりの部分のデータを保存・提供している。本記事は、10年以上S3を率いてきたMai-Lan Tomsen Bukovec（AWS VP of Data and Analytics）へのインタビューを通じて、S3がどのように極限のスケールで動作し、耐久性と可用性を設計し、障害を前提として構築されているかを解説する。

## S3の規模

- **トランザクション**: 毎秒数億件のトランザクションを処理
- **オブジェクト数**: 500兆以上のオブジェクトを保存
- **データ量**: 数百エクサバイト（1エクサバイト = 1,000ペタバイト = 100万テラバイト）
- **ハードドライブ**: 数千万台のハードドライブを使用。すべて積み上げると国際宇宙ステーションまで届き、ほぼ戻ってこれる高さ

## 強一貫性（Strong Consistency）の実装

### 背景
- 2006年のS3ローンチ時は**結果整合性（Eventual Consistency）**を採用
- 高可用性を優先し、データ整合性の保証を緩和

### 技術的革新
強一貫性を可用性を損なわず、コスト増なしで実現した主要な技術：

1. **レプリケートジャーナル（Replicated Journal）**
   - ノードがチェーン状に接続された分散データ構造
   - 書き込みがすべてのノードを順次通過

2. **キャッシュコヒーレンシプロトコル**
   - 「障害許容度（Failure Allowance）」を提供
   - 複数サーバーが一部の障害を許容しながらリクエストを受信可能

## Rustへの移行

- 2006年のS3はRustで書かれていなかった
- **現在**: リクエストパスのほぼすべてのパフォーマンスクリティカルなコードをRustで書き直し
- **目的**: 最高のパフォーマンスと最低のレイテンシの実現
- Rust専門のエンジニアチームがこの最適化作業に継続的に取り組んでいる

## 11 Ninesの耐久性（99.999999999%）

### 特徴
- 単なる約束ではなく、**実際に測定可能**
- AWS チームは「今週/今月/今年の実際の耐久性は？」という質問にいつでも回答可能

### 実現手法
1. **監査マイクロサービス**
   - フリート全体のすべてのバイトを継続的に検査
   
2. **修復システム**
   - 修復が必要な兆候を検出すると自動的に起動
   - 常にどこかでサーバーが故障しており、障害は常態として設計

## 形式手法（Formal Methods）の活用

> 「一定のスケールでは、数学があなたを救わなければならない。一定のスケールでは、すべてのエッジケースの組み合わせを実行することはできないが、数学ならできる」- Mai-Lan

### 実践的な適用
- **インデックスサブシステム**: コードチェックイン時に整合性モデルの後退がないことを自動的に形式証明で検証
- **クロスリージョンレプリケーション**: 正しさの証明に使用

### 推奨論文
- [Using lightweight formal methods to validate a key-value storage node in Amazon S3](https://www.amazon.science/publications/using-lightweight-formal-methods-to-validate-a-key-value-storage-node-in-amazon-s3)
- [Formally verified cloud-scale authorization](https://www.amazon.science/publications/formally-verified-cloud-scale-authorization)

## 相関障害（Correlated Failures）への対策

### 最大の脅威
- 個別の障害は想定内で対処可能
- **真の脅威**: 同じ障害ドメイン（同じラック、同じAZ、同じ電源）を共有するコンポーネントが同時に故障する相関障害

### アーキテクチャ上の対策
1. データを複数のアベイラビリティゾーンにレプリケート
2. クォーラムベースのアルゴリズムで個別ノード障害を許容
3. 物理・論理インフラを相関を避けるよう設計
4. すべてのオブジェクトを異なる障害ドメインに複数回保存

## マイクロサービスアーキテクチャ

### 構成
- **200以上のサービス**がS3を構成
- Uberの4,500以上のマイクロサービスと比較すると少ない
- サービス数と処理スケールに相関はないことを証明

### 設計哲学
- サービスの大部分は**耐久性専用**（ヘルスチェック、修復システム、監査）
- 複雑さは簡素化で管理：各マイクロサービスは焦点を絞る必要がある

## S3 Vectors

### 課題
- S3 Tablesとは異なり、完全に新しいデータ構造
- 高次元ベクトル空間での最近傍探索は計算コストが高い

### 解決策
1. **ベクトル近傍の事前計算**: 類似ベクトルのクラスタをオフラインで非同期に計算
2. **挿入時**: 新しいベクトルを類似性に基づいて1つ以上の近傍に追加
3. **クエリ時**: 最初に最も近い近傍を見つけ、それらのベクトルのみを高速メモリにロード

### 性能
- **ウォームクエリ時間**: 100ms未満
- **インデックスあたりベクトル数**: 最大20億
- **バケットあたりベクトル数**: 最大20兆

## 設計原則

### クラッシュ一貫性（Crash Consistency）
- フェイルストップ障害後も常に一貫した状態に戻るべきという性質
- 障害存在下でシステムが到達可能なすべての状態を推論
- 障害が常に存在することを前提にマイクロサービスを設計

### 「Scale Is to Your Advantage」原則

> スケールは常に有利に働かなければならない

- スケールに伴いパフォーマンスが低下するものは構築してはならない
- スケール増加が属性を**改善**するよう設計
- 例：S3が大きくなるほど、ワークロードの非相関性が高まり、全ユーザーの信頼性が向上

## 今後の展望

Mai-Lanからの推奨研究分野：

> 「データレイクの将来を考えると、実際にはメタデータとデータの意味理解についてになると思う。ベクトルを通じてそれを理解する必要があり、検索は複数のモダリティにまたがって行う必要がある」

- **マルチモーダル埋め込みモデル**: テキスト、画像、音声など異なるフォーマットのデータをセマンティックベクトルで理解する次のフロンティア

## 関連リソース

### 推奨論文（Mai-Lan推奨）
- [Using lightweight formal methods to validate a key-value storage node in Amazon S3](https://www.amazon.science/publications/using-lightweight-formal-methods-to-validate-a-key-value-storage-node-in-amazon-s3)
- [Formally verified cloud-scale authorization](https://www.amazon.science/publications/formally-verified-cloud-scale-authorization)
- [Analyzing metastable failures](https://www.amazon.science/publications/analyzing-metastable-failures)
- [Amazon's engineering tenets](https://www.amazon.jobs/content/en/teams/principal-engineering/tenets)

### 関連The Pragmatic Engineer記事
- [Inside Amazon's engineering culture](https://newsletter.pragmaticengineer.com/p/amazon)
- [How AWS deals with a major outage](https://newsletter.pragmaticengineer.com/p/how-aws-deals-with-a-major-outage)
- [Working at Amazon as a software engineer](https://newsletter.pragmaticengineer.com/p/working-at-amazon-as-a-software-engineer)

### 視聴リンク
- [YouTube](https://youtu.be/5vL6aCvgQXU)
- [Spotify](https://open.spotify.com/episode/5iWI2dX07eHjpU3poZLeMo)
- [Apple Podcasts](https://podcasts.apple.com/us/podcast/how-aws-s3-is-built/id1769051199?i=1000746086683)
