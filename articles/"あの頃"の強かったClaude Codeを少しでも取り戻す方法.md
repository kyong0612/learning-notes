---
title: "\"あの頃\"の強かったClaude Codeを少しでも取り戻す方法"
source: "https://zenn.dev/discus0434/scraps/e0b1a0aa5406eb"
author:
  - "動詞"
created: 2024-08-28
description: |
  みなさんが最近Claude Codeの性能劣化を嘆いているのをよく観測するので、できる限り劣化を防ぐために自分がとった行動を記載してみる。
tags:
  - clippings
  - ClaudeCode
  - AI
---
みなさんが最近Claude Codeの性能劣化を嘆いているのをよく観測するので、できる限り劣化を防ぐために自分がとった行動を記載してみる。

## Micro Compactを無効にする

LLMは基本的にコンテキストが伸びるほど推論コストが重くなり、LLMプロバイダーにとって負担となる。

そのため、どのバージョンからかClaude Codeは、コンテキスト上限に達する前から、過去参照したファイルの内容やツール使用のログを要約するようになった模様。  
直接的な健忘の原因っぽそう。

詳細はこちらのツイートを参照。

`DISABLE_MICROCOMPACT=1` で無効にできる。

## IDEとの統合をやめる

IDEとClaude Codeとの連携によって無駄なコンテキストが注入されるのを防ぐ。  
ただし、UXに大きく関わるのでやったほうがいいかどうかは人による。

IDEのExtensionからClaude Code関連の拡張機能をアンインストールした後、以下のコマンドでClaude Code側のIDEに関わる機能を停止する。

```bash
CLAUDE_CODE_AUTO_CONNECT_IDE=0
CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL=1
CLAUDE_CODE_IDE_SKIP_VALID_CHECK=1
```

## オートアップデートを停止する、その他

オートアップデートを無効にする。  
その他、無駄なトラフィックやテレメトリーなどをまとめて停止しておく。

```bash
DISABLE_AUTOUPDATER=1
CLAUDE_CODE_ENABLE_TELEMETRY=0
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
DISABLE_ERROR_REPORTING=1
DISABLE_TELEMETRY=1
```

---

ここまでで書いた設定をまとめて `~/.claude/settings.json` に書き込む場合はこうなる。

```json
{
    "env": {
        "CLAUDE_CODE_AUTO_CONNECT_IDE": false,
        "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL": true,
        "CLAUDE_CODE_IDE_SKIP_VALID_CHECK": true,
        "CLAUDE_CODE_ENABLE_TELEMETRY": false,
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": true,
        "DISABLE_ERROR_REPORTING": true,
        "DISABLE_TELEMETRY": true,
        "DISABLE_AUTOUPDATER": true,
        "DISABLE_MICROCOMPACT": true
    }
}
```

## Claude Codeのバージョンを下げる

最近追加された機能を使えなくなるのでちょっとアレだが、もっとも間違いない方法。

```bash
# 今入っているClaude Codeをアンインストール
npm uninstall @anthropic-ai/claude-code -g
# Claude Codeを適当な古いバージョンに変更（1.0.60以前が好ましい気がする）
npm install @anthropic-ai/claude-code@1.0.24 -g
# Claude Codeのオートアップデートを停止
claude config set -g autoUpdaterStatus disabled
```

バージョンを下げても `/model claude-opus-4-1-20250805` でOpus 4.1は使える模様。

`claude config set -g autoUpdaterStatus disabled` ではなく、 `claude config set -g autoUpdates disabled` だと思います。（重箱の隅をつつくようですみません 🙏）

コメントありがとうございます！  
例として紹介しているダウングレード先のv1.0.24の時点では、キーはautoUpdaterStatusで合っていたかと思います！  
ご指摘の通り、その後のバージョンからはautoUpdatesという名前に変わっていますね。

あっ、そうなんですね！こちらの認識不足ですみません....  
ご丁寧にありがとうございます！ 🙏（なお当方は1.0.33へのダウングレードを実施）

スクラップにコメントを追加  

[コミュニティガイドライン](https://zenn.dev/guideline) に則った投稿をしましょう。
