---
title: "Claude Code くんのホームディレクトリ破壊を AppArmor で阻止する"
source: "https://blog.3qe.us/entry/2025/07/05/001037"
author:
  - "Windymelt"
published: 2025-07-05
created: 2025-07-09
description: |
  AIエージェントの意図しない操作によるホームディレクトリ破壊のリスクに対し、Linuxの強制アクセス制御機能であるAppArmorを用いて、特定のアプリケーション（Claude Code）のアクセス権限をプロジェクトディレクトリ内に制限する方法を解説します。
tags:
  - "技術"
  - "AI"
  - "AppArmor"
  - "Linux"
  - "Security"
---

AIエージェントが意図せずユーザーのホームディレクトリを破壊してしまうという事例が報告されました。このようなリスクに対し、コンテナのような大掛かりな仕組みを使わずに、Linuxの標準的な強制アクセス制御（MAC）機能である **AppArmor** を利用して対策する方法を紹介します。

AppArmorを使うことで、特定のアプリケーション（ここでは `claude` コマンド）がアクセスできるファイルやディレクトリを厳密に制限し、プロジェクトディレクトリ内でのみ活動できるようにします。

## AppArmorとは

AppArmorは、アプリケーションごとにセキュリティプロファイルを定義し、そのプロファイルに基づいてファイルへの読み書きや実行といった操作を制限するLinuxのセキュリティモジュールです。多くのLinuxディストリビューションに標準で搭載されています。

## AppArmorによるアクセス制御の手順

### 1. プロファイルの生成

まず、`aa-genprof` コマンドを使って、対象アプリケーションの動作を監視し、基本的なプロファイルの雛形を生成します。

```sh
sudo aa-genprof $(which claude)
```

このコマンドを実行した状態で、別のターミナルで `claude` コマンドを普段通りに操作します。操作が完了したら、`aa-genprof` のプロンプトで `(S)can` を選択し、ログをスキャンしてプロファイルを生成します。

### 2. プロファイルの修正

生成されたプロファイル（例: `/etc/apparmor.d/home.windymelt..local.share.pnpm.claude`）を編集し、アクセス権限を厳格化します。

以下は、プロジェクトディレクトリ（`/home/windymelt/自分の/プロジェクト/`）への読み書き実行と、その他必要最低限のアクセスのみを許可するプロファイルの例です。プロファイル名は `my-project-claude` に変更しています。

```
# Last Modified: Fri Jul  4 hh:mm:ss 2025
abi <abi/4.0>,

include <tunables/global>

profile my-project-claude {
  include <abstractions/base>
  include <abstractions/bash>
  include <abstractions/consoles>

  # 必要な設定ファイルやバイナリへの読み込み/実行権限
  /etc/nsswitch.conf r,
  /home/windymelt/.claude.json rw,
  /home/windymelt/.claude/** rwix,
  /home/windymelt/.local/share/mise/installs/node/22.13.1/bin/node rix,
  /home/windymelt/.local/share/pnpm/claude rix,
  /home/windymelt/.local/share/pnpm/global/5/.pnpm/** r,
  /home/windymelt/.config/gcloud/application_default_credentials.json r,
  /proc/version r,
  /run/systemd/resolve/resolv.conf r,
  /usr/bin/** rix,
  owner /proc/*/cgroup r,
  network tcp,

  # プロジェクトディレクトリへの読み書き実行を許可
  /home/windymelt/自分の/プロジェクト/ rw,
  /home/windymelt/自分の/プロジェクト/** rwix,
}
```

プロファイルを修正したら、以下のコマンドで再読み込みします。

```sh
sudo apparmor_parser -r /etc/apparmor.d/home.windymelt..local.share.pnpm.claude
```

### 3. プロファイルを指定して起動

`aa-exec` コマンドを使い、作成したプロファイルを指定して `claude` を起動します。

```sh
aa-exec -p my-project-claude -- claude
```

この方法で起動すると、`claude` はプロファイルで許可された範囲外のファイルシステムへの書き込みアクセスがブロックされるようになります。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/W/Windymelt/20250704/20250704215613.png)

## トラブルシューティング

プロファイルが原因でアプリケーションが正常に動作しない場合は、`sudo aa-logprof` コマンドで拒否されたアクセスのログを確認し、対話的にプロファイルを修正できます。また、詳細な拒否ログは `/var/log/audit/audit.log` に記録されます。

## まとめ

この記事では、AppArmorを利用してClaude Codeエージェントに強制アクセス制御を適用し、意図しないファイル破壊のリスクを低減する方法を示しました。この手法により、エージェントの活動範囲を安全なディレクトリ内に限定できます。
