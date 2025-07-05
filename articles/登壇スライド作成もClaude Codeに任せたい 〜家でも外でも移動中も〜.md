---
title: "登壇スライド作成もClaude Codeに任せたい 〜家でも外でも移動中も〜"
source: "https://zenn.dev/loglass/articles/a8b4b069c09002"
author:
  - "r.kagaya"
published: 2025-07-02
created: 2025-07-05
description: |
  Claude CodeとMarpを組み合わせ、スライド作成を自動化するシステムを構築した話。コンポーネントベースのCSSテーマ、ルールファイル、テンプレートを整備することで、移動中でも高品質なスライドを効率的に生成できるようになった経緯と具体的な手法を紹介します。
tags:
  - "slide"
  - "Marp"
  - "Cursor"
  - "LLM"
  - "Claude Code"
---
# 登壇スライド作成の自動化：Claude CodeとMarpでいつでもどこでも

本記事は、Claude CodeとMarpを活用して登壇スライド作成を自動化し、移動中でも効率的に作業できる環境を構築した事例を紹介します。

## 課題：定型的なスライド作成作業

スライド作成は、図の配置など創造的な側面がある一方、思考の整理後にスライドに落とし込む作業は定型的になりがちです。特に、会社のスライドテンプレートに合わせる作業は、登壇のたびに半日近くを要する課題がありました。

## 解決策：Claude CodeによるMarpスライド生成

MarpやSlidevのようなMarkdownベースのスライド作成ツールは知られていましたが、CSSの知識不足や既存テンプレートへの適用が障壁となっていました。しかし、Claude Codeの登場により、この問題は解決されました。

「モック画像を与えてコードを生成し、スクリーンショットでフィードバックする」というイテレーション手法を応用し、移動中にスライドを完成させることを目指しました。

