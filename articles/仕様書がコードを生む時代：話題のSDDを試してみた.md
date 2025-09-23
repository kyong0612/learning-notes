---
title: "仕様書がコードを生む時代：話題のSDDを試してみた"
source: "https://tech.algomatic.jp/entry/2025/09/22/143931"
author:
  - "ootsuka_techs"
published: 2025-09-22
created: 2025-09-23
description: |
  仕様駆動開発（SDD）の概念を解説し、Kiro、Spec Kit、spec-workflow-mcp、cc-sddの4つの主要ツールを比較・検証します。各ツールの特徴、ワークフロー、長所と短所を詳述し、それぞれの最適な適用シーンを考察します。
tags:
  - "AI駆動開発"
  - "エンジニア"
  - "仕様駆動開発"
  - "AIコーディング"
  - "コーディングエージェント"
---

![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250922/20250922144819.png)

本記事では、いま話題の仕様駆動開発（Spec Driven Development; SDD）を調査し、社内で試した学びをまとめています。SDDは、「仕様（specification）」を中心に据え、設計・実装・テスト・ドキュメントすべてを仕様から逆算して進める開発スタイルです。

今回は、このSDDを実践するための以下の4つのツールを比較検証しています。

* [Kiro](https://kiro.dev/)
* [Spec Kit](https://github.com/github/spec-kit)
* [spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp)
* [cc-sdd](https://github.com/gotalab/cc-sdd)

## 各ツールの比較

### 機能比較表

| 機能 | [Kiro](https://kiro.dev/) | [Spec Kit](https://github.com/github/spec-kit) | [spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp) | [cc-sdd](https://github.com/gotalab/cc-sdd) |
| :--- | :--- | :--- | :--- | :--- |
| 日本語対応 | △ | △ | ○ | ◎ |
| 承認フロー | ○ | ○ | ◎ | ○ |
| プロジェクトガバナンス | ○ | ◎ | ○ | ○ |
| IDE統合 | ○（専用IDE） | ○ | ○ | ○ |
| オープンソース | × | ○ | ○ | ◎ |
| エンタープライズ対応 | ◎ | ○ | ○ | ○ |
| 学習コスト | △ | ◎ | ○ | ◎ |
| カスタマイズ性 | △ | ○ | ○ | ◎ |

### 適用シーン比較表

| 適用シーン | [Kiro](https://kiro.dev/) | [Spec Kit](https://github.com/github/spec-kit) | [spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp) | [cc-sdd](https://github.com/gotalab/cc-sdd) |
| :--- | :--- | :--- | :--- | :--- |
| 大規模エンタープライズ開発 | ◎ | △ | ○ | ○ |
| 小規模チーム・スタートアップ | △ | ◎ | ○ | ◎ |
| AWS環境での開発 | ◎ | ○ | ○ | ○ |
| 厳格な品質管理 | ◎ | ○ | ◎ | ○ |
| 承認プロセス重視 | ○ | ○ | ◎ | ○ |
| 素早いプロトタイピング | △ | ◎ | ○ | ○ |
| 日本語での開発 | △ | △ | ○ | ◎ |
| GitHub中心のフロー | ○ | ◎ | ○ | ○ |
| 既存環境との統合 | △ | ○ | ○ | ◎ |
| オープンソース重視 | × | ○ | ○ | ◎ |
| カスタマイズ性 | △ | ○ | ○ | ◎ |
| 複数ステークホルダー | ○ | △ | ◎ | ○ |

## 各ツールの詳細

### 1. AWS Kiro - エンタープライズ向けの本格的なSDD環境

* **概要**: Amazonが提供するAI統合開発環境（IDE）。「Vibe Coding」の手軽さとSDDの厳格さを両立させ、大規模開発でも整合性を保つことを目指しています。
* **ワークフロー**: `requirements.md`（要求定義） → `design.md`（設計） → `tasks.md`（タスク化）の3ステップで開発を進めます。
* **特徴**:
  * **Agent Hooks**: ファイル保存などのイベントをトリガーに、テスト実行やドキュメント更新などを自動化。
  * **Agent Steering**: プロジェクト全体の方針（規約、技術スタック等）をAIに指示し、生成されるコードの一貫性を保ちます。
* **課題**: プレビュー版のため動作が遅い、プライバシー懸念、日本語対応が不十分、AWS環境への依存度が高いなどの点が挙げられます。

### 2. GitHub Spec Kit - シンプルで直感的なSDDツール

* **概要**: GitHubが提供するシンプルで直感的なツール。「仕様そのものが動き、コードを生み出す」というコンセプトです。
* **ワークフロー**:
    1. `specify init`: プロジェクトを初期化。
    2. `/specify`: 自然言語で「どんなアプリを作りたいか」を記述。
    3. `/plan`: 技術的な計画（使用技術など）を立てる。
    4. `/tasks`: 仕様を具体的なタスクに分解。
* **特徴**:
  * `/constitution`: プロジェクトの根本的なルールやガイドラインを文書化し、バージョン管理する機能が強力。
* **所感**: スタートアップや小規模チームでの利用に適しており、素早いプロトタイピングと仕様の可視化を両立できます。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250919/20250919164751.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920212148.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920212322.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920212602.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920212942.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920204831.png)

### 3. spec-workflow-mcp - 堅牢な承認フローを持つSDDフレームワーク

* **概要**: Model Context Protocol（MCP）を活用し、各フェーズで明確な承認プロセスが組み込まれているのが特徴です。
* **ワークフロー**: `requirements.md` → `design.md` → `tasks.md` と進む各段階で、ブラウザのダッシュボード上で承認が必要です。
* **特徴**:
  * **ダッシュボードによる可視化**: 「要件 → 設計 → 実装」の流れと進捗が視覚的に管理できます。
* **課題**: IDEとブラウザの行き来が必要、文書量が増えると管理が煩雑になる可能性、MCPサーバーのセットアップに技術的知識が求められる点が挙げられます。
* **所感**: 「確実性」と「透明性」が高く、ミッションクリティカルなシステムの開発で価値を発揮します。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920224549.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920224927.png)

### 4. cc-sdd - 日本発のオープンソースSDDツール

* **概要**: 日本人エンジニアが開発したオープンソースツール。Kiroに近い思想を持ち、日本の開発現場の実情に合わせた設計が特徴です。
* **特徴**:
  * **日本語対応**: 自然な日本語での仕様記述が可能。
  * **簡単な導入**: 既存の開発環境（Cursor, VS Code等）にスムーズに統合できます。
  * **Project Memory**: プロジェクト固有の文脈やコーディング規約をAIに記憶させる機能。
  * **多言語対応**: 自動翻訳機能も搭載。
* **所感**: Kiroのような体験をオープンソースで再現しつつ、日本語環境に対応した「国産SDD実装」です。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920225738.png)
![](https://cdn-ak.f.st-hatena.com/images/fotolife/o/ootsuka_techs/20250920/20250920225346.png)

## まとめ - SDDがもたらす開発の未来

SDDは、仕様を中心に開発を進めることで、多くの価値をもたらします。

**価値**:

1. **コミュニケーションコストの削減**: 明文化された仕様により、認識の齟齬が減少。
2. **品質の早期確保**: 手戻りが減少し、建設的なレビューが可能に。
3. **ドキュメントの自動生成と保守**: 「コードとドキュメントの乖離」問題を解決。
4. **AIとの効果的な協業**: 明確な指針により、AIが生成するコードの品質と一貫性が向上。

**課題**:

* **ツールの成熟度**: 多くのツールはまだ開発初期段階。
* **組織文化の変革**: 「まず仕様を固める」文化の醸成が必要。
* **AIへの過度な依存**: 開発者のスキル低下の懸念。

結論として、SDDはソフトウェア開発の本質的な課題に対する一つの解答であり、「何を作るか」を明確にしてから「どう作るか」を考えるプロセスを、最新のAI技術で実現するものです。
