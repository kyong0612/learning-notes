---
title: "Claude Code本体の難読化されたコードをCursorを使って解析する"
source: "https://blog.lai.so/claude-code-into/"
author:
  - "laiso"
published: 2025-05-30
created: 2025-06-02
description: "Claude Codeの難読化されたソースコードを複数のAIツール（Devin、NotebookLM、Askrepo、Cursor）で解析する実験。NPMから取得した6.9MBの難読化されたcli.jsファイルを20個に分割し、各ツールの解析能力を比較検証した結果、Cursorが最も優秀な解析結果を示したという技術的検証記事。"
tags:
  - "claude-code"
  - "cursor"
  - "devin"
  - "ai-tools"
  - "code-analysis"
  - "reverse-engineering"
  - "npm"
  - "obfuscation"
---
## Claude Codeのソースコードを入手するには？

Claude Codeのソースコードは現在GitHubに公開されていません([計画にはあるようです](https://www.latent.space/p/claude-code?ref=blog.lai.so))。しかし、Node.js環境で実行されるスクリプトであるため、ユーザーはNPMレジストリ経由でパッケージを自由に取得できます。ただし、NPMから入手できるソースコードは難読化（ミニファイ）された状態で提供されています。

```
❯ npm pack @anthropic-ai/claude-code
❯ tar zxfv anthropic-ai-claude-code-1.0.5.tgz
❯ ls package/
cli.js  LICENSE.md  package.json  README.md  scripts  vendor  yoga.wasm
```

この難読化されたcli.jsというファイルは6.9MBの容量を持ち、約250万トークンに相当します。このファイルには依存ライブラリのコードもすべてバンドルされています。この規模のトークン数は、現在利用可能なあらゆる言語モデルの入力制限を超えるものです。

```
❯ du -sh package/cli.js
6.9M    package/cli.js

❯ ttok -i package/cli.js
2507499
```

幸い、コードは行単位で分割可能な形式であったため、Pythonスクリプトを用いてファイルを２０個に分割しました。これで１つ１０−２０万トークンに収まるはずです。

```python
import os

input_file = "package/cli.js"
output_dir = "split_files"
lines_per_file = 124  # 2480行 ÷ 20ファイル

os.makedirs(output_dir, exist_ok=True)

with open(input_file, "r") as f:
    lines = f.readlines()

for i in range(20):
    start = i * lines_per_file
    end = start + lines_per_file
    chunk = lines[start:end]
    
    with open(f"{output_dir}/cli_part{i+1:02d}.md", "w") as out:
        out.write(f"# CLI.js Part {i+1}\n\n\`\`\`javascript\n")
        out.writelines(chunk)
        out.write("\n\`\`\`")

print("分割完了: 20ファイルを生成")
```

```
❯ ls split_files/
cli_part01.js  cli_part02.js  cli_part03.js  cli_part04.js  cli_part05.js  cli_part06.js  cli_part07.js  cli_part08.js  cli_part09.js  cli_part10.js  cli_part11.js  cli_part12.js  cli_part13.js  cli_part14.js  cli_part15.js  cli_part16.js  cli_part17.js  cli_part18.js  cli_part19.js  cli_part20.js
```

## 各AIツールでの解析を試行する

### Devin

分割したコード断片をまずDevinに登録し、「Search機能による質問回答」「Wiki機能によるドキュメント化」で解析を試みました。

```
❯ git init
❯ wget https://raw.githubusercontent.com/github/gitignore/refs/heads/main/Node.gitignore -O .gitignore
❯ echo package/vendor/ >> .gitignore
❯ echo package/yoga.wasm >> .gitignore
❯ git add -n .
add '.gitignore'
add 'package/.claude/settings.local.json'
add 'package/LICENSE.md'
add 'package/README.md'
add 'package/cli.js'
add 'package/package.json'
add 'package/scripts/preinstall.js'
```

しかし、Devinはコード内部のコメント行のみを抽出・解析する結果となり、解析には至りませんでした。

![](https://blog.lai.so/content/images/2025/05/image-14.png)

これでもいいといえばいいんですが……

### NotebookLM

次に、分割したコード断片をNotebookLMに登録する方法を試みました。この際、NotebookLMの制約上ファイル拡張子を.mdに変更してコードをマークダウンファイルとして扱わせます。しかし、NotebookLMも同様にコード内容を有効に読み取ることができず、解析には至りませんでした。

![](https://blog.lai.so/content/images/2025/05/image-15.png)

### Askrepo

しかし、 [拙作Askrepo](https://github.com/laiso/askrepo?ref=blog.lai.so) を使用してGemini APIに1〜10ファイルずつ分割コードを送信したところ、コード部分の解析が可能であることを確認しました。この結果から、モデルがコードに直接アクセスさえできれば、難読化されたコードであっても推論が可能であることが分かりました。でかした、Askrepo戻れ！

```
❯ askrepo -m'gemini-2.5-flash-preview-05-20' --prompt "how to work Search tool? in Japanese." claude-code/split_files/cli_part1*.js
Claude Codeには、主に2種類の「検索」ツールがあります。

1.  **ファイル内容を検索するツール (grepのような機能)**
    このツールは、ファイル内のテキストパターンを検索するために使用されます。
    パラメータ:
    *   \`pattern\`: 検索する**正規表現**パターンを指定します。
    *   \`path\`: 検索するディレクトリの絶対パスを指定します。省略した場合、現在の作業ディレクトリが使用されます。
    *   \`include\`: 検索に含めるファイルパターン（例: "*.js", "*.{ts,tsx}"）を指定します。
    参照: \`../claude-code/split_files/cli_part15.js:1483\` (U95 schema)

2.  **ファイル名を検索するツール (globのような機能)**
    このツールは、プロジェクト内のファイル名をパターンに一致させて検索するために使用されます。
    パラメータ:
    *   \`pattern\`: ファイル名と一致させる**グロブパターン**を指定します。
    *   \`path\`: 検索するディレクトリの絶対パスを指定します。
```

## Cursor

最後に特に期待せず、Cursorで難読化コードを含むディレクトリ全体を開いて質問をして試みたところ、大成功しました。筆者が従来から行っていた目grepやデバッガによる解析結果と一致する出力を得られ、ハルシネーションが発生していないことは明らかです。Cursorは関連するコードブロックへの直接的なポインタ（ファイルパス+行番号）を示しながら回答を提供しました。

![](https://blog.lai.so/content/images/2025/05/image-16.png)

ただし、分割前の状態（6.9MBの単一cli.jsファイル）ではCursorも解析不可能でした。このことから、いくらCursorといえど大規模な難読化コードを解析するためにはファイルの分割が必須であると思われます。また、モデルをMaxモード（Claude 4を選択）に切り替えた場合、より詳細な解析が可能であることを確認しました。

**おまけ：システムプロンプトの差分分析**  
リリース時点で取得されていたシステムプロンプト（ [Claude\_Code\_03-04-24.md](https://github.com/elder-plinius/CL4R1T4S/blob/d9a004b5a29395675c5a548acfc386459f71cd14/ANTHROPIC/Claude_Code_03-04-24.md?ref=blog.lai.so) ）との差分を解析した結果、複数の更新が確認できました。とくに興味深かかった **"Taskツール"** の定義について紹介します。このツールの技術的特徴は以下の通りです：

- 並列実行アーキテクチャ：
  - 複数の子ツールを並列に呼び出し、ファイル検索や編集タスクを処理する
- タスクのオーケストレーション：
  - 各子ツールの出力を統合し、タスクの取りまとめを行う
- 状態管理：
  - Batch APIは使用せず、クライアントサイドでストリーミングAPIにリクエストをして、タスク状態を保持する方式を採用していました。

```
I've assigned multiple agents to tackle this task. Each agent has analyzed the problem and provided their findings.

${Q}

Based on all the information provided by these agents, synthesize a comprehensive and cohesive response that:
1. Combines the key insights from all agents
2. Resolves any contradictions between agent findings
3. Presents a unified solution that addresses the original task
4. Includes all important details and code examples from the individual responses
5. Is well-structured and complete

Your synthesis should be thorough but focused on the original task.
```

ソースコードから抜粋
