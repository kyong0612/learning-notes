---
title: "生成AI活用の組織格差を解消する 〜ビジネス職のCursor導入が開発効率に与えた好循環〜 / Closing the Organizational Gap in AI Adoption"
source: "https://speakerdeck.com/upamune/closing-the-organizational-gap-in-ai-adoption"
author:
  - "upamune / Yu SERIZAWA"
published: 2025-07-01
created: 2025-07-03
description: |
  本資料は、LayerXのバクラク事業部におけるAI活用推進組織「Bet AI Guild」の取り組みを紹介するものです。特に、ビジネス職へのCursor導入が、組織全体の生産性向上と開発効率の好循環をいかに生み出したかに焦点を当てています。非エンジニアが直面する障壁を乗り越えるための具体的な施策や、それによって得られた定性的・定量的な成果について詳述されています。
tags:
  - "AI"
  - "Cursor"
  - "開発者体験"
  - "組織論"
  - "生産性向上"
---

## TL;DR

LayerXのバクラク事業部では、AI活用推進組織「Bet AI Guild」が主体となり、ビジネス職にCursorを導入しました。これにより、非エンジニアが抱える「コンテキスト収集」「ルール設定」「ファイル配置」の障壁を、Gitサブモジュールや共通ルール設定などで解消。結果として、問い合わせ対応やデータ抽出、顧客要望分析などの業務が効率化され、開発者への問い合わせが減少。この成功が組織全体に波及し、生産性向上の「好循環」が生まれています。現在は、さらなる課題解決のため、社内向けChrome拡張機能の開発にも取り組んでいます。

---

## プレゼンテーション要約

このプレゼンテーションでは、LayerXのバクラク事業部におけるAI活用推進組織「Bet AI Guild」が、どのようにして組織内の生成AI活用格差を解消し、特にビジネス職へのCursor導入を通じて開発効率の向上という好循環を生み出したかについて詳述されています。

### 導入

![Slide 1](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_0.jpg)

発表者はLayerX バクラク事業部のソフトウェアエンジニアである upamune (うぱ) 氏。AI活用を推進する「Bet AI Guild」のメンバーでもあります。
![Slide 2](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_1.jpg)

本発表では、生成AIの組織格差を解消するための具体的な取り組みと、それがもたらした開発効率への好循環について紹介します。
![Slide 3](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_2.jpg)

### Bet AI Guild とは？

![Slide 4](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_3.jpg)

LayerXのバクラク事業部におけるAI活用推進を目的とした有志の組織です。

* **ミッション:** 「AIで全員を幸せにする。愛。」
* **メンバー:** エンジニア4名、技術広報1名
* **活動内容:** AIツールの導入・環境整備、AIツールの開発、社内外への情報発信など。プロダクトの機能開発は行いません。
![Slide 5](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_4.jpg)

### これまでの開発者向けの活動

![Slide 6](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_5.jpg)

* **AI Codingツールの検証:** Cursor, Roo Code, Claude Codeなどを検証。
* **環境整備:** モノレポでのルール管理ツール開発。
* **ベストプラクティス共有:** 週次での共有会やドキュメント整備。
* **コンテキスト整備:** ADR/Design DocなどをMarkdownファイルとして整備。
![Slide 7](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_6.jpg)

Claude Codeの登場により、多くのエンジニアが自主的に知見共有を始めるなど、Guildのサポートが以前ほど必要なくなるという転換点を迎えました。
![Slide 8](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_7.jpg)

### 第一弾：ビジネス職へのCursor導入

![Slide 9](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_8.jpg)

**なぜビジネス職にCursorか？**

* **問い合わせ対応:** 仕様書やサポートページをコンテキストとして与え、回答を生成。
* **SQLクエリ作成:** DWHのスキーマを学習させ、データ抽出クエリを自動生成。
* **顧客要望分析:** 蓄積された要望データを基に、カテゴライズや傾向分析を実施。
![Slide 10](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_9.jpg)

**非エンジニアがCursorを使う際の3つの障壁と解決策**
ビジネス職向けのGitHubリポジトリを作成し、ターミナル操作不要で環境構築ができる仕組みを整備しました。
![Slide 11](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_10.jpg)

1. **コンテキスト収集の難しさ → Gitサブモジュールで解決**
    * プロダクトコードや仕様書をサブモジュールとして登録し、GitHub Actionsで毎日自動更新。
    * VS Codeのタスク機能(`tasks.json`)を利用し、GUI操作のみで最新のコンテキストを取得可能に。
    ![Slide 12](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_11.jpg)
    ![Slide 13](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_12.jpg)
    ![Slide 14](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_13.jpg)

2. **Cursorルール設定の複雑さ → 共通Cursorルールの導入**
    * 共通ルール（`shared-*.mdc`）をGitで管理し、全社的なベストプラクティスを共有。
    * 個人ルールはgitignoreすることで、カスタマイズの自由度も確保。
    ![Slide 15](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_14.jpg)
    ![Slide 16](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_15.jpg)

3. **ファイル配置の不明確さ → `notes`ディレクトリの指定**
    * 作業用ファイルを配置する`notes`ディレクトリを予め用意。このディレクトリはgitignoreされ、個人が自由に使えるスペースとしています。
    ![Slide 17](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_16.jpg)

**その他の工夫**

* 推奨VS Code拡張機能（`.vscode/extensions.json`）やエディタ設定（`.vscode/settings.json`）をコミットし、セットアップを簡略化。
* 導入時には同期的なセットアップ会を開催し、録画を共有。
![Slide 18](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_17.jpg)

**実際の活用例**

* **問い合わせ対応:** エンジニアに聞かずとも自己解決。
* **SQLクエリ作成:** DWHスキーマを理解した正確なSQLを生成。
* **顧客要望分析:** 顧客要望データのカテゴリ分けや頻度集計を自動化し、数分でインサイトを得る。
![Slide 19](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_18.jpg)

**AI活用が生む「好循環」**

1. **問い合わせ減少:** Biz職の自己解決能力が向上し、開発者の作業時間が増加。
2. **活用拡大:** 成功事例の共有が他チームへ波及し、組織全体の生産性が向上。
3. **改善促進:** Biz職からのフィードバックを基に、開発者がツールをさらに改善。
![Slide 20](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_19.jpg)

### 第二弾：さらなる改善への挑戦

![Slide 21](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_20.jpg)

Biz組織向けにアンケートを実施し、「なくなったら嬉しい業務」や「やりたいけどできていない業務」を調査。
![Slide 22](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_21.jpg)
![Slide 23](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_22.jpg)
![Slide 24](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_23.jpg)

調査結果を基に、各種Webサービス上での細かな困りごとを解決するため、PoCとして社内向けChrome拡張機能の開発を試みています。
![Slide 25](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_24.jpg)
![Slide 26](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_25.jpg)

### まとめ

![Slide 27](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_26.jpg)

* Bet AI Guildは、エンジニアとビジネス職が共にAIを活用するための土台を整備。
* AIの恩恵を全職種が享受するフェーズにおいて、環境構築やナレッジ整備をリードするのはエンジニアの新たな責務。
* これらの取り組みが組織全体の生産性と開発スピードを底上げする。

![Slide 28](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_27.jpg)
![Slide 29](https://files.speakerdeck.com/presentations/6bf0e2d7821541af905b41af57a96129/slide_28.jpg)
