---
title: "Design with AI"
source: "https://stitch.withgoogle.com/"
author:
  - "[[Google Labs]]"
  - "[[Rustin Banks]]"
  - "[[Vincent Nallatamby]]"
  - "[[Arnaud Benard]]"
  - "[[Sam El-Husseini]]"
published: 2025-05-20
created: 2026-03-20
description: "Stitch は Google Labs が開発した AI ネイティブ UI デザインツール。自然言語プロンプト、スケッチ、画像から高品質なモバイル・Web アプリ UI を数秒で生成し、Figma 連携やフロントエンドコード（HTML/CSS/React/Tailwind）のエクスポートが可能。2026年3月には Gemini 3 統合や「vibe design」キャンバス、デザインエージェント、DESIGN.md によるデザインシステム、インタラクティブプロトタイプなど大幅アップデートが行われた。"
tags:
  - "clippings"
  - "AI"
  - "UI-design"
  - "design-tools"
  - "Google-Labs"
  - "Gemini"
  - "frontend-development"
  - "prototyping"
  - "Figma"
---

## 概要

**Stitch** は Google Labs が提供する AI パワード UI デザインツール。自然言語のプロンプト、手描きスケッチ、スクリーンショットなどを入力として、完全な UI レイアウトとフロントエンドコードを数秒で生成する。2025年5月の Google I/O で初公開され、2026年3月に「vibe design」コンセプトと共に大幅アップデートされた。

---

## 主要機能

### 入力方法
- **テキストプロンプト**: アプリの UI を自然言語で記述（カラーパレット、UX要件、対象ユーザーなど）
- **画像・ワイヤーフレーム入力**: ホワイトボードのスケッチ、UIスクリーンショット、ラフなワイヤーフレームをアップロード
- **コード入力**: コードを直接キャンバスに持ち込みコンテキストとして利用可能

### 出力・エクスポート
- 複数のデザインバリエーションを同時生成
- **コードエクスポート**: HTML/CSS、React、Vue、Tailwind CSS、JSX
- **Figma 連携**: ワンクリックで編集可能なレイヤー・オートレイアウト付きで Figma にペースト
- AI Studio や Antigravity などの開発者ツールへのエクスポート

### AIモデル

| モード | AI モデル | 月間生成回数 | 用途 |
|---|---|---|---|
| Standard | Gemini 2.5 Flash | 350回 | 素早いイテレーション、初期コンセプト |
| Experimental | Gemini 2.5 Pro | 50回 | 高品質なデザイン、最終出力 |

> **2026年3月更新**: Gemini 3 が統合され、レイアウト品質・スペーシングの一貫性・全体的なデザイン構造が向上。手動デザインと比較して **プロトタイピングサイクル40%短縮、修正ラウンド60%削減** が報告されている。

---

## 2026年3月の大型アップデート: 「Vibe Design」

### AI ネイティブ デザインキャンバス
ワイヤーフレームから始めるのではなく、**ビジネス目標やユーザーの感情**から設計を開始する新しいアプローチ。無限キャンバス上でアイデアを画像・テキスト・コードの形で自由に配置し、初期アイデアから実働プロトタイプまで育てることができる。

### デザインエージェント
プロジェクト全体の進化を推論できる AI エージェント。**Agent Manager** により複数のアイデアを並行して探索しつつ、整理された状態を維持する。

### DESIGN.md によるデザインシステム
- 任意の URL からデザインシステムを抽出可能
- **DESIGN.md**（エージェントフレンドリーな Markdown ファイル）でデザインルールをインポート/エクスポート
- 他の Stitch プロジェクトやコーディングツールとデザインルールを共有

### インタラクティブプロトタイプ
- 静的デザインを即座にインタラクティブプロトタイプに変換
- 画面を「Stitch（縫い合わせ）」して「Play」をクリックすればアプリフローをプレビュー
- クリック先に基づいて **論理的な次の画面を自動生成**

### ボイス機能
- キャンバスに音声で直接指示
- リアルタイムのデザイン批評、インタビュー形式でのデザイン生成
- 「メニューオプションを3つ見せて」「別のカラーパレットで表示して」などの即時更新

