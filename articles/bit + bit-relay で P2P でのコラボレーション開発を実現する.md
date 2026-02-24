---
title: "bit + bit-relay で P2P でのコラボレーション開発を実現する"
source: "https://zenn.dev/mizchi/articles/decentrized-git-for-agents"
author:
  - "[[mizchi]]"
published: 2026-02-23
created: 2026-02-25
description: "GitHub を経由せずに P2P で集団開発を実現するツール「bit + bit-relay」の紹介。Git互換CLIであるbitと、NAT越しのリポジトリ共有を可能にするリレーサーバーbit-relayを組み合わせ、分散型のIssue/PR管理やAIエージェントオーケストレーションを実現する。"
tags:
  - "clippings"
  - "Git"
  - "P2P"
  - "MoonBit"
  - "AI-Agent"
  - "分散開発"
---

## 概要

GitHub 抜きで集団開発するためのツール「bit + bit-relay」の紹介記事。主に人間と AI による利用を想定している。

- **bit**: Git 互換の CLI ツール+α（Git 本体の 25,000 件の e2e テストを通過）
- **bit-relay**: P2P の中継サーバーを経由して、GitHub なしに `bit clone` / `bit push` を実現
- bit のストレージとして **issue と PR ストレージを内蔵**し、GitHub 経由せずに PR 相当のことが可能

リポジトリ:
- [bit-vcs/bit](https://github.com/bit-vcs/bit)
- [bit-vcs/bit-relay](https://github.com/bit-vcs/bit-relay)

---

## 基本的な使い方

### ホスト側（リポジトリを公開する）

```bash
cd <your-project>
bit relay serve relay+https://bit-relay.mizchi.workers.dev
# => Session registered: qrcBUqKP
# => Clone URL: relay+https://bit-relay.mizchi.workers.dev/qrcBUqKP
```

### 利用者側（cloneする）

```bash
bit clone relay+https://bit-relay.mizchi.workers.dev/qrcBUqKP local-project
```

> **注意**: この通信は `bit serve` している他の参加者にも閲覧可能なので、公開しても大丈夫な OSS を想定。

---

## インストール

```bash
# シェルスクリプト（Mac/Linux）
curl -fsSL https://raw.githubusercontent.com/bit-vcs/bit/main/install.sh | bash

# MoonBit パッケージマネージャ
moon install mizchi/bit/cmd/bit
```

---

## コラボレーションワークフロー

### 1. リポジトリを作って issue を共有する

```bash
mkdir my-project && cd my-project
bit init
echo "# My Project" > README.md
bit add . && bit commit -m "initial commit"

# issue トラッキングを初期化 & issue 作成
bit issue init
bit issue create -t "ログインページでクラッシュする" -b "特殊文字入力時に発生"

# relay に issue を push
bit relay sync push relay+https://bit-relay.mizchi.workers.dev
```

### 2. relay 経由でリポジトリを公開

```bash
bit relay serve relay+https://bit-relay.mizchi.workers.dev
# => Clone URL: relay+https://bit-relay.mizchi.workers.dev/AbCdEfGh
```

### 3. 相手が clone して issue を取得

```bash
bit clone relay+https://bit-relay.mizchi.workers.dev/AbCdEfGh myapp
cd myapp
bit issue init
bit relay sync fetch relay+https://bit-relay.mizchi.workers.dev
bit issue list
```

これだけで **GitHub なしにリポジトリと issue を共有**できる。

---

## アーキテクチャと設計思想

### 分散型の Issue/PR 管理

| 従来（GitHub） | bit |
|---|---|
| Issue/PR は GitHub サーバー上に保存 | リポジトリ内部に Git notes（`refs/notes/bit-hub`）として保存 |
| 特定のホスティングに依存 | `bit issue init` で任意の git リポジトリに初期化可能 |
| 中央サーバー必須 | 中央サーバーなしにピア間で同期可能 |

### bit-relay — リレーサーバーの役割

bit-relay は 2 つの問題を解決する軽量リレーサーバー:

1. **hub メタデータの同期**: `bit relay sync push/fetch` で issue/PR を relay 経由で配信・取得
2. **NAT/ファイアウォール越しのリポジトリ共有**: `bit relay serve` でローカルリポジトリを公開。ポート開放不要

データ転送の分離:
- **コード**（blob/tree/commit）→ `serve` / `clone` で転送
- **hub メタデータ**（issue/PR）→ `sync push` / `sync fetch` で転送

デフォルトの relay は公開インスタンス（`bit-relay.mizchi.workers.dev`）を使用。独自デプロイも可能。分散環境では、`bit relay serve` しているピア全員から**分散 KV として git/objects を要求**できる。

---

## bit + bit-relay が必要な理由

Git プロトコルは本来分散ストレージとして設計されているが、GitHub が事実上の権威サーバーとなっている。これは安定ブランチの選択には便利だが、**AI Agent の高速な生産性を前提とした開発サイクルとは噛み合わない**。

### 想定するワークフロー

> 自律的な AI エージェントが bit プロトコルを前提に開発ノードに参加し、変更を broadcast して、各自が勝手に取り入れる — これが本来の分散ストレージとしての Git の姿。

- `bit relay serve` 中に P2P で変更された内容は、ノード間で `.git/objects` と `refs/relay/incoming/...` に自動保存（受け入れサイズ上限あり）
- ユーザーや AI はローカルで好きな変更を cherry-pick すればよい
- 最も有用なブランチが事実上の fast-forward として扱える（ブロックチェーン的モデル）

### 著者の立場

> bit の作者としては、非中央集権であることに政治的な主張はない。ただ、開発ワークフローとしてそこに技術優位があると思っているだけだ。

最終的には P2P で開発されたものは GitHub に sync されるのが運用上楽であり、揮発性の P2P キャッシュはストレージとして信頼性に欠けると認識している。

---

## 現状の制限事項と今後の課題

現状は**趣味レベルの PoC** として開発中。以下が不足している:

- AI にこのサイクルを理解させるためのプロンプト
- リレーサーバーが数日間キャッシュを持ってバックアップする機能
- クローズドなローカルホストリレー
- GitHub と PR/issue を共有する仕組み
- 複数のリレーサーバー間の同期
- Git との完全な互換を保証するための手数
- SDK やドキュメント
- エージェントクラスター運用の知見

開発者/スポンサーを募集中。連絡先: [https://x.com/mizchi](https://x.com/mizchi)
