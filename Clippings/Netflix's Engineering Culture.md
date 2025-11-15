---
title: "Netflix's Engineering Culture"
source: "https://newsletter.pragmaticengineer.com/p/netflix"
author:
  - "Gergely Orosz"
published: 2025-11-12
created: 2025-11-15
description: |
  NetflixのCTO Elizabeth Stoneとの対談を通じて、Netflixのエンジニアリングカルチャーを深掘り。正式なパフォーマンスレビューがない組織運営、失敗から学ぶ文化、グローバル規模での構築方法について。エンジニアの意思決定の自律性、Netflix Liveのような高リスクプロジェクトでの自律性とガードレールのバランス、新卒採用の導入、オープンソースへの投資など、Netflixの独自のエンジニアリング文化の内側を探る。
tags:
  - "clippings"
  - "engineering-culture"
  - "netflix"
  - "leadership"
  - "organizational-design"
  - "performance-management"
---

# Netflix's Engineering Culture

## 概要

The Pragmatic EngineerのGergely Oroszが、NetflixのCTO Elizabeth Stoneと対談し、Netflixのエンジニアリングカルチャーについて深く掘り下げたエピソード。Netflixの本社（ロスガトス）で収録された特別エピソード。

## 主要なトピック

### Netflixのスケール

- 世界最大級のストリーミング企業の一つ
- グローバル規模でのエンジニアリングの課題と対応

### エンジニアリングカルチャーの特徴

#### 1. 「異常に責任を持つ」文化（Unusually Responsible）

- エンジニアが承認レイヤーなしで意思決定を行う
- 高い自律性と責任感を重視
- チームが自己反省し、障害や失敗から学ぶ文化

#### 2. パフォーマンスレビューの不在

