---
title: "GitHub Copilot Chat for VS Code goes open source with MIT license and native integration"
source: "https://alternativeto.net/news/2025/5/github-copilot-chat-for-vs-code-goes-open-source-with-mit-license-and-native-integration/"
author:
  - "The VS Code team"
published: 2025-05-19
created: 2025-05-21
description: |
  Microsoftは、GitHub Copilot Chat for VS CodeのコードをMITライセンスでオープンソース化し、関連コンポーネントをVS Codeコアにリファクタリングする計画を発表しました。これは、AIを活用したツールが開発者体験の中核を成すという同社の信念と、オープンなコラボレーションがより良い製品と多様なエコシステムを育むという考えを反映したものです。
tags:
  - "GitHub Copilot"
  - "VS Code"
  - "Open Source"
  - "AI"
  - "Microsoft"
---

Microsoftは、Visual Studio Code（VS Code）向けのGitHub Copilot ChatエクステンションのコードをMITライセンスの下でオープンソース化し、その関連コンポーネントをVS Codeのコア機能に統合していく計画を発表しました。この発表は、BUILD 2025の基調講演で行われました。

この動きは、AIパワードツールが開発者体験の中核であり、オープンな協力体制がより良い製品と多様な拡張機能エコシステムを育むというVS Codeチームの信念を反映したものです。

### オープンソース化の背景

VS Codeチームは、AI開発における最近の動向を踏まえ、VS Code内のAI開発をクローズドソースからオープンソースへ移行する決断を下しました。主な理由は以下の通りです。

* **大規模言語モデルの進化**: 近年、大規模言語モデルが大幅に改善され、独自のプロンプト戦略（いわゆる「秘伝のタレ」）の必要性が薄れました。
* **UXの標準化**: AIインタラクションにおける効果的なユーザーエクスペリエンス（UX）の多くは、現在多くのエディタで共通のものとなっています。VS Codeチームは、これらの共通UI要素を安定したオープンなコードベースで提供することで、コミュニティによる改良や拡張を可能にしたいと考えています。
* **エコシステムの支援**: オープンソースのAIツールやVS Codeエクステンションのエコシステムが台頭しています。Copilot Chatエクステンションのソースコードを公開することで、これらのエクステンション開発者が自身のツールをより容易に構築、デバッグ、テストできるようになります。
* **透明性の向上**: AIエディタが収集するデータに関して多くの質問が寄せられています。Copilot Chatエクステンションをオープンソース化することで、収集されるデータを確認できるようになり、透明性が向上します。
* **セキュリティの強化**: AI開発ツールを標的とする悪意のある攻撃者が増加しています。VS Codeがオープンソースプロジェクトとして歩んできた歴史の中で、コミュニティからのIssue報告やプルリクエストは、セキュリティ問題の迅速な発見と修正に貢献してきました。

### 今後のステップ

今後数週間以内に、GitHub Copilot Chatエクステンションのコードがオープンソース化され、AI機能がエクステンションからVS Codeコアへとリファクタリングされる予定です。VS Codeチームは、パフォーマンス、強力な拡張性、直感的で美しいユーザーインターフェースの提供という中核的な優先事項は維持するとしています。

さらに、大規模言語モデルの確率的な性質により特に困難となるAI機能やプロンプト変更のテストを容易にするため、プロンプトテストインフラストラクチャもオープンソース化する計画です。

この取り組みに関する詳細は、イテレーションプランやFAQで随時更新される予定です。

VS Codeチームは、「オープンソースのAIエディタとして開発の未来を形作ることに興奮しており、このオープンな構築の旅に皆さんが参加してくれることを願っています」と述べています。

#### 関連情報 (元記事より)

元記事 ([AlternativeTo](https://alternativeto.net/news/2025/5/github-copilot-chat-for-vs-code-goes-open-source-with-mit-license-and-native-integration/)) によると、この変更により、開発者はCopilotの仕組みや収集データについて透明性を得られるようになり、コミュニティによる脆弱性の特定と修正が迅速化されるとされています。また、Microsoftは、GitHub CopilotがWindows、Mac、Linux上のVS Code内で利用可能になり、GitHubアカウント経由でログインするだけでよいことを確認したと報じています。この動きは、CursorやWindsurf Editorのようなクローズドツールに競争圧力をかけるものと見られています。

Microsoftはまた、AIモデルの閲覧、プロンプト管理、チームコラボレーションのために設計されたGitHubエコシステム内の中央プラットフォームであるGitHub Modelsも発表しました。

#### 外部リンク

* [VS Code: Open Source AI Editor](https://code.visualstudio.com/blogs/2025/05/19/openSourceAIEditor) (VS Code公式ブログ)
* [Microsoft open sources GitHub Copilot in Visual Studio Code](https://www.neowin.net/news/microsoft-open-sources-github-copilot-in-visual-studio-code/) (Neowin)
* [GitHub - microsoft/vscode-copilot-release](https://github.com/microsoft/vscode-copilot-release) (GitHub Copilot Chat UXに関するフィードバック用リポジトリ)