![](https://storage.googleapis.com/zenn-user-upload/0ff77f410b5b-20250618.jpeg)
*出典: <https://www.youtube.com/live/6eBSHbLKuN0?si=7LxtTvU6-wMd8elq>*

## 生成されるスライドの品質

このシステムにより、以下のような高品質なスライドが自動で生成可能になりました。AIに話したい内容を雑多に伝えるだけで、構成、文章、スライドデザインまで一貫して作成してくれます。

![](https://storage.googleapis.com/zenn-user-upload/dab1edbfd8b3-20250618.png)
![](https://storage.googleapis.com/zenn-user-upload/9bde4cce2b76-20250618.png)
![](https://storage.googleapis.com/zenn-user-upload/996ed3e3d298-20250618.png)

## システムの全体像

シンプルなディレクトリ構成で、「input.mdに内容を書けばoutputにスライドができる」という仕組みを実現しています。

```
├── .claude/                     # Claude Code設定
│   ├── commands/                # カスタムコマンド
├── .cursor/                     # Cursor設定
│   └── rules/                  
│       └── slide_rules.mdc         # スライド作成の詳細ルール
│       └── compelling-content.mdc  # コンテンツ作成ルール
├── .images/                     # 画像アセット
├── themes/                      
│   └── theme.css               # カスタムテーマ
├── input/                      # 入力ファイル
├── output/                      # 生成されたスライドとPDF
├── resources/                   # 参照する過去の記事やブログ
├── YYYYMMDD_template.md         # スライドテンプレート
├── CLAUDE.md                    # Claude Code向けルール
├── README.md
```

## 設計思想：デザインシステムの応用

再現性の高いスライド生成を目指し、デザインシステムやコンポーネント集の考え方を応用しています。

### 1. `theme.css` - コンポーネントライブラリ

Marpのカスタムテーマとして、再利用可能な30種類以上のCSSコンポーネントを定義。メトリックカードや戦略グリッドなど、特定の用途に合わせたスタイルを用意しています。

![](https://storage.googleapis.com/zenn-user-upload/1dead9f42ab6-20250618.png)
![](https://storage.googleapis.com/zenn-user-upload/fe14fc00666c-20250618.png)

```css
/* KPI表示用のメトリックカード */
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
```

### 2. `slide_rules.mdc` - スライドレイアウトのルール

文字数制限、コンポーネントの使用ガイドライン、レビュー用チェックリストなどを定義し、AIへの指示の再現性を高めています。

```markdown
### データ表示コンポーネント
- **数値強調**: `.metric-card` - 重要な数値やKPIを視覚的に強調
- **戦略グリッド**: `.strategy-grid` - 戦略や提案を2列で整理

### 制約ルール
- タイトル: 最大30文字
- 本文: 1行最大40文字
- 1スライドあたり: 最大400文字、12行
```

### 3. `YYYYMMDD_template.md` - 実装例とベストプラクティス

各コンポーネントの具体的な使用例を示すファイル。AIはこれを参考にスライドを生成するため、このテンプレートを充実させることが品質向上に繋がります。

```markdown
<!-- メトリックカードの使用例 -->
<div class="columns-3">
  <div class="metric-card">
    <div class="metric-number">380<small>億円</small></div>
    <p>2023年 市場規模</p>
  </div>
  ...
</div>
```

## カスタム機能

### ブランドテーマの作成

Claude Codeに「会社のブランドカラーでテーマを作って」と繰り返し指示し、スクリーンショットでフィードバックすることで、会社のテンプレートに近いカスタムテーマを生成しました。

```css
/* themes/theme.css */
@theme ltheme

/* ブランドカラーの定義 */
:root {
  --brand-color: #0A2E5B;  /* ネイビー */
  --accent-color: #2352C8; /* アクセントブルー */
}

/* ロゴを全スライドの右上に表示 */
section:not(.title_slide)::before {
  content: "";
  position: absolute;
  top: 30px;
  right: 60px;
  width: 150px;
  height: 65px;
  background-image: url('../.images/logo_primary.png');
  background-size: contain;
  background-repeat: no-repeat;
}
```

### プロジェクトコマンドによる効率化

スライド生成、リサーチ、制約チェックなど、6つのカスタムコマンドを `.claude/commands/` 配下に用意。これにより、`/research-and-slides EPM市場について` のような単純なコマンドで、Webリサーチからスライド生成までを自動化できます。

![](https://storage.googleapis.com/zenn-user-upload/15dfc70afe79-20250619.png)

### Claude Code Actionによるモバイルでの作業

Claude Code Actionを設定することで、スマートフォンからもGitHub経由で `@claude` を呼び出し、スライド作成を進めることが可能です。

## Zenn記事からLTスライドへの展開

この仕組みを使えば、Zennで執筆した記事をClaude Codeに渡すだけで、即座に登壇用のスライドを生成できます。議事録やリリースノートなど、他のドキュメントからのスライド生成も可能です。

## 今後の展望：スライドレイアウトの完全自動再現

現在は、参考となるPDFスライドからレイアウトを抽出し、Marp用のテンプレート、テーマ、ガイドラインを自動生成するスクリプトをClaude Code SDKで開発中です。まだ品質は低いものの、将来的にはあらゆるスライドフォーマットを自動で再現することを目指しています。

![](https://storage.googleapis.com/zenn-user-upload/be0fde25880e-20250618.png)
*参考：Airbnbのワークフロー*

## まとめ

Claude Codeを活用することで、スライド作成の定型作業を大幅に自動化し、内容の検討に集中できる環境を構築しました。このシステムはまだ改善の余地がありますが、AIの進化と共に、今後さらに洗練されていくことが期待されます。

本記事の内容から生成したスライドの一部がこちらです。

![](https://storage.googleapis.com/zenn-user-upload/85273a7d48d8-20250619.png)
![](https://storage.googleapis.com/zenn-user-upload/fcf941617721-20250619.png)

## 参考リンク

- [Claude Code公式ドキュメント](https://docs.anthropic.com/claude-code)
- [Marp公式サイト](https://marp.app/)
