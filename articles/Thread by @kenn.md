---
title: "Thread by @kenn"
source: "https://x.com/kenn/status/1940044829721075937?s=12"
author:
  - "Kenn Ejima"
published: 2025-07-01
created: 2025-07-02
description: |
  Claude Code Hooksのアイデアとして、Stopイベントにランダムなサウンドを再生するシェルスクリプトを提案するツイート。
tags:
  - "clippings"
  - "Claude Code"
  - "hooks"
  - "shell-script"
---
**Kenn Ejima** @kenn [2025-07-01](https://x.com/kenn/status/1940044829721075937)

我々が本当に欲しかったもの：Claude Code Hooks

sounds=(/System/Library/Sounds/\*.aiff); afplay "${sounds\[RANDOM % ${#sounds\[@\]}\]}"

これをStopイベントにつけると吉

![Image](https://pbs.twimg.com/media/GuxsHRNXAAEcChr?format=jpg&name=large)
