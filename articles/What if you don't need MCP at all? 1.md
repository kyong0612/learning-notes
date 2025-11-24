---
title: "What if you don't need MCP at all?"
source: "https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/"
author:
  - Mario Zechner
published: 2025-11-02
created: 2025-11-24
description: |
  MCPサーバーに頼らず、Bashとコードインタープリターだけでエージェントを効率的に動作させる方法を提案。ブラウザDevToolsのユースケースを例に、最小限のCLIツールセットでMCPサーバーを置き換える実践的なアプローチを解説。コンテキスト消費を大幅に削減し、ツールの拡張性とコンポーザビリティを向上させる方法を示す。
tags:
  - "clippings"
  - "MCP"
  - "AI Agents"
  - "Browser Automation"
  - "Puppeteer"
  - "CLI Tools"
  - "Context Efficiency"
---

## 要約

## 背景と問題提起

エージェント開発が盛んになる中、MCPサーバーに関する議論が続いている。しかし、多くの人気のあるMCPサーバーには以下の問題がある：

1. **非効率性**: すべてのユースケースをカバーしようとして、大量のツールと長い説明を提供し、コンテキストを大量に消費する
   - Playwright MCP: 21ツール、13.7kトークン（Claudeのコンテキストの6.8%）
   - Chrome DevTools MCP: 26ツール、18.0kトークン（9.0%）

2. **拡張性の問題**: 既存のMCPサーバーを拡張するのが困難。ソースコードを理解し、修正する必要がある

3. **コンポーザビリティの欠如**: MCPサーバーからの結果はエージェントのコンテキストを経由する必要があり、ディスクへの保存や他の結果との結合が非効率

## 解決策: Bashとコードの活用

エージェントはBashを実行し、コードを書くことができる。Bashとコードはコンポーザブルである。したがって、エージェントにCLIツールを呼び出させ、コードを書かせる方がシンプルで効率的。

### ブラウザDevToolsのユースケース

著者の主なユースケースは2つ：

1. エージェントと協力してWebフロントエンドを開発
2. エージェントを使ってWebスクレイピング

これらのユースケースに必要な最小限のツールセット：

- ブラウザの起動（オプションでデフォルトプロファイルを使用してログイン状態を維持）
- URLへのナビゲーション（アクティブタブまたは新しいタブ）
- アクティブページのコンテキストでJavaScriptの実行
- ビューポートのスクリーンショット取得

## 実装: 最小限のCLIツールセット

### ツール構成

README.mdファイルに4つのシンプルなツールを定義：

```bash
# Browser Tools

## Start Chrome
./start.js              # Fresh profile
./start.js --profile    # Copy your profile (cookies, logins)

## Navigate
./nav.js https://example.com
./nav.js https://example.com --new

## Evaluate JavaScript
./eval.js 'document.title'
./eval.js 'document.querySelectorAll("a").length'

## Screenshot
./screenshot.js
```

このREADMEはわずか225トークン（MCPサーバーの13,000〜18,000トークンと比較して大幅に削減）。

### 各ツールの実装詳細

#### 1. Start Tool (`start.js`)

- Chromeをリモートデバッグポート9222で起動
- `--profile`オプションでデフォルトChromeプロファイルを一時フォルダにrsync（ログイン状態を維持）
- Puppeteer Coreを使用してChromeの準備を確認

#### 2. Navigate Tool (`nav.js`)

- アクティブタブまたは新しいタブでURLにナビゲート
- Puppeteer CoreでChrome DevTools Protocolに接続

#### 3. Evaluate JavaScript Tool (`eval.js`)

- アクティブタブのページコンテキストでJavaScriptを実行
- エージェントはDOM APIを使ってコードを書くだけで良い（Puppeteer自体を扱う必要がない）
- 結果を適切にフォーマットして出力

#### 4. Screenshot Tool (`screenshot.js`)

- 現在のビューポートのスクリーンショットを取得
- 一時ディレクトリにPNGファイルとして保存し、ファイルパスを返す
- エージェントはその画像を読み込んで視覚能力を使用可能

## メリット

### 1. コンテキスト効率性

