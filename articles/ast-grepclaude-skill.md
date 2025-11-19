---
title: "ast-grep/claude-skill"
source: "https://github.com/ast-grep/claude-skill/"
author:
  - "[[HerringtonDarkholme]]"
published:
created: 2025-11-19
description: "Claude Code用のast-grepスキル。Abstract Syntax Tree (AST)パターンを使用した構造的なコード検索を可能にする。テキストマッチングではなく、コード構造に基づいてコードベースを検索できる。"
tags:
  - "clippings"
  - "ast-grep"
  - "claude-code"
  - "code-search"
  - "AST"
  - "developer-tools"
---

## 概要

ast-grep/claude-skillは、Claude Codeに構造的なコード検索機能を追加するスキルです。従来のテキストベースの検索（grep、ripgrep）とは異なり、Abstract Syntax Tree (AST)パターンを使用してコードの構造を理解し、より高度な検索を可能にします。

## 主な特徴

### 構造認識検索

- テキストマッチングではなく、AST構造に基づいた検索
- メタ変数（`$VAR`）を使用した柔軟なパターンマッチング
- リレーショナルクエリ：特定のコンテキスト内でのコード検索
- 複合ロジック：AND、OR、NOT演算によるルールの組み合わせ
- テスト駆動アプローチ：コードベースで実行する前にルールをテスト

### 検索例

以下のような高度な検索パターンが可能です：

- 「エラーハンドリングがない非同期関数をすべて見つける」
- 「特定のフックを使用するReactコンポーネントを特定する」
- 「3つ以上のパラメータを持つ関数を検索する」
- 「クラスメソッド内のconsole.log呼び出しを検索する」

## インストール

### 前提条件

ast-grepをシステムにインストールする必要があります：

```bash
# macOS
brew install ast-grep

# npm
npm install -g @ast-grep/cli

# cargo
cargo install ast-grep
```

インストールの確認：

```bash
ast-grep --version
```

### スキルのインストール

1. リポジトリをクローンまたはダウンロードして、Claude Codeのスキルディレクトリに配置：

   ```bash
   # スキルディレクトリが設定されている場合
   cp -r ast-grep ~/.claude/skills/

   # または、Claude Codeのスキルが配置されている場所に配置
   ```

2. Claude Codeが自動的にスキルを検出します

3. 2025年11月時点では、Claude Codeは適切なユースケースに対して自動的にast-grepを選択できないため、クエリで明示的に「ast-grepを使用して...」と指定する必要があります

## 使用方法

### 基本的な使用例

**awaitを使用する非同期関数を検索：**

```text
Find all async functions in this project that use await
```

**エラーハンドリングの欠如を検索：**

```text
Show me async functions that don't have try-catch blocks
```

**特定の関数呼び出しを検索：**

```text
Find all places where we call console.log with more than one argument
```

**特定のコンテキスト内のコードを検索：**

```text
Find all setState calls inside useEffect hooks
```

### 動作の仕組み

1. Claudeがクエリを分析し、ast-grepが適切かどうかを判断
2. 検索基準に一致するサンプルコードを作成
3. パターンに一致するast-grepルールを作成
4. サンプルコードに対してルールをテスト
5. 検証後、コードベース全体を検索
6. ファイルパスと行番号を含む結果を提示

## サポートされている言語

ast-grepは多くのプログラミング言語をサポートしています：

- JavaScript/TypeScript
- Python
- Rust
- Go
- Java
- C/C++
- Ruby
- PHP
- その他多数

## 高度な使用方法

### 直接ast-grepコマンドの使用

Claudeがほとんどのユースケースを自動的に処理しますが、ast-grepを直接使用することもできます：

```bash
# シンプルなパターン検索
ast-grep run --pattern 'console.log($ARG)' --lang javascript .

# 複雑なルールベースの検索
ast-grep scan --inline-rules "id: my-rule
language: javascript
rule:
  kind: function_declaration
  has:
    pattern: await \$EXPR
    stopBy: end" .
```

### デバッグ

検索が期待通りに動作しない場合、Claudeに以下を依頼できます：

- 作成したast-grepルールを表示
- コードのAST構造を検査
- サンプルコードに対してルールをテスト

## スキル内のファイル

- `SKILL.md` - Claude用のメインスキル指示
- `references/rule_reference.md` - 包括的なast-grepルールドキュメント
- `README.md` - このファイル

## 最良の結果を得るためのヒント

1. **具体的に指定する**: 詳細を提供すればするほど、検索結果が向上します
2. **例を提供する**: 可能であれば、見つけたいものの例をClaudeに示します
3. **反復する**: 広い検索から始めて、徐々に絞り込みます
4. **説明を求める**: Claudeに作成したast-grepルールの説明を求めます

## 検索可能なものの例

### コード品質

- 戻り値のない関数
- パラメータが多すぎる関数
- 未使用の変数
- nullチェックの欠如

### パターン

- Reactフックの使用パターン
- API呼び出しパターン
- データベースクエリパターン
- エラーハンドリングパターン

### リファクタリング

- 非推奨関数のすべての使用箇所を検索
- 移行が必要なコードを特定
- コードベース全体で一貫性のないパターンを検索

### セキュリティ

- 潜在的なSQLインジェクションのポイント
- 安全でないevalの使用
- 入力検証の欠如

## トラブルシューティング

**Claudeがスキルを使用しない：**

- ast-grepがインストールされていることを確認（`ast-grep --version`）
- より明示的に試す：「ast-grepを使用して検索...」

**結果が見つからない：**

- まずよりシンプルなクエリを試す
- Claudeにルールを表示してテストするよう依頼
- 一致させたいコードの例を提供

**予期しない結果：**

- より詳細な情報でクエリを絞り込む
- Claudeに特定のパターンを除外するよう依頼
- コードのAST構造を表示するよう依頼

## リソース

- [ast-grep公式ドキュメント](https://ast-grep.github.io/)
- [ast-grep Playground](https://ast-grep.github.io/playground.html) - オンラインでパターンをテスト
- [ast-grep GitHub](https://github.com/ast-grep/ast-grep)

## ライセンス

このスキルは、含まれるドキュメントや例について、ast-grepのMITライセンスに従います。

## サポート

問題がある場合：

- **このスキルについて**: このリポジトリでissueを開く
- **ast-grep自体について**: [ast-grep GitHub](https://github.com/ast-grep/ast-grep)を訪問
- **Claude Codeについて**: [Claude Codeドキュメント](https://code.claude.com/)を確認

## リポジトリ情報

- **スター数**: 79
- **フォーク数**: 2
- **コミット数**: 4
- **言語**: 主にMarkdownと設定ファイル

## 重要な注意事項

- 2025年11月時点では、Claude Codeは適切なユースケースに対して自動的にast-grepを選択できないため、クエリで明示的に指定する必要があります
- ast-grepがシステムにインストールされている必要があります
- スキルは自動的に検出されますが、使用するには明示的な指示が必要です
