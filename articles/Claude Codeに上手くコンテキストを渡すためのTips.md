---
title: "Claude Codeに上手くコンテキストを渡すためのTips"
source: "https://zenn.dev/knowledgework/articles/9b82d0c0a34ab4"
author:
  - gomachan
published: 2025-09-25
created: 2025-09-26
description: |
  Claude Code CLIの利用時に感じる文脈指定の煩雑さや指示の過不足といった課題を、VSCode拡張やショートカット、型定義を活用したプロンプト設計、CLAUDE.mdへのメモ機能など3つのTipsで解消する方法を紹介する。
tags:
  - "clippings"
  - "Claude Code"
  - "VSCode"
  - "AI支援"
  - "プロンプト設計"
---

## 記事概要

Claude Code CLIでの開発支援をスムーズにするために、コンテキスト指定の手間・指示の伝達ミス・意図しない差分といった課題を3つのTipsとして整理し、VSCodeユーザがすぐに取り入れられる実践的な改善策を提示している。

## 課題: コンテキストに指定するファイルのパス指定

### 課題の背景

`@パス` でファイルを列挙するClaude Code CLIの仕様は、補完が重く感じられたり現在開いているファイルのパス確認に手間がかかったりするため、複数ファイルを扱う際に煩雑さが残る。

### 解決策その1: VSCode拡張を使う

Anthropic公式のVSCode拡張「Claude Code for VS Code」を導入すると、アクティブなエディタのファイルや選択範囲を自動でコンテキストに追加でき、パス指定の負担が軽減される。また選択したテキストのみを渡すことで、焦点を絞ったやり取りが可能になる。

![Claude Code拡張のコンテキスト設定画面](https://storage.googleapis.com/zenn-user-upload/b04019649173-20250924.png)

### 解決策その2: 相対パスをサクッとコピーできるようにする

複数ファイルを指定する場合は結局 `@` でパス列挙が必要になるため、`keybindings.json` に相対パスコピーのショートカットを定義しておくと効率が上がる。例として `Alt+Cmd+C` に `copyRelativeFilePath` を割り当て、エディタで開いているファイルの相対パスを素早く取得できるようにしている。

```
{
  "key": "alt+cmd+c",
  "command": "copyRelativeFilePath",
  "when": "editorTextFocus"
}
```

![keybindings.jsonを検索するコマンドパレット](https://storage.googleapis.com/zenn-user-upload/32e4b44cc38f-20250924.png)

## 課題: 指示がうまく伝わらない・伝え方がわからない

### 解決策: まずは欲しい型を詳しく書く

曖昧な日本語のプロンプトだけに頼るとClaudeが意図しない方向に進んでしまうため、まず型定義を仕様書代わりに起こし、プロパティ単位でコメントを添える方法を推奨。これにより最低限のプロンプトでも期待どおりの実装を誘導しやすくなる。

```
// 日付ごとに ToDo をまとめた結果
export type TodosByDate = Record<
  string, // "YYYY-MM-DD" 形式の日付
  string[] // その日にやるタスク名
>

// この型に合うように関数を書いて
// 入力: todos: { id: string; title: string; dueDate: string }[]
// 出力: TodosByDate
```

## 課題: 指示の範囲を超えた意図しないことも対応してしまう

### 解決策: 「#」を使ってCLAUDE.mdを更新する

AIが型エラー修正など不要な差分まで生成してしまう問題には、コミット前にやってほしくないことやプロジェクト固有の方針を `#` 付きメモで逐次 `CLAUDE.md` に記録する方法を提案。作業途中で気付いたルールを即座に共有でき、過剰な自動修正を抑制できる。

![CLAUDE.mdメモ機能の使用例](https://storage.googleapis.com/zenn-user-upload/976944d5d4b0-20250922.png)

## まとめ

- VSCode拡張とショートカット活用でコンテキスト指定の手間を大幅削減。
- 型定義＋コメントを仕様書として使い、意図を正確に伝達。
- `CLAUDE.md` メモで過剰な編集を防ぎ、作業方針を即時共有。

## 関連情報

- 本記事は `KNOWLEDGE WORK Blog Sprint` 25日目として公開され、26日目はAI GroupのShisho氏が執筆予定と案内している。
- 株式会社ナレッジワークはセールスイネーブルメントAI「ナレッジワーク」を提供し、エンジニア採用情報も公開している。
