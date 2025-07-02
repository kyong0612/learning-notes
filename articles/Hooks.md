---
title: "Cloud Code Hook"
source: "https://docs.anthropic.com/en/docs/claude-code/hooks"
author:
  - "[[Anthropic]]"
published:
created: 2025-07-02
description: "シェルコマンドを登録してClaude Codeの動作をカスタマイズ・拡張する"
tags:
  - "clippings"
---
## はじめに

Claude Codeのフックは、Claude Codeのライフサイクルの様々な時点で実行されるユーザー定義のシェルコマンドです。フックはClaude Codeの動作を決定論的に制御し、LLMが実行を選択するのに頼るのではなく、特定のアクションが常に発生することを保証します。

ユースケースの例は以下の通りです：

- **通知**: Claude Codeがあなたの入力や実行許可を待っているときに通知を受け取る方法をカスタマイズします。
- **自動フォーマット**: ファイル編集のたびに`.ts`ファイルには`prettier`を、`.go`ファイルには`gofmt`などを実行します。
- **ロギング**: コンプライアンスやデバッグのために、実行されたすべてのコマンドを追跡・カウントします。
- **フィードバック**: Claude Codeがあなたのコードベースの規約に従わないコードを生成したときに、自動化されたフィードバックを提供します。
- **カスタム権限**: 本番ファイルや機密ディレクトリへの変更をブロックします。

これらのルールをプロンプトの指示ではなくフックとしてエンコードすることで、提案を実行が期待されるたびに実行されるアプリケーションレベルのコードに変えることができます。

