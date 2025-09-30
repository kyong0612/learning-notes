---
title: "Claude Codeが刷新した開発現場と、人間に残された仕事"
source: "https://tonkotsuboy.github.io/20250929-postdev/"
author:
  - "鹿野 壮 (@tonkotsuboy_com)"
published:
created: 2025-09-30
description: "コードの民主化、開発量爆増、Figma MCP協働革新など、Claude Codeが変えた開発現場の実態と、ガードレール設計・コンテキスト提供といった人間の新しい役割を解説します。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "コードの民主化"
  - "Figma MCP"
---

## Claude Codeが刷新した開発現場

### リリース数の爆増

- 2025年5月のClaude Code全社導入以降、チームのPRリリース数が約3倍に急増し、同時期に導入したDevinやCursorよりも顕著な効果を確認。
- 開発速度の向上が定量的に可視化され、組織内でAIエージェント活用の成果が即座に共有される体制を構築。
![PRリリース数の推移イメージ](https://tonkotsuboy.github.io/20250929-postdev/images/increase_pr.png)

### コード民主化と職能横断の実践

- 全社員がClaude CodeなどのAIエージェントにアクセスできる環境を整備し、非エンジニアでもコード作成が可能に。
- デザイナーによる画像生成ツール「Ubie Draw」、医師による医学論文自動レビュー／レポート生成ツールなど、現場課題に即した内製アプリが次々に誕生。
- フロントエンドエンジニアがdbtを活用したデータ分析を実施するなど、専門領域を越えた開発が日常化。
![Ubie Drawの画面イメージ](https://tonkotsuboy.github.io/20250929-postdev/images/ubie-draw.png)
![医師による論文レビュー支援ツールの画面](https://tonkotsuboy.github.io/20250929-postdev/images/med-paper.png)
![エンジニアがdbt環境で分析する様子](https://tonkotsuboy.github.io/20250929-postdev/images/dbt.png)

## 手数の増加を支えるClaude Codeの機能

### カスタムスラッシュコマンドによる定型作業の自動化

- `/compact`や`/clear`といった既定コマンドに加え、ユーザー任意で高度な処理を登録可能。
- `~/claude/commands/create-pr.md`に定義したコマンドで、`npm run format`、粒度調整済みコミット、PR作成までをワンショット自動化。

```text
## Description
このコマンドは以下の作業を自動で実行します：
1. `npm run format` でPrettierフォーマットを実行
2. 変更内容を適切な粒度でコミットに分割
3. GitHub PRを作成
```

- dbtモデル更新用コマンドのように引数を受け取り、事前に必要な設計ドキュメントを読み込ませて精度を確保する事例も紹介。
- コマンド実行デモ: [custom-slash.mp4](https://tonkotsuboy.github.io/20250929-postdev/demo/custom-slash.mp4)

### MCPによる外部ツール連携

- MCP (Model Context Protocol) でFigma、JIRA、Notion、Codex、Chrome DevToolsなどと接続し、Claude Codeから直接デザイン参照・チケット更新・社内知識検索を実現。
- Figma MCPでデザインファイルを読み込み、プロンプトと自社デザインシステムMCPを組み合わせてUIコードを出力。
![Figma MCPを使ったデザイン参照の画面](https://tonkotsuboy.github.io/20250929-postdev/images/mcp-figma-app.png)
![自社デザインシステム「ubie-ui」の例](https://tonkotsuboy.github.io/20250929-postdev/images/ubie-ui.png)
![MCP経由で生成されたUIコード例](https://tonkotsuboy.github.io/20250929-postdev/images/mcp-original.png)
- Codex CLIをMCPサーバーとして接続し、Claude Codeの操作性とCodexの知識ベースを組み合わせて課題解決力を向上。
![Codex MCP連携の画面例1](https://tonkotsuboy.github.io/20250929-postdev/images/codex_1.png)
![Codex MCP連携の画面例2](https://tonkotsuboy.github.io/20250929-postdev/images/codex_3.png)

### SubagentとPlan Modeで品質と計画性を補強

- 独立コンテキストを持つSubagentを活用し、React専門家などの公開Subagentにコードレビューを依頼して多面的なフィードバックを獲得。
![React専門Subagentによるレビュー例](https://tonkotsuboy.github.io/20250929-postdev/images/subagent-review.png)
![公開Subagentリポジトリのスクリーンショット](https://tonkotsuboy.github.io/20250929-postdev/images/subagent-list.png)
- Plan Modeを利用して実装前に全体計画を取得し、`Shift+Tab`でモードを切り替えながら手戻りを最小化。
- Plan Modeデモ: [plan-mode.mp4](https://tonkotsuboy.github.io/20250929-postdev/demo/plan-mode.mp4)

## 人間に残された仕事

### ガードレール設計とテスト拡充

- AIの開発速度が人間を凌駕する今、品質担保のためのガードレール整備が人間の主要業務であると強調。
- ユニット／E2E／ビジュアルリグレッションテストを組み合わせ、バグ発生を未然に防止。
- StorybookのInteraction Testを用い、UI上で不整合を即座に検知し、CIに組み込んで自動チェック。

```ts
export const Default: Story = {
  name: 'LPトップページ',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(/ユビーオンライン診療/);
    const breadcrumbList = canvasElement.querySelector('ol[typeof="BreadcrumbList"]');
    await expect(within(breadcrumbList).getByRole('link', { name: 'トップ' })).toBeVisible();
  },
};
```

![Storybookテスト失敗時の画面](https://tonkotsuboy.github.io/20250929-postdev/images/storybook-fail.png)
![Storybookテスト成功時の画面](https://tonkotsuboy.github.io/20250929-postdev/images/storybook-pass.png)
![CIでのStorybookテスト結果](https://tonkotsuboy.github.io/20250929-postdev/images/storybook-ci.png)

### レビュー体制とプレビュー環境の強化

- CodeRabbitやClaude Code GitHub Actions、GitHub Copilotを組み合わせ、AIレビュー→人間レビューの多層チェックを確立。
![CodeRabbitによるレビューコメント例](https://tonkotsuboy.github.io/20250929-postdev/images/code-rabbit.png)
![CodeRabbitレビューへの対応画面](https://tonkotsuboy.github.io/20250929-postdev/images/code-rabbit-review.png)
- PRごとのプレビュー環境を自動生成し、UI変化を視覚的に確認できる体制を整備。
![PRごとのプレビュー環境の例](https://tonkotsuboy.github.io/20250929-postdev/images/preview-ci.png)

### ドメイン知識とコンテキスト提供

- JIRA MCPで課題背景を共有し、Notion MCPで社内ナレッジを引き出すなど、AIにプロジェクト固有のコンテキストを注入。
- 社内AIのSEOアドバイザーを構築し、Notionと外部リソースを連携させてUbie特有のSEO戦略に沿った改善提案を実現。
![SEOアドバイザーの監査画面1](https://tonkotsuboy.github.io/20250929-postdev/images/seo_1.png)
![SEOアドバイザーの監査画面2](https://tonkotsuboy.github.io/20250929-postdev/images/seo_2.png)
![SEOアドバイザーの監査画面3](https://tonkotsuboy.github.io/20250929-postdev/images/seo_3.png)
![SEOアドバイザーの監査画面4](https://tonkotsuboy.github.io/20250929-postdev/images/seo_4.png)

## まとめと重要ポイント

- Claude Codeの導入で開発速度と開発量が飛躍的に向上し、職能横断の開発文化と自律的な問題解決が定着。
- 人間はガードレールとコンテキスト提供、品質チェック、成果物の微調整に注力し、AIの爆速開発を支える役割を担う必要がある。
- MCP・Subagent・Plan Modeなどの周辺機能を組み合わせることで、AIエージェントの手数と品質を両立させる実践例が提示された。
- 制限・留意点として、AIツールだけでは品質やドメイン適合性が保証されず、人間によるテスト設計や知識提供が欠かせないことを明示。
![Ubie採用ページの案内バナー](https://tonkotsuboy.github.io/20250929-postdev/images/ubie.png)
