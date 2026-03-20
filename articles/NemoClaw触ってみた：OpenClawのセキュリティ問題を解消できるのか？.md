---
title: "NemoClaw触ってみた：OpenClawのセキュリティ問題を解消できるのか？"
source: "https://zenn.dev/komlock_lab/articles/280ff7f1ba9b13"
author:
  - "[[阿部 (@takupeso)]]"
  - "[[Komlock lab]]"
published: 2026-03-17
created: 2026-03-20
description: "NVIDIAがGTC 2026で発表したNemoClawを実際にインストールし、OpenClawのセキュリティ・プライバシー課題（秘匿情報の漏洩リスク、権限管理の欠如）を解決できるか検証した記事。ファイルシステム隔離、アプリケーション単位のネットワーク制御、YAML宣言的ポリシー管理といったカーネルレベルのセキュリティ機構を実際の動作で確認している。"
tags:
  - "clippings"
  - "AI"
  - "Security"
  - "Agent"
  - "OpenClaw"
  - "NemoClaw"
  - "NVIDIA"
  - "サンドボックス"
---

## NemoClawとは

NVIDIAがGTC 2026（2026年3月16日）で発表した、**OpenClawにセキュリティ・プライバシー層を追加するオープンソーススタック**。OpenClawの競合ではなく、NemoClawがOpenClawを包む構造。

### 3層構成

```
OpenShell（汎用サンドボックス基盤）
  └── NemoClaw（OpenClaw専用プラグイン）
        └── OpenClaw（エージェント）
```

| 構成要素 | 役割 |
|---|---|
| **OpenClaw** | サンドボックス内で動くエージェント本体 |
| **NemoClaw** | OpenClawをOpenShell上で動かすためのプラグイン。サンドボックス作成・ポリシー適用・推論ルーティング設定をラップ |
| **OpenShell** | NVIDIA開発の汎用サンドボックスランタイム。AIエージェントをLinuxコンテナで隔離し、ファイルシステム・ネットワーク・プロセスを宣言的ポリシーで制御。OpenClaw専用ではなく他のAIエージェントにも使える |

### コマンド体系

| コマンド | 用途 |
|---|---|
| `openshell` | サンドボックス基盤の操作（`sandbox create`, `policy set`, `gateway start` 等） |
| `nemoclaw` | OpenClaw向けにopenshellの操作をラップ（`onboard` で一括セットアップ等） |
| `openclaw nemoclaw` | OpenClaw内からNemoClawプラグインを呼ぶ（`launch`, `status`, `logs`） |

### 動作の流れ

1. OpenClawのLLMリクエストはサンドボックスから直接外に出ない → **ゲートウェイがインターセプトし、APIキーを付与して外部LLM APIに転送**。サンドボックス内にAPIキーは存在しない
2. サンドボックス内でOpenClawが動作。ファイルシステムとネットワークはポリシーで制限
3. NemoClaw CLIがOpenShellゲートウェイを起動し、サンドボックスを作成

### セキュリティの仕組み（4層構造）

| 層 | 守る対象 | 技術 |
|---|---|---|
| ファイルシステム | 許可パス以外への読み書き防止 | **Landlock LSM**（Linuxカーネルモジュール） |
| ネットワーク | 許可リスト外への通信ブロック | **egress proxy + アプリケーション単位制御** |
| プロセス | 権限昇格・危険なシステムコール防止 | **seccomp + コンテナ隔離** |
| 推論 | モデルAPIの呼び出し経路制御 | **ゲートウェイ経由ルーティング** |

> **重要**: これらは**カーネル層で強制**されている。OpenClawの`tools.deny`のようなアプリ設定とは根本的に防御レベルが異なる。

---

## 検証環境と検証結果

### セットアップ

| 項目 | 詳細 |
|---|---|
| ハードウェア | Mac mini M2 |
| ランタイム | Docker（CPU 4コア、メモリ8GB、ディスク30GB） |
| OpenShell | 0.0.6 |
| OpenClaw | 2026.3.11 |
| NemoClaw | 0.1.0（Alpha） |

```bash
git clone https://github.com/NVIDIA/NemoClaw.git
cd NemoClaw
./install.sh  # OpenShellインストール + nemoclaw onboardウィザード
nemoclaw my-assistant connect  # サンドボックスに接続
```

- `install.sh`実行後、ゲートウェイ起動・サンドボックス作成・ポリシー適用・推論プロバイダー設定が一括で行われる
- 推論プロバイダーはNVIDIA Cloud API（APIキー必要）またはOllama（ローカル推論）を選択可能
- サンドボックスは「**全閉→必要な穴だけ開ける**」設計（deny by default）

### 検証1: ファイルシステム隔離

素のOpenClawではホームディレクトリ以下のファイル（`~/.ssh/id_rsa`等）が丸見え。NemoClaw環境ではホストのファイルシステムに一切アクセス不可。

| パス | アクセス権 |
|---|---|
| `/sandbox`, `/tmp`, `/dev/null` | 読み書き可 |
| `/usr`, `/lib`, `/proc`, `/app`, `/etc`, `/var/log` | 読み取りのみ |
| それ以外 | **アクセス不可** |