フックは確認なしにあなたの完全なユーザー権限でシェルコマンドを実行します。あなたはフックが安全でセキュアであることを保証する責任があります。Anthropicはフックの使用に起因するいかなるデータ損失やシステム損傷に対しても責任を負いません。[セキュリティに関する考慮事項](https://docs.anthropic.com/en/docs/claude-code/hooks#security-considerations)を確認してください。

## クイックスタート

このクイックスタートでは、Claude Codeが実行するシェルコマンドをログに記録するフックを追加します。

クイックスタートの前提条件: コマンドラインでJSONを処理するために`jq`をインストールしてください。

### ステップ1: フック設定を開く

`/hooks` [スラッシュコマンド](https://docs.anthropic.com/en/docs/claude-code/slash-commands)を実行し、`PreToolUse`フックイベントを選択します。

`PreToolUse`フックはツール呼び出しの前に実行され、それをブロックしつつ、次に何をすべきかについてClaudeにフィードバックを提供できます。

### ステップ2: マッチャーを追加する

`+ Add new matcher…`を選択し、Bashツール呼び出しに対してのみフックを実行するようにします。

マッチャーに`Bash`と入力します。

### ステップ3: フックを追加する

`+ Add new hook…`を選択し、次のコマンドを入力します。

### ステップ4: 設定を保存する

保存場所として、ホームディレクトリにログを記録するため`User settings`を選択します。これにより、このフックは現在のプロジェクトだけでなく、すべてのプロジェクトに適用されます。

その後、REPLに戻るまでEscキーを押します。これでフックが登録されました！

### ステップ5: フックを確認する

`/hooks`を再度実行するか、`~/.claude/settings.json`をチェックして設定を確認します。

## 設定

Claude Codeのフックは、あなたの[設定ファイル](https://docs.anthropic.com/en/docs/claude-code/settings)で設定します。

- `~/.claude/settings.json` - ユーザー設定
- `.claude/settings.json` - プロジェクト設定
- `.claude/settings.local.json` - ローカルプロジェクト設定（コミットされない）
- エンタープライズ管理ポリシー設定

### 構造

フックはマッチャーによって整理され、各マッチャーは複数のフックを持つことができます。

- **matcher**: ツール名を照合するためのパターン（`PreToolUse`と`PostToolUse`にのみ適用可能）
  - 単純な文字列は完全一致します: `Write`はWriteツールのみに一致します
  - 正規表現をサポートします: `Edit|Write` や `Notebook.*`
  - 省略または空文字列の場合、フックはすべての一致するイベントに対して実行されます
- **hooks**: パターンが一致したときに実行するコマンドの配列
  - `type`: 現在は`"command"`のみがサポートされています
  - `command`: 実行するbashコマンド

## フックイベント

### PreToolUse

Claudeがツールパラメータを作成した後、ツール呼び出しを処理する前に実行されます。

**一般的なマッチャー:**

- `Task` - エージェントタスク
- `Bash` - シェルコマンド
- `Glob` - ファイルパターンのマッチング
- `Grep` - コンテンツ検索
- `Read` - ファイル読み込み
- `Edit`, `MultiEdit` - ファイル編集
- `Write` - ファイル書き込み
- `WebFetch`, `WebSearch` - Web操作

### PostToolUse

ツールが正常に完了した直後に実行されます。

PreToolUseと同じマッチャー値を認識します。

### Notification

Claude Codeが通知を送信するときに実行されます。

### Stop

Claude Codeが応答を終了したときに実行されます。

## フックの入力

フックは、セッション情報とイベント固有のデータを含むJSONデータを標準入力経由で受け取ります。

### PreToolUseの入力

`tool_input`の正確なスキーマはツールに依存します。

### PostToolUseの入力

`tool_input`と`tool_response`の正確なスキーマはツールに依存します。

### Notificationの入力

### Stopの入力

`stop_hook_active`は、ストップフックの結果としてClaude Codeがすでに続行している場合にtrueになります。この値を確認するか、トランスクリプトを処理して、Claude Codeが無限に実行されるのを防ぎます。

## フックの出力

フックがClaude Codeに出力を返す方法は2つあります。出力は、ブロックするかどうか、およびClaudeとユーザーに表示すべきフィードバックを伝えます。

### シンプル: 終了コード

フックは終了コード、標準出力、標準エラー出力を通じてステータスを伝えます。

- **終了コード 0**: 成功。`stdout`はトランスクリプトモード（CTRL-R）でユーザーに表示されます。
- **終了コード 2**: ブロッキングエラー。`stderr`はClaudeにフィードバックされ、自動的に処理されます。以下のフックイベントごとの動作を参照してください。
- **その他の終了コード**: 非ブロッキングエラー。`stderr`はユーザーに表示され、実行は継続されます。

#### 終了コード 2 の動作

| フックイベント | 動作 |
| --- | --- |
| `PreToolUse` | ツール呼び出しをブロックし、エラーをClaudeに表示 |
| `PostToolUse` | エラーをClaudeに表示（ツールはすでに実行済み） |
| `Notification` | N/A, stderrをユーザーにのみ表示 |
| `Stop` | 停止をブロックし、エラーをClaudeに表示 |

### アドバンスト: JSON出力

フックは、より高度な制御のために構造化されたJSONを`stdout`で返すことができます。

#### 共通のJSONフィールド

すべてのフックタイプには、これらのオプションフィールドを含めることができます。

`continue`がfalseの場合、Claudeはフックの実行後に処理を停止します。

- `PreToolUse`の場合、これは特定のツール呼び出しのみをブロックし、Claudeに自動フィードバックを提供する`"decision": "block"`とは異なります。
- `PostToolUse`の場合、これはClaudeに自動フィードバックを提供する`"decision": "block"`とは異なります。
- `Stop`の場合、これは`"decision": "block"`の出力よりも優先されます。
- いずれの場合も、`"continue" = false`は`"decision": "block"`の出力よりも優先されます。

`stopReason`は`continue`に付随し、ユーザーに表示される理由ですが、Claudeには表示されません。

#### PreToolUseの決定制御

`PreToolUse`フックは、ツール呼び出しを続行するかどうかを制御できます。

- "approve"は許可システムをバイパスします。`reason`はユーザーに表示されますが、Claudeには表示されません。
- "block"はツール呼び出しの実行を防ぎます。`reason`はClaudeに表示されます。
- `undefined`は既存の許可フローにつながります。`reason`は無視されます。

#### PostToolUseの決定制御

`PostToolUse`フックは、ツール呼び出しを続行するかどうかを制御できます。

- "block"は自動的にClaudeに`reason`をプロンプトします。
- `undefined`は何もしません。`reason`は無視されます。

#### Stopの決定制御

`Stop`フックは、Claudeが続行しなければならないかどうかを制御できます。

- "block"はClaudeの停止を防ぎます。Claudeが続行する方法を知るために`reason`を入力する必要があります。
- `undefined`はClaudeの停止を許可します。`reason`は無視されます。

#### JSON出力例: Bashコマンド編集

```python
#!/usr/bin/env python3
import json
import re
import sys

# Define validation rules as a list of (regex pattern, message) tuples
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
    ),
]

def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# Validate the command
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # Exit code 2 blocks tool call and shows stderr to Claude
    sys.exit(2)
```

#### Stopの決定制御

`Stop`フックはツールの実行を制御できます。

## MCPツールとの連携

Claude Codeのフックは[Model Context Protocol (MCP) ツール](https://docs.anthropic.com/en/docs/claude-code/mcp)とシームレスに連携します。MCPサーバーがツールを提供すると、フックで照合できる特別な命名パターンで表示されます。

### MCPツールの命名規則

MCPツールは`mcp__<server>__<tool>`というパターンに従います。例：

- `mcp__memory__create_entities` - メモリサーバーのエンティティ作成ツール
- `mcp__filesystem__read_file` - ファイルシステムサーバーのファイル読み込みツール
- `mcp__github__search_repositories` - GitHubサーバーの検索ツール

### MCPツール用フックの設定

特定のMCPツールやMCPサーバー全体をターゲットにすることができます。

## 例

### コードフォーマット

ファイル修正後に自動的にコードをフォーマットします。

### 通知

Claude Codeが許可を要求したときや、プロンプト入力がアイドル状態になったときに送信される通知をカスタマイズします。

## セキュリティに関する考慮事項

**自己責任で使用してください**: Claude Codeのフックは、システム上で任意のシェルコマンドを自動的に実行します。フックを使用することにより、以下の点を承諾したものとみなされます。

- 設定したコマンドについては、あなた自身が全責任を負います
- フックは、あなたのアカウントがアクセスできるすべてのファイルを変更、削除、またはアクセスできます
- 悪意のある、または不適切に記述されたフックは、データ損失やシステム損傷を引き起こす可能性があります
- Anthropicは、フックの使用に起因するいかなる損害についても、保証を提供せず、一切の責任を負いません
- 本番環境で使用する前に、安全な環境でフックを十分にテストする必要があります

設定にフックコマンドを追加する前に、必ずそれらをレビューし、理解してください。

### セキュリティのベストプラクティス

より安全なフックを作成するための主要なプラクティスは以下の通りです。

1. **入力の検証とサニタイズ** - 入力データを盲目的に信用しない
2. **シェル変数を常に引用符で囲む** - `$VAR`ではなく`"$VAR"`を使用する
3. **パストラバーサルをブロックする** - ファイルパスに`..`が含まれていないかチェックする
4. **絶対パスを使用する** - スクリプトのフルパスを指定する
5. **機密ファイルをスキップする** - `.env`、`.git/`、キーなどを避ける

### 設定の安全性

設定ファイル内のフックを直接編集しても、すぐには有効になりません。Claude Codeは次のようになります。

1. 起動時にフックのスナップショットを取得します
2. このスナップショットをセッション全体で使用します
3. フックが外部で変更された場合に警告します
4. 変更を適用するには、`/hooks`メニューでのレビューが必要です

これにより、悪意のあるフックの変更が現在のセッションに影響を与えるのを防ぎます。

## フック実行の詳細

- **タイムアウト**: 60秒の実行制限
- **並列化**: 一致するすべてのフックが並列で実行されます
- **環境**: Claude Codeの環境で現在のディレクトリで実行されます
- **入力**: 標準入力経由のJSON
- **出力**:
  - PreToolUse/PostToolUse/Stop: 進行状況はトランスクリプト（Ctrl-R）に表示されます
  - 通知: デバッグモードでのみログに記録されます（`--debug`）

## デバッグ

フックのトラブルシューティングを行うには：

1. `/hooks`メニューに設定が表示されているか確認します
2. [設定ファイル](https://docs.anthropic.com/en/docs/claude-code/settings)が有効なJSONであるか確認します
3. コマンドを手動でテストします
4. 終了コードを確認します
5. 標準出力と標準エラー出力のフォーマットが期待通りか確認します
6. 引用符のエスケープが適切であることを確認します

進行状況メッセージはトランスクリプトモード（Ctrl-R）に表示され、以下を示します。

- 実行中のフック
- 実行中のコマンド
- 成功/失敗のステータス
- 出力またはエラーメッセージ