- **正式なパフォーマンスレビュープロセスがない**
- 多くのテック企業では年次または半期のパフォーマンスプロセスが重く、エンジニアリングマネージャーと多くのエンジニアから1ヶ月以上の集中力を奪う
- Netflixでは代わりに以下を実施：
  - 継続的なフィードバック
  - 軽量なチェックイン（[Keeper Test](https://jobs.netflix.com/culture)を含む）
  - 年次360度レビュープロセス（「安全網」として機能し、継続的フィードバックでは捉えられない問題を強調するための軽量なフィードバックプロセス）

#### 3. 自律性とガードレールのバランス

- Netflix Liveのような高リスクプロジェクトでの自律性とガードレールのバランス
- グローバルスポーツ向けのNetflix Live構築
- Paul vs. TysonのイベントからNFL Liveへの学び

### 採用と人材管理

#### 新卒採用の導入

- **Netflixは会社の最初の25年間（2023年まで）はシニアソフトウェアエンジニアのみを採用**
- 2023年に[エンジニアリングレベルを導入](https://newsletter.pragmaticengineer.com/p/thte-scoop-23)
- 現在は新卒を採用：0%の新卒比率から始まったため、より多くの余地がある
- テック企業がより多くのインターンや新卒を採用するのは[最近観察されているトレンド](https://newsletter.pragmaticengineer.com/i/178001705/junior-engineer-hiring-to-rebound)

#### エンジニアの離職と定着

- Signal Fireのレポートによると、Netflixはチャートの右上に位置し、強力なエンジニアリング人材を採用し、業界平均を上回る定着率を維持
- エンジニアが離職する理由、または留まる理由についての考察

### AIツールの活用

#### 効果的な領域

NetflixでAIツールがうまく機能する領域：

- **プロトタイピング**
- **コードの文書化**
- **大規模なマイグレーション作業**
- **問題の検出**（異常検知と根本原因分析）

#### AIに対する姿勢

- AIを「銀の弾丸」とは見なしていない
- ツールを実験的に使用し、数年前と比べて有用性が大幅に向上したことを観察

### オープンソースへの投資

#### 驚くべき投資規模

- **Netflixはオープンソースへの貢献で9つのエミー賞を受賞**（主にビデオストリーミングへの貢献）
- **Big Tech全体で、Netflixは全エンジニアの中でオープンソースに貢献する割合が最も高い：約20%**
- これは驚くべき事実で、ポッドキャストで詳細に議論

### 技術スタックとインフラ

#### プロダクションソフトウェアスタック

- プロダクションでのエンジニアリングの課題
- Open Connect配信ネットワークの仕組み
- ピッチからプレイまでのプロセス

#### Netflix Live

- グローバルスポーツ向けの構築
- コントロールルームの内部
- リアルタイムストリーミングの世界記録規模での実現

## 興味深い詳細

### Netflixについての興味深い事実

1. **エンジニアリング人材と定着の「トップ」企業**
   - Signal Fireのレポートによると、Netflixはチャートの右上に位置し、強力なエンジニアリング人材を採用し、業界平均を上回る定着率を維持

2. **新卒採用**
   - 会社の最初の25年間はシニアエンジニアのみを採用
   - 2023年にレベルを導入し、新卒採用を開始
   - 0%から始まったため、より多くの余地がある

3. **正式なパフォーマンスレビュープロセスの不在**
   - 重いプロセスの代わりに継続的なフィードバックと軽量なチェックインを実施
   - Keeper Testを含む
   - 年次360度レビューを「安全網」として使用

4. **AIツールがうまく機能する領域**
   - プロトタイピング、コードの文書化、大規模マイグレーション、問題検出
   - AIを「銀の弾丸」とは見なさず、実験的に使用

5. **予想外に大きなオープンソース投資**
   - オープンソースへの貢献で9つのエミー賞を受賞
   - 全エンジニアの約20%がオープンソースに貢献（Big Techで最高の割合）

## エピソードのタイムスタンプ

- [00:00](https://www.youtube.com/watch?v=sAp9RjO79cU) イントロ
- [01:44](https://www.youtube.com/watch?v=sAp9RjO79cU&t=104s) Netflixのスケール
- [03:31](https://www.youtube.com/watch?v=sAp9RjO79cU&t=211s) プロダクションソフトウェアスタック
- [05:20](https://www.youtube.com/watch?v=sAp9RjO79cU&t=320s) プロダクションでのエンジニアリングの課題
- [06:38](https://www.youtube.com/watch?v=sAp9RjO79cU&t=398s) Open Connect配信ネットワークの仕組み
- [08:30](https://www.youtube.com/watch?v=sAp9RjO79cU&t=510s) ピッチからプレイまで
- [11:31](https://www.youtube.com/watch?v=sAp9RjO79cU&t=691s) Netflixがエンジニアの意思決定を可能にする方法
- [13:26](https://www.youtube.com/watch?v=sAp9RjO79cU&t=806s) グローバルスポーツ向けのNetflix Live構築
- [16:25](https://www.youtube.com/watch?v=sAp9RjO79cU&t=985s) Paul vs. TysonからNFL Liveへの学び
- [17:47](https://www.youtube.com/watch?v=sAp9RjO79cU&t=1067s) コントロールルームの内部
- [20:35](https://www.youtube.com/watch?v=sAp9RjO79cU&t=1235s) 「異常に責任を持つ」ことがどのように見えるか
- [24:15](https://www.youtube.com/watch?v=sAp9RjO79cU&t=1455s) Live向けのチーム自律性とガードレールのバランス
- [30:55](https://www.youtube.com/watch?v=sAp9RjO79cU&t=1855s) 高い人材基準とNetflixでのレベルの導入
- [36:01](https://www.youtube.com/watch?v=sAp9RjO79cU&t=2161s) Keeper Test
- [41:27](https://www.youtube.com/watch?v=sAp9RjO79cU&t=2487s) エンジニアが離職する理由、または留まる理由
- [44:27](https://www.youtube.com/watch?v=sAp9RjO79cU&t=2667s) NetflixでのAIツールの使用方法
- [47:54](https://www.youtube.com/watch?v=sAp9RjO79cU&t=2874s) AIの最も影響力のあるユースケース
- [50:20](https://www.youtube.com/watch?v=sAp9RjO79cU&t=3020s) 新卒が追加するものと、シニア人材が依然として重要な理由
- [53:25](https://www.youtube.com/watch?v=sAp9RjO79cU&t=3205s) Netflixでのオープンソース
- [57:07](https://www.youtube.com/watch?v=sAp9RjO79cU&t=3427s) Netflixで成功するための新エンジニアへのElizabethの最後のアドバイス

## 関連リソース

### The Pragmatic Engineerの関連ディープダイブ

- [Netflixでのシニアのみのレベルの終焉](https://newsletter.pragmaticengineer.com/p/thte-scoop-23)
- [Netflixが報酬哲学を刷新](https://newsletter.pragmaticengineer.com/p/the-scoop-29)
- [世界記録規模でのライブストリーミング（Ashutosh Agrawalと）](https://newsletter.pragmaticengineer.com/p/live-streaming-at-world-record-scale)
- [プロダクションへの出荷](https://newsletter.pragmaticengineer.com/p/shipping-to-production)
- [良いソフトウェアアーキテクチャとは何か？](https://newsletter.pragmaticengineer.com/p/what-is-good-software-architecture)

### エピソード中に言及されたリソース

- **Elizabeth Stoneの連絡先**: [LinkedIn](https://www.linkedin.com/in/elizabeth-stone-608a754/)
- **Eyeline**: VFXとバーチャルプロダクションの最高のものを一緒に: <https://about.netflix.com/en/news/bringing-the-best-in-vfx-and-virtual-production-together-as-eyeline>
- **Open Connect**: <https://openconnect.netflix.com>
- **Jake Paul vs. Mike Tyson**: 史上最もストリーミングされたスポーツイベント: <https://www.netflix.com/tudum/articles/jake-paul-vs-mike-tyson-live-release-date-news>
- **Chris Rock Stand-Up Special**: <https://www.netflix.com/tudum/articles/chris-rock-live-standup-special>
- **Chaos Monkey**: <https://www.techtarget.com/whatis/definition/Chaos-Monkey>
- **The Scoop**: Netflixのソフトウェアエンジニア向けレベルの歴史的導入: <https://blog.pragmaticengineer.com/netflix-levels>
- **SignalFireレポート**: コード、文化、競争優位性: エンジニアリング人材ゲームで誰が勝っているか？: <https://www.signalfire.com/blog/report-engineering-talent-retention>
- **Alliance for Open Media**: <https://aomedia.org>
- **Behind the Streams**: Netflixでの3年間のライブ。パート1: <https://netflixtechblog.com/behind-the-streams-live-at-netflix-part-1-d23f917c2f40>

## 視聴・視聴方法

- **YouTube**: <https://youtu.be/sAp9RjO79cU>
- **Spotify**: <https://open.spotify.com/episode/2DkaNGOZwsSL8CMJMb11bD>
- **Apple Podcasts**: <https://podcasts.apple.com/us/podcast/netflixs-engineering-culture/id1769051199?i=1000736465611>
- エピソードのトランスクリプトはページの上部に、タイムスタンプは下部にあります

## 重要なポイントのまとめ

### 組織文化

1. **自律性と責任**: エンジニアは承認レイヤーなしで意思決定を行う高い自律性を持つ
2. **継続的フィードバック**: 重いパフォーマンスレビューの代わりに、継続的なフィードバックと軽量なチェックインを実施
3. **失敗から学ぶ**: チームは自己反省し、障害や失敗から学ぶ文化を持つ

### 人材管理

1. **高い人材基準**: 最初の25年間はシニアエンジニアのみを採用
2. **新卒採用の導入**: 2023年にレベルを導入し、新卒採用を開始
3. **Keeper Test**: 軽量なチェックインの一部として使用

### 技術とイノベーション

1. **AIツールの戦略的使用**: プロトタイピング、文書化、マイグレーション、問題検出に効果的
2. **オープンソースへの強いコミットメント**: 全エンジニアの約20%がオープンソースに貢献
3. **グローバルスケールでの構築**: Netflix Liveのような高リスクプロジェクトでの自律性とガードレールのバランス

### エンジニアリングプラクティス

1. **Open Connect**: 独自の配信ネットワーク
2. **プロダクションへの出荷**: ピッチからプレイまでの効率的なプロセス
3. **リアルタイムストリーミング**: 世界記録規模での実現

## 結論

Netflixのエンジニアリングカルチャーは、高い自律性、継続的な学習、失敗から学ぶ文化、そしてオープンソースへの強いコミットメントによって特徴づけられています。正式なパフォーマンスレビュープロセスの不在は、継続的なフィードバックと軽量なチェックインによって補完されており、エンジニアがより多くの時間を実際のエンジニアリング作業に費やすことができるようになっています。新卒採用の導入とオープンソースへの投資は、Netflixが継続的に進化し、イノベーションを推進していることを示しています。
