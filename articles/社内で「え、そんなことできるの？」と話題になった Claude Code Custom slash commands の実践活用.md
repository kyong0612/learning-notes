---
title: "社内で「え、そんなことできるの？」と話題になった Claude Code Custom slash commands の実践活用"
source: "https://zenn.dev/hacobu/articles/d4a194b95aacd5"
author:
  - "cho"
published: 2025-07-28
created: 2025-07-31
description: |
  Hacobuのエンジニアが、社内で大きな反響があったClaude CodeのCustom slash commandsの実践的な活用法を紹介。セキュリティ対策、PR作成、UIデザイン提案などを自動化する具体的なコマンドと、それによる開発効率の劇的な向上について解説しています。
tags:
  - "Claude Code"
  - "Agentic Coding"
  - "Custom slash commands"
  - "開発効率化"
  - "Zenn"
---

### 要約

Hacobuのフロントエンドエンジニアであるcho氏が、社内の勉強会で共有し大きな反響を呼んだ「Custom slash commands」の実践的な活用方法を解説する記事。AIエージェントと対話しながら開発を進める「Agentic Coding」を、具体的なカスタムコマンドによっていかに効率化できるかを示している。特に「セキュリティ対策の自動化」「Mermaid図を含むプルリクエストの自動作成」「UIデザインパターンの提案とASCIIワイヤーフレーム生成」の3つのコマンドが、開発現場の課題を解決し、作業時間を大幅に短縮した事例として詳しく紹介されている。この記事は、AIコーディングツールの基本的な使い方から一歩進んで、実務で本当に役立つ応用例を知りたい開発者にとって非常に価値のある内容となっている。

### ハイライト

- **/dependabot-check**: 手動で10〜15分かかっていたDependabotの脆弱性調査を、コマンド一発で**3〜5分**に短縮。
- **/pr**: 差分分析からPR説明文、さらには変更内容を視覚化する**Mermaid図**までを**1〜2分**で自動生成。
- **/ui-advice**: UIのスクリーンショットから複数の改善案と**ASCIIワイヤーフレーム**を**約1分**で提案。
- **チームへの展開**: 作成したコマンドは社内リポジトリで共有され、チーム全体の生産性向上に貢献している。

---

