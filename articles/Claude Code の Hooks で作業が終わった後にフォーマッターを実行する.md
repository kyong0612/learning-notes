---
title: "Claude Code の Hooks で作業が終わった後にフォーマッターを実行する"
source: "https://azukiazusa.dev/blog/claude-code-hooks-run-formatter/"
author:
  - "azukiazusa"
published: 2025-07-01
created: 2025-07-05
description: "Claude Code hooks は Claude Code のライフサイクルの特定のタイミングで実行されるユーザー定義のシェルスクリプトです。hooks を使用することで、コードのフォーマットを常に実行することができます。この記事では hooks を使用してコードの変更後に prettier が実行されるように設定してみましょう。"
tags:
  - "clippings"
  - "claude-code"
---
## Claude Code Hooks 概要

Claude Code hooks は、Claude Code のライフサイクルの特定のタイミングで実行されるユーザー定義のシェルスクリプトです。この機能を利用することで、LLM（大規模言語モデル）の判断に依存せず、コードフォーマッターの実行といった特定のアクションを常に保証できます。

LLMがコードを生成する際、フォーマットが実行されないままコードがコミットされてしまうことがあります。hooks を使えば、ファイルの変更後に`prettier`のようなフォーマッターを自動的に実行し、コードの一貫性を保つことが可能です。

> **Warning**
> hooks で実行されるシェルコマンドはユーザーの確認なしに実行されるため、予期せぬコマンドが実行される可能性があります。hooks の仕様ではユーザー自身が全責任を負うことが明記されています。
> 参照: [Security considerations](https://docs.anthropic.com/en/docs/claude-code/hooks#security-considerations)

## hooks の設定方法

hooks は `/hooks` カスタムスラッシュコマンド、または設定ファイル (`.claude/settings.json`) を直接編集することで設定できます。ここではスラッシュコマンドを使った設定手順を説明します。

### 1. hooks イベントの選択

まず、hooks を実行するタイミングを選択します。以下の4つのイベントが利用可能です。

1. `PreToolUse`: ツール実行前
2. `PostToolUse`: ツール実行後
3. `Notification`: 通知送信時
4. `Stop`: Claudeが応答を終了する直前

コードフォーマットはファイル編集後に実行したいため、`PostToolUse` を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5YIRj2mjHVRjsGXBsKTa8N/a260db1dcfddb9a8d11e0fd345a097b2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_11.27.48.png?q=50&fm=webp)

### 2. hooks matcher の追加

次に、どのツールが呼び出された後に hooks を実行するかを `matcher` で指定します。ファイルの書き込みや編集時に `prettier` を実行したいので、`Write|Edit|MultiEdit` と入力します。`|` で区切ることで複数のツールを指定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4R4C1nZW4IoQcW4h68PBKW/05e71f02232fa254dbed11ba094599db/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_12.44.49.png?q=50&fm=webp)

### 3. hooks コマンドの入力

`PostToolUse` イベントの場合、hooks は stdin を通じて以下のようなJSON形式のデータを受け取ります。

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

このJSONから`jq`コマンドを使ってファイルパスを抽出し、`prettier`を実行するコマンドを組み立てます。

```bash
jq -r '.tool_input.file_path | select(endswith(".js") or endswith(".ts") or endswith(".jsx") or endswith(".tsx"))' | xargs -r prettier --write
```

このコマンドは、JavaScriptやTypeScriptファイルが変更された場合のみ `prettier --write` を実行します。`xargs -r` は、対象ファイルがない場合にコマンドが実行されないようにするオプションです。

最後に、設定の保存場所を選択します。

- `.claude/settings.local.json`: プロジェクト単位（ローカル）
- `.claude/settings.json`: プロジェクト単位
- `~/.claude/settings.json`: ユーザー単位（グローバル）

![](https://images.ctfassets.net/in6v9lxmm5c8/KCxHhhg7t7VXswQTdl1cF/ab6ef2dcc4629e6dcee6fda51eb0d82a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_12.54.08.png?q=50&fm=webp)

### 4. 設定の確認

設定が完了すると、選択した場所に以下のようなJSONが保存されます。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path | select(endswith(\".js\") or endswith(\".ts\") or endswith(\".jsx\") or endswith(\".tsx\"))' | xargs -r npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

実際にClaude Codeでファイルを変更すると、hooksが実行されたログが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3U5giewvakuLXoliSc8EPA/a8c7e4d3a0febf3a4fbc8271059d4dfd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_13.25.48.png?q=50&fm=webp)

## まとめ

- **hooks**: Claude Codeの特定のライフサイクルでユーザー定義コマンドを実行する機能。
- **設定**: `/hooks` コマンドで設定可能。
- **イベント**: `PreToolUse`, `PostToolUse`, `Notification`, `Stop` の4種類。
- **matcher**: 特定のツール実行時にhooksをトリガーする。
- **データ受け渡し**: hooksコマンドはstdin経由でJSONデータを受け取る。

## 参考

- [Hooks - Anthropic](https://docs.anthropic.com/en/docs/claude-code/hooks)
