---
title: "docker/cagent: Agent Builder and Runtime by Docker Engineering"
source: "https://github.com/docker/cagent"
author:
  - "Docker Engineering"
published: 2025-09-22
created: 2025-09-23
description: |
  `cagent`は、特殊な能力やツールを持つAIエージェントと、エージェント間の相互作用を調整する、強力で使いやすく、カスタマイズ可能なマルチエージェントランタイムです。
tags:
  - "docker"
  - "ai"
  - "agents"
  - "multi-agent"
  - "golang"
  - "mcp"
---

# 🤖 `cagent` 🤖

> A powerful, easy to use, customizable multi-agent runtime that orchestrates AI agents with
> specialized capabilities and tools, and the interactions between agents.

[![cagent in action](https://github.com/docker/cagent/raw/main/docs/assets/cagent-run.gif)](https://github.com/docker/cagent/blob/main/docs/assets/cagent-run.gif)

## ✨ What is `cagent`? ✨

`cagent` を使用すると、各エージェントが専門的な知識、ツール、および能力を持つインテリジェントなAIエージェントを作成および実行できます。

これは、複雑な問題を解決するために協力する仮想専門家のチームを迅速に構築、共有、実行できるものと考えてください。

そして、使い方は非常に簡単です！

⚠️ 注: `cagent` は活発に開発中です。**互換性を損なう変更が予想されます** ⚠️

### Your First Agent

エージェントの作成は非常にシンプルで、短いYAMLファイルで記述します。

Example `basic_agent.yaml`:

```yaml
agents:
  root:
    model: openai/gpt-5-mini
    description: A helpful AI assistant
    instruction: |
      You are a knowledgeable assistant that helps users with various tasks.
      Be helpful, accurate, and concise in your responses.
```

`cagent run basic_agent.yaml` で実行します。
その他の多くの例は[こちら](https://github.com/docker/cagent/blob/main/examples/README.md)にあります。

### Improving an agent with MCP tools

`cagent`はMCPサーバーをサポートしており、エージェントがさまざまな外部ツールやサービスを使用できるようになります。`stdio`、`http`、`sse` の3つのトランスポートタイプをサポートしています。

MCPを介してエージェントにツールへのアクセスを与えることで、その能力、結果の質、および全体的な有用性を大幅に向上させることができます。
[Docker MCP Toolkit](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/) と [catalog](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/) で素早く始めることができます。

### 🎯 Key Features

* **🏗️ マルチエージェントアーキテクチャ**: 異なるドメイン向けに特化したエージェントを作成。
* **🔧 豊富なツールエコシステム**: MCPプロトコルを介して外部ツールやAPIを使用可能。
* **🔄 スマートな委任**: 最も適したスペシャリストにタスクを自動的にルーティング。
* **📝 YAML設定**: 宣言的なモデルとエージェントの設定。
* **💭 高度な推論**: 複雑な問題解決のための組み込み「思考」「TODO」「記憶」ツール。
* **🌐 複数のAIプロバイダー**: OpenAI, Anthropic, Gemini, [Docker Model Runner](https://docs.docker.com/ai/model-runner/) をサポート。

## 🚀 Quick Start 🚀

### Installation

Windows, macOS, Linux用の[ビルド済みバイナリ](https://github.com/docker/cagent/releases)がリリースされています。
ダウンロード後、実行権限を付与する必要があります。

```sh
# linux amd64 build example
chmod +x /path/to/downloads/cagent-linux-amd64
```

### **Set your API keys**

使用するモデルに応じて、プロバイダーのAPIキーを設定する必要があります。

```sh
# For OpenAI models
export OPENAI_API_KEY=your_api_key_here

# For Anthropic models
export ANTHROPIC_API_KEY=your_api_key_here

# For Gemini models
export GOOGLE_API_KEY=your_api_key_here
```

### Run Agents

```sh
# Run an agent!
cagent run ./examples/pirate.yaml

# or specify a different starting agent from the config
cagent run ./examples/pirate.yaml -a root

# or run directly from an image reference
cagent run creek/pirate
```

## エージェントとチームの迅速な生成

`cagent new` コマンドを使用すると、単一のプロンプトでエージェントまたはマルチエージェントチームを迅速に生成できます。
この機能を使用するには、Anthropic、OpenAI、またはGoogleのAPIキーが環境で利用可能であるか、DMR（Docker Model Runner）で実行するローカルモデルを指定する必要があります。

```sh
$ cagent new

------- Welcome to cagent! -------
(Ctrl+C to stop the agent or exit)

What should your agent/agent team do? (describe its purpose):

> I need an agent team that connects to <some-service> and does...
```

## Docker HubでのエージェントのPushとPull

### `cagent push`

エージェント設定は、`cagent push` コマンドを使用してDocker Hubにパッケージ化して共有できます。

```sh
cagent push ./<agent-file>.yaml namespace/reponame
```

### `cagent pull`

`cagent pull` コマンドでDocker Hubからエージェントをプルすることも簡単です。

```sh
cagent pull creek/pirate
```

## Contributing

`cagent` の開発に参加したい場合や、バグ修正、機能構築を手伝いたい場合は、[CONTRIBUTING.md](https://github.com/docker/cagent/blob/main/docs/CONTRIBUTING.md) を参照してください。

## DogFooding: `cagent` を使って `cagent` をコーディングする

`cagent`のコードベースと機能セットを改善する賢い方法は、`cagent`エージェントの助けを借りて行うことです。
`./golang_developer.yaml` は、cagentマルチエージェントAIシステムアーキテクチャに特化したエキスパートGolang開発者エージェントです。

```sh
cd cagent
cagent run ./golang_developer.yaml
```

## Share your feedback

このプロジェクトに関するご意見をお聞かせください。
[Slack](https://dockercommunity.slack.com/archives/C09DASHHRU4) で私たちを見つけることができます。