[Hacobuテックブログ](https://zenn.dev/p/hacobu)

279

157[tech](https://zenn.dev/tech-or-idea)

## はじめに

こんにちは！株式会社 Hacobu で Vista というプロダクトのフロントエンドエンジニアをしている cho です。

最近、社内で「Agentic Coding を眺める会」というイベントを開催しました。普段どんな感じで Claude Code を使って開発しているかを同僚に共有したところ、想像以上に反響があったんです。

特に、 **Custom slash commands** の部分で会議室がざわついて…

> 「え、そんなことできるの？」  
> 「これめっちゃ便利そう！」  
> 「自分でも作ってみたい！」

という声がたくさん上がりました 😊

イベント後、参加者から「これ、もっと詳しく知りたい！」「他のチームにも共有したい」という要望が続々と…

そこで、 **実際に業務で使える Custom slash commands** をより多くの開発者に知ってもらいたいと思い、この記事を書くことにしました。

**実際に社内で反響があった内容**

- セキュリティ対策の自動化：複数ファイル確認 → 依存関係調査 → 修正手順検討の一連作業をコマンド一発で完了
- Mermaid による図の自動生成：「こんなのも作れるの？」という驚きの声
- UI 改善案の ASCII wireframe 自動生成：PdM & デザイナーとの議論で使える複数のレイアウト案を瞬時に作成

同じような課題を抱えているチームの参考になれば嬉しいです 🙌

## なぜ Custom slash commands なのか？

最近、Claude Code や Cursor の基本的な使い方を紹介する記事はたくさん見かけるようになりました。でも、 **実務で本当に使える具体的な commands** って意外と紹介されていないんですよね…

そこで今回は、私が実際に業務で使っている Custom slash commands（以下、slash commands）を中心に、 **Agentic Coding** の実践方法をご紹介します。

なお、slash commands の基本的な作成方法については [Claude Code 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/slash-commands#custom-slash-commands) をご参照ください。この記事では実際の業務での活用例に焦点を当てています。

### Agentic Coding とは？

改めて整理すると、 **Agentic Coding** とは

> AI エージェントが開発者の指示に基づき、計画立案・コード生成・テスト・修正までの一連のコーディング操作を自立的に実行するプログラミング手法

簡単に言えば、 **AI とやり取りしながらコーディングをする** ということです。

昔は自分の頭で考えて、一つ一つコマンドを叩いて実行していた作業を、slash commands で自動化できるようになったんです。これがめちゃくちゃ便利で… 🔥

## 実際に使っている commands

私が普段から愛用している command は 6〜7 個ほど。今回はその中でも、特に社内での **反応が良かった 3 つ** を厳選してご紹介します！

### 1\. /dependabot-check - セキュリティ対策の自動化

セキュリティ対策として、Dependabot のセキュリティアラートを定期的にチェックしています。

**従来の手順**

1. プロジェクトディレクトリに移動
2. `package.json` を確認
3. `pnpm-lock.yaml` を参照
4. 依存関係ツリーを調査
5. 修正方法を検討

**今は**

```bash
/dependabot-check https://github.com/org/repo/security/dependabot/123
```

### 実際のコード全体

私が実際に使っている dependabot-check コマンドの全体コードです。

なお、コマンド内容を英語で記述しているのは、Claude Code が英語での指示に対してより正確で詳細な処理を実行してくれるから＋トークン効率も良いからです。

.claude/commands/dependabot-check.md

```markdown
Query Dependabot Information:
```

### 実際の実行結果

実際にコマンドを実行すると、以下のような分析結果が生成されます。

![Github - Dependabot alertの詳細画面](https://storage.googleapis.com/zenn-user-upload/f4ce3899fe23-20250725.png)  
*Github - Dependabot alertの詳細画面*

![コマンドで実際のセキュリティアラートを分析してもらった結果](https://storage.googleapis.com/zenn-user-upload/13294cf27228-20250725.png)  
*`/dependabot-check` コマンドで実際のセキュリティアラートを分析してもらった結果*

このコマンドが、従来は手動で行っていた一連の調査・分析作業を全て自動で実行してくれます。

特に **セキュリティ対策の自動化** は、手動でやると「プロジェクトディレクトリ移動 → package.json 確認 → pnpm-lock.yaml 参照 → 依存関係ツリー調査 → 修正手順検討 → 実行」と一連の手順を踏む必要があった作業が、コマンド一発で完了するので、参加者からの反応もすごく良かったです 😊

この分析レポートで原因は一目瞭然！あとはサクッとコードを修正して、おなじみの `/pr` コマンドでプルリクエストを作成するだけです。この連携がまた気持ちいいんですよね…！

### 2\. /pr - プルリクエストの自動作成

プルリクエストの作成も自動化しています。

**オプション付きで柔軟に対応**

- 通常実行：PR description 作成のみ
- `-p` オプション：push + PR description 作成
- `-u` オプション：既存 PR の description 更新

```bash
/pr -p  # push してから PR description 作成
```

### 実際のコード全体

.claude/commands/pr.md

```markdown
\`git status\`
```

この Mermaid で図を生成するというアイデアは、2 週間前に Devin を久しぶりに使った時に、Devin が自動で diagram を追加してくれるのを見て「あ、これ Claude Code でも真似できそう！」と思って実装したんです。一目で修正内容が分かるので、レビュワーにも好評です 👍

### 実際の生成結果

先ほどの `/dependabot-check` で見つけた脆弱性を修正した後、早速 `/pr` コマンドを叩いてみます。すると…

じゃーん！こんな感じのプルリクエストが自動で立ち上がります。

![ コマンドで自動生成された修正 PR](https://storage.googleapis.com/zenn-user-upload/8737e2491fc7-20250725.png)  
*`/pr` コマンドで自動生成された修正 PR*

そして注目してほしいのが、この PR 説明欄に自動で埋め込まれた Mermaid 図です。これがあるだけで、変更内容が一発で理解できるので、レビュワーからも「めっちゃ分かりやすい！」と大好評です。

![実際の PR に自動生成された Mermaid 図](https://storage.googleapis.com/zenn-user-upload/4eef8cb58add-20250725.png)  
*実際の PR に自動生成された Mermaid 図*

`/pr` コマンドは単に Mermaid 図を作るだけでなく

- git diff を分析して変更点を理解
- `.github/pull_request_template.md` に合わせた形式で記述
- 一貫性のある PR 説明文を自動生成
- 技術的な変更内容を分かりやすく要約

このおかげで、どのメンバーが作っても PR の品質が統一されるようになりました。

**特に Mermaid 図の自動生成** は、「こんなのも作れるの？」という驚きの声をたくさんいただきました 😊

### 3\. /ui-advice - UI デザインパターンの提案

プロトタイプ開発でよく使う command です。

**使い方**

```bash
/ui-advice [画像URL or 画像アップロード]
```

### 実際のコード全体

.claude/commands/ui-advice.md

```markdown
Design Pattern Suggestions
```

### 実際の生成結果

例として、Anthropic の公式ページのレイアウトを分析してもらいました。

![分析対象の Anthropic 公式ページ](https://storage.googleapis.com/zenn-user-upload/82613c04e460-20250725.png)  
*分析対象の Anthropic 公式ページ*

実際にコマンドを実行すると、以下のような詳細な分析結果が生成されます

![コマンドで実際の UI 提案コマンドの実行結果](https://storage.googleapis.com/zenn-user-upload/492c05610e13-20250725.png)  
*`/ui` コマンドで実際の UI 提案コマンドの実行結果*

### 実際の効果

**プロトタイプ開発での活用可能性**

このような詳細な分析結果を見ると、新規事業やプロトタイプ開発で大きく役立ちそうです

- **スピード重視の場面**: 「既存ページをもう少しモダンに」という要望に 1~2 分で複数案を提示
- **技術的実現性**: Context7 MCP を経由して、プロダクトで採用中の UI ライブラリに適した実装可能なコンポーネントを提案
- **コミュニケーション改善**: 抽象的なデザイン議論から「この 3 つのうちどれ？」という具体的選択に変換

**特に ASCII wireframe の自動生成** は、社内で「え、これも AI で作れるの？」という驚きの反応が多く、プロトタイプ開発の効率化への関心が高まりました。

## 実務での効果

### 作業時間の短縮

「で、実際どれくらい早くなったの？」って気になりますよね 🤔  
正直、自分でも驚くほど効果がありました。手作業でやっていた頃と比べると、こんな感じです。

- **セキュリティ対策**
  - **Before**: 手動での調査・分析に **10〜15 分** かかっていたのが…
  - **After**: `/dependabot-check` 実行で **約 3~5 分** に短縮！
- **PR 作成**
  - **Before**: 差分確認から説明文を丁寧に書こうとすると、大体 **10 分** くらい。正直、Mermaid 図は手間がかかりすぎるので作っていませんでした…
  - **After**: なんと Mermaid 図を **自動生成** しながら、 **約 1〜2 分** で完了！
- **UI プロトタイプ作成**
  - **Before**: デザインパターン調査やワイヤーフレーム作成に **30 分以上** …
  - **After**: `/ui-advice` で複数案を **約 1 分** でゲット！

特に、 `/dependabot-check` のように少し時間のかかる処理には [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks-guide) で通知を設定しているので、コマンド実行後は他の作業に集中できます。完了したら音が鳴って知らせてくれるので、待ち時間も有効活用できるのが最高なんです 🎵

### 品質の向上

- **統一された PR フォーマット** （Mermaid 図付き）
- **体系的なセキュリティ対策** （見落とし防止）
- **デザインパターンベースの UI 設計**

### チーム全体への波及効果

社内でコマンドを共有するリポジトリ「coding-agent-toolkit」も作成しました。

みんなで便利なコマンドを共有することで、チーム全体の生産性が向上しています。

## まとめ

**Custom slash commands** を使うことで、Agentic Coding がより実践的になります。

### 分かったこと

- **繰り返し作業の自動化** は想像以上に効果的だった
- **コマンドの共有** でチーム全体の生産性が向上する
- **実際に使える commands** の価値は想像以上に高かった

### 今後の展開

- 新しい AI ツールが出ても、既存のコマンドを活用できる
- チームメンバーの便利コマンドを共有する文化
- より複雑なワークフローの自動化

### おわりに

私が「Agentic Coding を眺める会」で共有した内容が、同じような課題を抱えている開発者の方々の参考になれば嬉しいです！

slash command を作る際は、まずは小さなものから始めて、徐々に高度なものに挑戦していくのがおすすめです 🚀

皆さんもぜひ、自分だけの実務に役立つ slash command を作ってみませんか？

## 参考リンク

- [Claude Code Custom Slash Commands - 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/slash-commands#custom-slash-commands)
- [Claude Code Hooks - 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)

279

157