- READMEは必要時にのみ読み込まれ、毎セッションでコストを支払う必要がない
- 225トークン vs 13,000〜18,000トークン（約60〜80倍の削減）
- モデルが既にコードとBashの知識を持っているため、コンテキストを節約

### 2. コンポーザビリティ

- ツールの出力をコンテキストに読み込む代わりに、ファイルに保存して後で処理可能
- エージェントまたはコードによる処理が可能
- 複数の呼び出しを単一のBashコマンドで簡単にチェーン可能

### 3. 柔軟性

- ツールの出力形式がトークン効率的でない場合、簡単に変更可能
- MCPサーバーでは困難または不可能な調整が容易

### 4. 拡張性

- 新しいツールの追加や既存ツールの修正が非常に簡単
- エージェントに指示するだけで新しいツールを生成可能

## 拡張例

### Pick Tool (`pick.js`)

DOM要素を視覚的に選択するためのインタラクティブツール：

- クリックで要素を選択
- Cmd/Ctrl+クリックで複数選択
- Enterで完了、ESCでキャンセル
- 選択した要素の情報（tag、id、class、text、html、親要素の階層）を返す

スクレイピング作業で、エージェントにDOM構造を理解させるよりも、直接要素をクリックして指定する方が効率的。

### Cookies Tool

HTTP-onlyクッキーを取得するツール。Evaluate JavaScriptツールでは取得できないが、Claudeに指示して1分以内に作成可能。

## 実用例: Hacker Newsスクレイパー

動画デモで、Pickツールを使ってDOM要素を選択し、エージェントが最小限のNode.jsスクレイパーを生成する流れを実演。

## 再利用性の確保

### セットアップ方法

1. **ツールの配置**: ホームディレクトリに`agent-tools`フォルダを作成し、各ツールのリポジトリをクローン

2. **エイリアスの設定**:

   ```bash
   alias cl="PATH=$PATH:/Users/badlogic/agent-tools/browser-tools:<other-tool-dirs> && claude --dangerously-skip-permissions"
   ```

3. **スクリプト名の命名**: 各スクリプトに完全なツール名をプレフィックス（例: `browser-tools-start.js`）して名前の衝突を回避

4. **Claude Codeの設定**: エージェントツールディレクトリを作業ディレクトリとして追加し、`@README.md`で参照可能に

### AnthropicのSkillsとの比較

- Skillsシステムは段階的開示（progressive disclosure）を追加し、非技術的なユーザーにも利用可能
- しかし、著者のセットアップはよりアドホックで、あらゆるコーディングエージェントで動作
- Skillsの自動検出は実践的に信頼性が低いと感じた
- Claude Codeは検出したすべてのスキルのフロントマターをシステムプロンプトに注入するため、さらにトークンを節約可能

## 結論

### 主な利点

1. **構築が非常に簡単**: 必要なツールを素早く作成可能
2. **完全な自由度**: ツールの動作を完全に制御可能
3. **効率性**: エージェント、ユーザー、トークン使用量すべてが効率的

### 適用範囲

この原則は、何らかのコード実行環境を持つあらゆる種類のハーネスに適用可能。MCPの枠組みから離れて考えることで、MCPのより厳格な構造よりもはるかに強力な解決策を見つけられる。

### 注意点

大きな力には大きな責任が伴う。ツールの構築と維持のための構造を自分で考え出す必要がある。AnthropicのSkillsシステムは一つの方法だが、他のエージェントへの移植性は低い。

## リソース

- ブラウザツールのリポジトリ: [GitHub](https://github.com/badlogic/browser-tools)
- 関連記事: ["Prompts are Code" blog post](https://mariozechner.at/posts/2025-06-02-prompts-are-code/)
- 関連プロジェクト: [sitegeist.ai](https://sitegeist.ai)
- 関連記事: [Armin's post on code MCPs](https://lucumr.pocoo.org/2025/8/18/code-mcps/)

## 技術的詳細

- **使用技術**: Puppeteer Core、Node.js、Chrome DevTools Protocol
- **リモートデバッグポート**: 9222
- **プロファイル管理**: rsyncを使用してChromeプロファイルを一時ディレクトリにコピー
- **コンテキスト**: エージェントはページコンテキストでJavaScriptを実行（Puppeteer APIを直接扱う必要がない）
