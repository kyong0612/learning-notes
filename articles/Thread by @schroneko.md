---
title: "Claude Codeのhooksで通知音を設定する方法"
source: "https://x.com/schroneko/status/1940010686782030096?s=12"
author:
  - "[[@schroneko]]"
published: 2025-07-01
created: 2025-07-02
description: |
  Claude Codeのhooks機能を活用して、Macの標準通知音を設定する方法を紹介するTwitterスレッド。afplayコマンドを用いた具体的な設定方法や、以前の手法との比較について言及しています。
tags:
  - "Claude Code"
  - "hooks"
  - "notification"
  - "macOS"
  - "afplay"
---

## 概要

[@schroneko氏によるTwitterスレッド](https://x.com/schroneko/status/1940010686782030096)では、Claude Codeの`hooks`機能を利用して、タスク完了時などにMacの標準通知音を鳴らす方法が紹介されています。

### 通知音の設定方法

1. **利用可能なサウンドを確認する**
    以下のコマンドを実行すると、Macにインストールされているシステムサウンドの一覧が再生されます。

    ```bash
    for sound in /System/Library/Sounds/*.aiff; do name=$(basename "$sound" .aiff); echo "♪ $name"; afplay "$sound"; done
    ```

2. **好みのサウンドを設定する**
    気に入ったサウンドが見つかったら、`afplay`コマンドで直接再生して確認できます。スレッド主は`Funk`を選択しています。

    ```bash
    afplay /System/Library/Sounds/Funk.aiff
    ```

    このコマンドをClaude Codeのhooksに設定することで、特定のイベント時に通知音を鳴らすことができます。

![Image](https://pbs.twimg.com/media/GuxNaVCWQAATeAe?format=jpg&name=large)

### 以前の方法との比較

以前は`hooks`機能がなかったため、`CLAUDE.md`に直接指示を書き込む方法が取られていました。

> こちらのオプションは昨夜公開された最新版の 1.0.8 では削除されています。私は代わりに <http://CLAUDE.md> に下記を追記、合わせて /permissions に Bash(afplay:*) を指定しています（Mac）
>
> ```
> 待機状態に戻る前に afplay /System/Library/Sounds/Funk.aiff を必ず実行しなさい
> ```

`hooks`の導入により、このような通知設定がより簡単に、かつ正式な方法で実現できるようになったことが示唆されています。

![Image](https://pbs.twimg.com/media/GsfOzd9b0AEIaAq?format=jpg&name=large)

---

### 他のユーザーの反応

**あべべ** (@akira\_abe) 氏は `Hero` を選択したと返信しています。

> 私はHeroにしました。