### MCP サーバー・SDK・Skills
- [Stitch MCP サーバー](https://stitch.withgoogle.com/docs/mcp/setup/) と [SDK](https://github.com/google-labs-code/stitch-sdk) を公開
- [Skills](https://github.com/google-labs-code/stitch-skills)（2.4k stars）による機能拡張
- 外部ツールとのシームレスな統合

---

## Stitch vs 他のデザインツール

### Stitch vs Figma

| 機能 | Stitch | Figma |
|---|---|---|
| 主な機能 | プロンプトからAI生成UI | コンポーネントベースの手動デザイン |
| 学習曲線 | 最小（自然言語） | 中〜高 |
| デザインコントロール | 制限あり（AI駆動） | 完全（ピクセルパーフェクト） |
| コラボレーション | 基本（Figmaへエクスポート） | 高度（リアルタイム、コメント） |
| コードエクスポート | HTML/CSS/React/Tailwind 内蔵 | プラグインまたは Dev Mode 必要 |
| プロトタイピング | インタラクティブ（2026年〜） | インタラクティブ |
| 価格 | 無料（制限あり） | Free tier + 有料プラン |
| 最適用途 | 高速アイデア出し、MVP | 本番デザイン、デザインシステム |

### Stitch vs Zeplin vs UXPin

| 機能 | Stitch | Zeplin | UXPin |
|---|---|---|---|
| 主な目的 | プロンプト→デザイン＋コード | デザイン→開発ハンドオフ | UI/UX設計＋ロジック付きプロトタイプ |
| コード生成 | HTML/CSS/React エクスポート可 | CSSスニペットのみ | HTML/CSS/JS（ロジック付き） |
| AI アシスタンス | あり | なし | なし |
| Figma 連携 | ワンクリックペースト | プラグイン対応 | なし |
| 初心者向け | 非常に高い | 中程度 | 低い |

---

## ユースケース別の推奨ユーザー

| ユーザー | 推奨ツール | 理由 |
|---|---|---|
| 非デザイナー / 創業者 | Stitch | アイデアを説明するだけで動くUIとコードが手に入る |
| UX/UIデザイナー | Figma | 業界標準のデザイン・プロトタイピング・コラボレーション |
| フロントエンド開発者 | Zeplin or Stitch | 詳細仕様(Zeplin)またはコード自動生成(Stitch) |
| プロダクトマネージャー | Stitch or Figma | アイデアの高速検証(Stitch)またはUI方向性のコラボ(Figma) |
| デザイン初学者 | Stitch | デザインツールの学習曲線なしにUI構造を学べる |
| 上級UX実践者 | UXPin | ロジック付きプロトタイプ、ユーザーテスト、条件分岐 |

---

## ハイブリッドワークフロー（推奨）

1. **Stitch** で初期コンセプトを高速生成
2. **Figma** にエクスポートして洗練・ブランド調整・本番品質に仕上げ
3. AI のスピードと人間のデザイン専門性を組み合わせる

---

## 長所

- 無料で利用可能（ソロビルダーやスタートアップにアクセスしやすい）
- MVP、プロトタイプ、高速イテレーションに最適
- デザインとコードの同期によりデザイン→開発ハンドオフを効率化
- デフォルトでモバイル・デスクトップ両対応のレスポンシブデザイン
- テーマ、フォント、スペーシング、カラーの即時カスタマイズ
- MCP サーバー・SDK・Skills による拡張性

## 短所・制限事項

- まだ実験段階（機能が変更される可能性あり）
- 生成回数の制限がヘビーユーザーには制約となり得る
- ビジュアル階層やニュアンスの制御が限定的
- ブランドガイドラインやトークンの自動適用は不完全
- アニメーションや高度なインタラクションは未サポート
- プロンプトの明確さに出力品質が大きく依存
- 熟練デザイナーの創造的判断力を完全に代替することはできない

---

## 重要な結論

- **Stitch はアクセラレーターであり、代替ではない**。AI のスピードで初期デザインを加速しつつ、最終的な品質は人間のデザイン専門性に依存する
- Gemini 3 統合により品質が大幅向上し、プロトタイピング機能の追加でワークフロー全体をカバー
- **DESIGN.md** と **MCP サーバー** により、他ツールとのエコシステム統合が進展
- 価格は現時点で完全無料だが、Google Workspace サブスクリプションやエンタープライズプランなど将来的な課金モデルの可能性あり

---

## 参考リンク

- [Stitch 公式サイト](https://stitch.withgoogle.com/)
- [Stitch ドキュメント](https://stitch.withgoogle.com/docs)
- [Google Blog: Introducing "vibe design" with Stitch](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/)
- [Google Developers Blog: From idea to app](https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis)
- [Stitch MCP Server](https://stitch.withgoogle.com/docs/mcp/setup/)
- [Stitch SDK (GitHub)](https://github.com/google-labs-code/stitch-sdk)
- [Stitch Skills (GitHub)](https://github.com/google-labs-code/stitch-skills)
