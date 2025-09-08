---
title: "仕様駆動開発を支える Spec Kit を試してみた"
source: "https://azukiazusa.dev/blog/spec-driven-development-with-spec-kit/"
author:
  - "azukiazusa"
published: 2025-09-07
created: 2025-09-08
description: |
  仕様駆動開発（Specification-Driven Development, SDD）は、AI コーディングエージェントを活用した新しいソフトウェア開発スタイルです。GitHub が提供する Spec Kit は、仕様駆動開発を支援するためのツールキットであり、AI との対話を通じて正確な受け入れ基準の定義とコード生成を支援します。この記事では Spec Kit を使用して仕様駆動開発を試してみます。
tags:
  - "AI"
  - "仕様駆動開発"
  - "claude-code"
  - "SpecKit"
---

![サーモンとイクラ丼のイラスト](https://images.ctfassets.net/in6v9lxmm5c8/6TgAQf327eF11RxsgHZnzo/c0e80b4829887d16014082e098e4afa8/salmon_ikura_donburi_7549.png?q=50&fm=webp)

## 概要

仕様駆動開発（Specification-Driven Development, SDD）は、AIコーディングエージェントを活用した新しいソフトウェア開発スタイルです。このアプローチでは、まずAIとの対話を通じて明確な仕様書を作成し、その仕様書を「唯一の真実」としてコード生成を行います。GitHubが提供する**Spec Kit**は、この仕様駆動開発を支援するためのツールキットで、仕様書の作成から実装計画、タスク生成までの一連のワークフローを提供します。

## Spec Kitとは

Spec Kitは、AIとの反復的な対話を通じて、正確な受け入れ基準を定義し、それに基づいてコードを生成するプロセスを支援します。これにより、開発者は自然言語で仕様書をメンテナンスすることで、機能の追加や変更を行えるようになります。

### インストール

Spec Kitの利用には`uv`が必要です。以下のコマンドでプロジェクトを初期化します。

```sh
# uv のインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# Spec Kit プロジェクトの初期化
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

初期化時に、使用するコーディングエージェント（`copilot`, `claude`, `gemini`）を選択します。

![プロジェクト初期化](https://images.ctfassets.net/in6v9lxmm5c8/6JmxKQFoF6QJPBAki3vt3W/e03d91818d77f4e1248ad983e2d0d3fd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-07_12.57.56.png?q=50&fm=webp)

## 仕様駆動開発のワークフロー

Spec Kitは、主に3つのカスタムスラッシュコマンドを通じて開発プロセスを支援します。

### 1. 仕様書の作成 (`/specify`)

`/specify`コマンドと自然言語で開発したい機能の要件を伝えることから始めます。

```
/specify 新しい TODO 管理アプリケーション「TaskFlow」を作成する。プロジェクトの背景は...
```

AIは要件に基づき、ユーザーシナリオ、機能要件、主要エンティティなどを含む仕様書（`spec.md`）の草案を生成します。この際、不明瞭な点には`[NEEDS CLARIFICATION]`マーカーが自動的に付与されます。開発者はAIと対話を重ね、このマーカーを解消しながら、仕様書を反復的に改善していきます。

### 2. 実装計画の作成 (`/plan`)

仕様書が完成したら、`/plan`コマンドで技術スタックを指定し、実装計画を作成します。

```
/plan 以下の技術スタックで実装計画を作成してください。
- Next.js（App Router）
- TypeScript
- Tailwind CSS
- LocalStorage
```

このフェーズでは、データモデル、サービスインターフェース、テストガイドなどの具体的な設計成果物が生成されます。

### 3. タスクの作成 (`/tasks`)

実装計画が固まったら、`/tasks`コマンドを実行します。

```
/tasks
```

これにより、実装計画に基づいた実行可能なタスクの一覧（`tasks.md`）が生成されます。タスクは依存関係が考慮されており、並行実行可能なものには`[P]`マークが付けられます。

### 4. タスクの実行

最後に、生成されたタスクリストに従って、順番に開発を進めていきます。各タスクは一意なIDを持つため、特定のタスクを指定してAIに実行させることも可能です。

## まとめ

* **仕様駆動開発 (SDD)**: AIとの対話で作成した仕様書を基にコードを生成する開発スタイル。
* **利点**: AIへの要件伝達の精度向上、仕様書を信頼できる情報源として維持できる。
* **Spec Kit**: GitHubが提供するSDD支援ツールキット。`/specify`, `/plan`, `/tasks`コマンドでワークフローを支援する。
* **プロセス**:
    1. `/specify`で仕様書を対話的に作成・改善。
    2. `/plan`で技術スタックを定め、実装計画を策定。
    3. `/tasks`で実行可能なタスクリストを生成。
    4. タスクリストに基づき実装。

## 参考

* [github/spec-kit](https://github.com/github/spec-kit)
* [Specification-Driven Development (SDD)](https://github.com/github/spec-kit/blob/main/spec-driven.md)
* [Spec-driven development with AI: Get started with a new open source toolkit - The GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