```bash
touch /sandbox/test.txt    # ✅ 書き込みOK
touch /tmp/test.txt        # ✅ 書き込みOK
touch /usr/test.txt        # ❌ Permission denied
cat /etc/hostname          # ✅ 読めるがコンテナ内のファイル（ホストの/etcではない）
whoami                     # sandbox（root権限なし）
```

ホストとのファイルやりとりは `openshell sandbox upload`/`download` コマンド経由のみ。

### 検証2: ネットワーク制御

NemoClaw環境は**deny by default**。すべての外部通信がブロックされ、ポリシーで「どのアプリケーションが、どのホストに通信できるか」を宣言的に許可する。

```bash
curl https://google.com              # ❌ 403 CONNECT blocked
curl https://api.github.com/zen      # ❌ 403（github.comは許可ホストだがcurlは許可アプリではない）
git ls-remote https://github.com/NVIDIA/NemoClaw  # ✅ 成功
```

**同じホストでもアプリケーション単位で制御される**のが特徴。`curl`で勝手にデータを外部送信することが不可能。プロンプトインジェクションで「ファイル内容を外部サーバーにPOSTして」と指示されても`curl`がブロックされているため実行不可能。

### ポリシーファイル（YAML宣言的管理）

```yaml
# ファイルシステム制御
filesystem_policy:
  include_workdir: true
  read_only: [/usr, /lib, /proc, /app, /etc, /var/log]
  read_write: [/sandbox, /tmp, /dev/null]

landlock:
  compatibility: best_effort

process:
  run_as_user: sandbox
  run_as_group: sandbox

# ネットワーク制御（アプリケーション×ホストの組み合わせ）
network_policies:
  claude_code:
    endpoints:
      - { host: api.anthropic.com, port: 443, protocol: rest, tls: terminate }
    binaries:
      - { path: /usr/local/bin/claude }
  github:
    endpoints:
      - { host: github.com, port: 443 }
      - { host: api.github.com, port: 443 }
    binaries:
      - { path: /usr/bin/gh }
      - { path: /usr/bin/git }
  telegram:
    endpoints:
      - host: api.telegram.org
        port: 443
        rules:
          - allow: { method: GET, path: "/bot*/**" }
          - allow: { method: POST, path: "/bot*/**" }
```

---

## 素のOpenClaw vs NemoClaw

| 観点 | 素のOpenClaw | NemoClaw |
|---|---|---|
| 自由度 | 高い（何でもできる） | 制限あり（curl不可、検索制限等） |
| セキュリティ | アプリ層の制御のみ | カーネル層の3層隔離 |
| 適用場面 | 機密データなしの個人利用 | 機密データあり・業務利用・企業導入 |
| 運用 | 手軽 | ポリシーをGitOpsで管理可能 |

### 判断基準

- **企業導入** → NemoClawは事実上必須
- **機密データありor業務利用** → NemoClaw検討
- **機密データなしの個人利用** → 素のOpenClawで十分

> 現実解: 「普段使いの素のOpenClaw」と「機密タスク用のNemoClaw」を分けて運用する

---

## 評価と課題

### 良い点

- **ポリシーのホットリロード**: サンドボックスを再起動せずにポリシーを更新可能
- **YAML宣言的ポリシー**: チームで共有・バージョン管理・レビューが可能
- **アプリケーション単位のネットワーク制御**: 同じホストでもアプリによって許可/拒否を分けられる
- **3層隔離**: ファイルシステム（Landlock LSM）、ネットワーク（アプリ単位制御）、プロセス（コンテナ隔離）のすべてが有効に機能

### 課題（Alpha段階）

- **ドキュメントの薄さ**: エラーメッセージも分かりにくい箇所あり。コミュニティもまだ小さく、トラブル時はソースを読む場面が出てくる
- **既存環境への後付け不可**: 既にホストで動いているOpenClawをそのままNemoClaw化できない。新規サンドボックスを作りその中にOpenClawをインストールする構造。設定やエージェント定義の移行は手動
- **メッセージング連携**: Telegram Bridgeには対応。Discord連携はAlpha版時点でドキュメント未記載（OpenClaw自体はDiscord対応のため動作する可能性あるが未検証）

---

## まとめ

NemoClawはOpenClawの「何でもできてしまう」問題に、**カーネルレベルの隔離**と**アプリケーション単位のネットワーク制御**で応えている。Alpha段階で荒削りな部分はあるものの、エージェントセキュリティの方向性としては筋が良い。

「エージェントが勝手に外部にデータを送らないことを証明できますか？」という問いに、ポリシーファイルを見せて「deny by defaultで、この許可リスト以外は通信できません」と答えられるのは大きな価値。

### 関連リンク

- [NemoClaw GitHub](https://github.com/NVIDIA/NemoClaw)
- [OpenShell GitHub](https://github.com/NVIDIA/OpenShell)
- [NVIDIA NemoClaw公式ページ](https://www.nvidia.com/en-us/ai/nemoclaw/)
- [NVIDIAプレスリリース](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw)
- [GTC 2026 Keynote](https://www.nvidia.com/gtc/keynote/)