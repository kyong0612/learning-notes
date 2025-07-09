---
title: "職場のプロジェクトに必ず配置しちゃうMakefileの話"
source: "https://zenn.dev/loglass/articles/0016-make-makefile"
author:
  - "yasunori0418"
published: "2025-07-07"
created: "2025-07-09"
description: |
  プロジェクト開発におけるMakefileの活用法について解説しています。特に、タスクランナーとしての利用方法や、大量のタスクが存在する場合でも認知負荷を下げるためのドキュメント自動生成と整形テクニック（awkスクリプトの活用）に焦点を当てています。
tags:
  - "Makefile"
  - "awk"
  - "正規表現"
  - "PlatformEngineering"
  - "Zenn"
---

この記事は、プロジェクト開発における`Makefile`の活用方法、特にタスクランナーとしての利用と、多数のタスクの可読性を高めるためのドキュメント自動生成・整形について解説しています。

## 始めに

著者は自らを「環境構築オタク」と称し、開発プロジェクトに参加した際、より効率的な開発環境を目指して`Makefile`の改善に取り組みました。この記事では、その具体的な改善内容を紹介しています。

## タスクランナーとしてのMakefileとの出会い

`Makefile`は本来、C言語などのプロジェクトでビルドを自動化するツールですが、著者は過去のプロジェクトでタスクランナーとして利用されているのを見て、その考え方を取り入れるようになりました。以来、関連するプロジェクトには`Makefile`を導入しているとのことです。

## makeの各タスクに対するドキュメント自動生成

`Makefile`に多数のコマンドを定義すると、その一覧性が問題になります。この問題を解決するため、`Makefile`内に記述したコメントを収集し、`make help`コマンドでドキュメントを自動生成する方法が紹介されています。

```makefile
.DEFAULT_GOAL := help
.PHONY: help
help:
 @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

docker-up: ## Docker環境の構築
 @echo "docker compose up -d"

docker-down: ## Docker環境の終了
 @echo "docker compose down"
```

この方法で`make help`を実行すると、以下のように整形された出力が得られます。

![make help の実行結果](https://res.cloudinary.com/zenn/image/fetch/s--AKTEbffV--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/2a74d2bc3fe8c358c16ced7f.png%3Fsha%3Da9db04862bbaadc3c7e0ef2eee948f0ad09a842a)

### 大量に定義されたタスクは認知負荷を生み出す

しかし、タスクの数が非常に多くなると、たとえドキュメントが自動生成されても、一覧性が悪くなり「認知負荷が高い」状態になってしまいます。記事では100を超えるタスクが定義された例を挙げ、この問題点を指摘しています。

![非常に長いmakeタスクリスト](https://res.cloudinary.com/zenn/image/fetch/s--TwaUkjT7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/b35a170961dfd51a5a84b28d.png%3Fsha%3Dfa0a3c4e98f18a06c1c7b6e5950ca7971a270e7f)

### awkを使って整形

この認知負荷の問題を解決するため、`Makefile`内のグルーピング用コメント（例: `## 初期設定・環境構築 ##`）を活用し、`awk`スクリプトを使って出力をさらに整形する方法を提案しています。

まず、`help`タスクで使われている`grep`と`awk`のコマンドと正規表現を分かりやすく解説し、複雑に見えるコマンドも分解すれば怖くないことを示しています。

次に、グルーピングコメント（`## .* ##`）も`grep`の対象に含め、処理を外部の`awk`スクリプト (`help.awk`) に切り出すことで、`Makefile`をすっきりと保ちつつ、より見やすい出力を実現します。

```makefile
help:
 @grep -E -e '^[a-zA-Z_-]+:.*?## .*$$' -e '^## .* ##$$' $(MAKEFILE_LIST) \
  | ./help.awk | less -R
```

この改善により、`help`コマンドの出力は以下のようになり、タスクの役割が明確になり認知負荷が大幅に低減されます。

![awkで整形され読みやすくなったhelpの出力](https://res.cloudinary.com/zenn/image/fetch/s--E4k31CGN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/acb111a7bd602f08150e7cee.png%3Fsha%3D6f7e5aad2e1169cbbdc9b58f7b2843e398ba94cf)

## これってPlatform Engineeringなのでは…？

著者は、このような開発ツールの整理やドキュメント整備は、昨今注目されている「Platform Engineering」の活動に通じるものがあると考えています。開発チームが必要なツールを効率的に使えるように環境を整備することは、プロダクトがスケールする上で重要なコスト削減に繋がります。

## 最後に

この記事で紹介されたような開発環境の改善活動は、著者自身の「好き」から始まったものですが、それがチーム全体の開発効率向上に貢献しています。著者は、このような改善が歓迎される文化を持つログラス社に興味を持った方へ、カジュアル面談の案内をして締めくくっています。
