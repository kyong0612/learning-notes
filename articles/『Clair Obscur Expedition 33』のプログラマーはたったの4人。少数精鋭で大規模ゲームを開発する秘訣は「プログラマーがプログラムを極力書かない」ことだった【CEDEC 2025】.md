---
title: "『Clair Obscur: Expedition 33』のプログラマーはたったの4人。少数精鋭で大規模ゲームを開発する秘訣は「プログラマーがプログラムを極力書かない」ことだった【CEDEC 2025】"
source: "https://news.denfaminicogamer.jp/kikakuthetower/250723l"
author:
  - "DuckHead"
published: 2025-07-23
created: 2025-07-25
description: |
  『Clair Obscur: Expedition 33』は、わずか4人のプログラマーで開発された大規模ゲームです。CEDEC 2025の講演で、開発会社Sandfallがその秘訣を公開しました。Unreal EngineのBlueprintを95%活用し、「プログラマーが極力プログラムを書かない」体制を構築。これにより開発効率を大幅に向上させつつも、デバッグの困難さなどの課題に直面。本記事では、この少数精鋭開発を支えた技術的選択、課題、そしてスクリプトの再利用といった具体的な手法について詳しく解説します。
tags:
  - "clippings"
  - "CEDEC 2025"
  - "Clair Obscur: Expedition 33"
  - "GameDevelopment"
  - "Unreal Engine"
  - "講演レポート"
  - "kawasaki"
---

## 概要

2025年のCEDECで、『Clair Obscur: Expedition 33』の開発チームが、わずか4人のプログラマーで大規模ゲームを制作した技術的アプローチについて講演しました。開発会社SandfallのCEOギヨーム・ブロッシュ氏とプログラマーのトム・ギラーミン氏が登壇し、Unreal Engine 5（UE5）を駆使して「プログラマーが極力プログラムを書かない」開発体制をいかにして実現したかを語りました。

![article-thumbnail-250723l](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/2ba779299f107168d51fd3fc31b8f542.jpg)

## 少数精鋭での開発体制

開発は当初、ギヨーム氏個人の趣味から始まり、半年後にトム氏が参加。1年間は2名体制で開発が進められ、最終的にプログラマーは4名となりました。この限られたリソースの中で大規模なゲームを開発するため、チームは効率化の手法を模索しました。

[![登壇者](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/01-6.png)](https://news.denfaminicogamer.jp/kikakuthetower/250723l/attachment/01-707)

## 「プログラムを書かない」開発手法

### Blueprintの全面的な活用

開発の核となったのは、Unreal Engineのビジュアルスクリプティングシステム「Blueprint」でした。全体の95%がBlueprintで開発され、プログラマーがコードを書かずとも開発できる環境を構築しました。これにより、プログラマー以外のプランナーなども開発作業に直接関与できるようになり、効率が大幅に向上しました。

[![Blueprint活用](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/04-1.png)](https://news.denfaminicogamer.jp/kikakuthetower/250723l/attachment/04-565)

### メリットとデメリット

- **メリット**:
  - 開発作業の効率化に大きく貢献。
  - プログラマー以外のスタッフも開発に参加可能。
- **デメリット**:
  - デバッグ作業が困難になる。
  - トラッキングが行いにくい。
  - UIが使いにくくなる可能性。

[![メリット・デメリット](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/06.png)](https://news.denfaminicogamer.jp/kikakuthetower/250723l/attachment/06-427)

## 効率化の追求とシステムの再利用

開発チームは、常に効率化を追求しました。例えば、自作のデバッグツールを他の開発作業に応用したり、一つのシステムを複数の機能で再利用したりしました。

### 具体的な実装例

- **共通ツールの応用**:
    「ターゲットの取得機能」と「キャラクターの移動」は同じツールで作成されました。これにより、パリィや回避などの精密なアクションのタイミング調整を効率的に行うことができました。
- **バフシステム**:
    Blueprintを用いた汎用的なバフシステムを構築。このスクリプトは、状態異常、武器のパッシブスキル、キャラの固有スキル、敵の属性切り替えなど、ゲーム内の多くのシステムに応用されました。
- **ゲームフロー管理**:
    ゲームの状態（シーンの再生、NPCとの対話履歴、アイテム所持状況など）を管理する条件チェッカーを実装し、ゲームの進行を制御しました。
- **Game Action Executor**:
    再利用可能なゲームライブラリのシステムを整備し、「Game Action Executor」という仕組みで管理やデバッグを行いました。

[![システム応用例](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/11-1.png)](https://news.denfaminicogamer.jp/kikakuthetower/250723l/attachment/11-488)

### 手法のメリット・デメリット（再掲）

トム氏はセッションの最後に、この開発手法の利点と欠点を改めてまとめました。

- **メリット**:
  - ひとつのスクリプトを様々なシステムに応用できる。
  - ライブラリなどをいつでも確認できる。
  - 共通のAPIを用いるため、新しいアクションが簡単に作れる。
- **デメリット**:
  - トラッキングが行いにくい。
  - UIが使いにくくなる可能性がある。
  - プランナーが作ったカットからバトルへの切り替えが、綺麗でないことがあった。

[![最終的なメリット・デメリット](https://news.denfaminicogamer.jp/wp-content/uploads/2025/07/16-1.png)](https://news.denfaminicogamer.jp/kikakuthetower/250723l/attachment/16-288)

## 結論

『Clair Obscur: Expedition 33』は、「プログラムをなるべく書かない」「作成したスクリプトを別の用途に応用する」といった戦略を取ることで、4人という小規模なプログラマーチームで多くのコンテンツを持つ高品質なゲームを完成させました。この独自の開発アプローチは、小規模チームが大規模プロジェクトに挑む際の貴重な知見となるでしょう。

---

### 関連リンク

- [CEDEC公式サイト](https://cedec.cesa.or.jp/2025/)
- [『Clair Obscur: Expedition 33』Steamストアページ](https://store.steampowered.com/app/1903340)
