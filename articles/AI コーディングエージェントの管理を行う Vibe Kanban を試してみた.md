---
title: "AI コーディングエージェントの管理を行う Vibe Kanban を試してみた"
source: "https://azukiazusa.dev/blog/coding-agent-management-vibe-kanban/"
author:
  - "azukiazusa1"
published: 2025-08-30
created: 2025-08-31
description: |
  Vibe Kanban は、AI コーディングエージェントの管理を支援するためのツールです。カンバン方式の UI でタスク管理を行い、各タスクに対して AI エージェントを割り当てて人間がその進捗を管理できます。この記事では Vibe Kanban を使用して AI コーディングエージェントの管理を実際に試してみます。
tags:
  - "AI"
  - "Vibe Kanban"
  - "claude-code"
---

## Vibe Kanban とは

Vibe Kanbanは、AIコーディングエージェントの管理を支援するツールです。カンバン方式のUIでタスクを管理し、各タスクにAIエージェントを割り当てて、人間が進捗を管理することができます。

**主な特徴:**

* Codex, Claude Code, Gemini CLIなどの主要なAIコーディングエージェントをサポート。
* 複数のタスクを並列実行可能。
* Web UIでタスクのステータスを確認できる。
* MCPサーバーの設定を一元管理できる。

![木の矢印の看板のイラスト](https://images.ctfassets.net/in6v9lxmm5c8/7oJ91RzbWDraexjtAyRmYf/a9c465f920c49f37f855601f914196c5/wooden-arrow-sign_19261-768x768.png?q=50&fm=webp)

## インストール

npmを使用してインストール・実行します。

```sh
npx vibe-kanban
```

ポートを固定する場合は環境変数 `PORT` を設定します。

```sh
PORT=3000 npx vibe-kanban
```

ブラウザで `http://localhost:3000` にアクセスし、初期設定を行います。

1. 安全上の警告に同意します。
    ![](https://images.ctfassets.net/in6v9lxmm5c8/35owvt5FakVywMaq4bCDPd/3f46364bda36ef071f7c2b881d89503f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_14.32.38.png?q=50&fm=webp)
2. 使用するコーディングエージェント（例: Claude Code）とエディタ（例: VS Code）を選択します。
    ![](https://images.ctfassets.net/in6v9lxmm5c8/1O455nkWFU3svV3INz9wSh/19eeb393b40a844f7f278ccaa711bf76/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_14.38.11.png?q=50&fm=webp)
3. GitHubアカウントに接続して認証します（スキップ可能）。
    ![](https://images.ctfassets.net/in6v9lxmm5c8/3AkRLhWTDrajhGsc9rDizf/f8fb59b426a68c11856563aacd5711a2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_17.56.58.png?q=50&fm=webp)
4. フィードバックデータの収集に関する設定をします。

## プロジェクトを選択する

右上の「+ Create Project」ボタンから新しいプロジェクトを作成します。
![](https://images.ctfassets.net/in6v9lxmm5c8/63ySnuANo4XEk2axoLmDBz/a4371b9c3d9899728eab68c42767977e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.02.51.png?q=50&fm=webp)

既存のディレクトリを選択するか、新しいディレクトリを作成してプロジェクトを開始できます。セットアップコマンドや開発サーバー起動コマンドも指定可能です。
![](https://images.ctfassets.net/in6v9lxmm5c8/6MmBWIOZu3KZn3UBu67GXm/190d6a04377edac772f12feead858c9b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.08.28.png?q=50&fm=webp)
プロジェクトが作成されるとカンバンボードが表示されます。
![](https://images.ctfassets.net/in6v9lxmm5c8/2Wg74xPChQ6ZUtHkFTA2t7/7d2e5059b75d7dd1c4afe6880a2d1a7c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.12.32.png?q=50&fm=webp)

## タスクを作成して AI コーディングエージェントに作業を依頼する

「Create Task」ボタンで新しいタスクを作成します。
![](https://images.ctfassets.net/in6v9lxmm5c8/67pisxahyqILJTGQaxrfor/b23a460ab3d596800cc24442749bd638/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.15.39.png?q=50&fm=webp)

タスクにはタイトル、説明、画像を追加でき、テンプレートも利用可能です。
例えば、「ダークモードを切り替える機能」のタスクを作成します。
![](https://images.ctfassets.net/in6v9lxmm5c8/4lJAEf3HM7yK03kjiUV2ol/fee69b634807b2fd57d1f7e2a4557f9e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.23.21.png?q=50&fm=webp)

「Create & Start Task」でタスクを作成し、AIエージェントの作業を直ちに開始します。タスクは「TO DO」レーンに追加されます。
![](https://images.ctfassets.net/in6v9lxmm5c8/5E2yBjDMZ8H9fz4inehX4Z/da3c03b4cc179466dde42b87b61d51ec/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.32.43.png?q=50&fm=webp)

タスクをクリックして詳細画面から「Start」ボタンを押すと、作業が開始され「In Progress」レーンに移動します。AIエージェントとのやりとりはチャット形式で表示されます。作業は `Git Worktree` を使用して分離されたブランチで行われます。
**注意:** デフォルトでは `--dangerously-skip-permissions` オプション付きでエージェントが起動するため、隔離環境での実行が推奨されます。
![](https://images.ctfassets.net/in6v9lxmm5c8/2PY06ZO03D60bpTr6q1E8p/f16d429915fa6336123bdd95beb089d6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.30.29.png?q=50&fm=webp)

タスクが完了すると「Review」レーンに移動し、音声で通知されます。生成されたコードの差分を確認できます。
![](https://images.ctfassets.net/in6v9lxmm5c8/6nTlbwxPPR3NyvVXr3zF0P/efc0cbd8546c2eef81f75907eadda1ba/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.31.33.png?q=50&fm=webp)

修正が必要な場合は、チャットで再度指示を出すことができます。
![](https://images.ctfassets.net/in6v9lxmm5c8/6xNxCxdiTSyxpMt6nQb28l/7a0d91c013c1ffc3a07ae8c7fcedaafa/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.51.11.png?q=50&fm=webp)

差分確認後、エディタで開く、Rebase、プルリクエスト作成、マージなどの操作が可能です。「Merge」を実行すると...
![](https://images.ctfassets.net/in6v9lxmm5c8/6PrFQY7ZDmWxTgD1pKaPGA/5d2e8d70f18ff02c7d6a257088c994eb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.38.21.png?q=50&fm=webp)

Base Branchにマージされ、タスクは「Done」レーンに移動します。
![](https://images.ctfassets.net/in6v9lxmm5c8/6o51UULLWxmvg7T1rAubnF/0ad5f363a57008f92da6e5f1535b05b2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.52.46.png?q=50&fm=webp)

## Vibe Kanban の MCP サーバー

Vibe Kanban自体をMCPサーバーとして利用し、任意のAIエージェントからプロジェクトやタスクを管理できます。
例えば、Claude Desktopに以下の設定を追加します。

```json
{
  "mcpServers": {
    "vibe_kanban": {
      "command": "npx",
      "args": ["-y", "vibe-kanban", "--mcp"]
    }
  }
}
```

これにより、Claudeにプロンプトを送ることでVibe Kanban上のタスクを作成できます。
![](https://images.ctfassets.net/in6v9lxmm5c8/5VI0dVnm65thftzHSlzwNz/842e0d77e584e43f98a89e040e2c9400/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_17.09.40.png?q=50&fm=webp)

## まとめ

* Vibe KanbanはAIコーディングエージェントのタスク管理をカンバンUIで支援するツール。
* `npx vibe-kanban`で簡単に起動可能。
* プロジェクトとタスクを作成し、AIエージェントに作業を依頼できる。
* タスクの進捗はレーンで可視化され、完了したコードはレビュー後にマージできる。
* MCPサーバー機能により、他のAIエージェントとの連携も可能。

## 参考

* [Vibe Kanban](https://www.vibekanban.com/)
