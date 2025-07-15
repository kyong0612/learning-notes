---
title: "セキュアな社内Dify運用と外部連携の両立 ~AIによるAPIリスク評価~"
source: "https://speakerdeck.com/zozotech/dify-internal-ops-external-connect"
author:
  - "土田 悠輝 (株式会社ZOZO)"
published: 2025-07-11
created: 2025-07-15
description: |
  株式会社ZOZOにおける、LLMアプリケーション開発プラットフォーム「Dify」の社内利用事例。データ分析などで活用する一方、APIを外部（Slack, GAS等）から利用したいというニーズから、社外秘情報が漏洩するリスクが浮上。この課題に対し、Difyのワークフロー自体を別のAIワークフローで定期的に監査し、情報漏洩リスクを自動検知・通知する仕組みを構築した事例を紹介する。
tags:
  - "Dify"
  - "AI"
  - "Security"
  - "SRE"
  - "API"
  - "ZOZO"
---

## 概要

本資料は、SRE NEXT 2025で株式会社ZOZOの土田 悠輝氏が発表した、LLMアプリケーション開発プラットフォーム「Dify」のセキュアな社内運用に関するプレゼンテーションです。Difyを社内データ分析に活用する中で、外部サービスとの連携ニーズが高まった際のセキュリティリスク（情報漏洩）に対し、AIを用いてDifyのワークフローを自動監査する仕組みを構築した事例を解説しています。

---

## 発表資料まとめ

### スライド 1: タイトル

![セキュアな社内Dify運用と外部連携の両立 ~AIによるAPIリスク評価~](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_0.jpg)

**セキュアな社内Dify運用と外部連携の両立 ~AIによるAPIリスク評価~**

- **発表者**: 土田 悠輝
- **所属**: 株式会社ZOZO 計測プラットフォーム開発本部 計測システム部 SREブロック

---

### スライド 2: 自己紹介

![自己紹介](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_1.jpg)

SREとして、ZOZOMETRYやZOZOMAT等の計測技術を用いたプロダクトの開発・運用に従事。最近ハマっているAIツールはClaude Code。

---

### スライド 3: ZOZOにおける生成AI活用

![ZOZOにおける生成AI活用](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_2.jpg)

ZOZOでは生成AI活用を全社的に推進しており、その一環としてGitHub Copilotを全社導入しています。

- **参考リンク**: [GitHub Copilotの全社導入とその効果](https://techblog.zozo.com/entry/introducing_github_copilot)

---

### スライド 4: Difyの試験導入

![Difyの試験導入](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_3.jpg)

各部署で様々な生成AIツールの試験導入・検証を実施。計測システム部では、LLMアプリ開発プラットフォームであるDify (<https://claude.ai/>) を導入。

---

### スライド 5: Difyの活用と構成

![Difyの活用と構成](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_4.jpg)

Difyを用いて、各種データの分析などを行っています。

---

### スライド 6: 運用上の課題

![運用上の課題](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_5.jpg)

運用を続けていく中で、新たなニーズが発生しました。

---

### スライド 7: 外部連携のニーズ

![外部連携のニーズ](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_6.jpg)

「SlackやGoogle Apps Script (GAS) からDifyのAPIをトリガーしたい」という要望が上がりました。

---

### スライド 8: セキュリティリスク

![セキュリティリスク](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_7.jpg)

DifyのAPIをインターネットに公開すると、社外秘情報をレスポンスしてしまうリスクが懸念されます。

---

### スライド 9: 対策アプローチ

![対策アプローチ](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_8.jpg)

対策として、Difyで作成されたワークフローの回答に情報漏洩リスクがないかを、別のDifyワークフローで定期的に監査する仕組みを考案しました。

---

### スライド 10: Dify DSL セキュリティチェック構成

![Dify DSL セキュリティチェック構成](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_9.jpg)

セキュリティチェックの全体構成図です。

---

### スライド 11: セキュリティチェックのフロー

![セキュリティチェックのフロー](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_10.jpg)

1. 監査対象のDifyワークフローからDSL（定義体）を取得します。
2. 取得したDSLを、セキュリティチェック専用のDifyワークフローに渡してキックします。

---

### スライド 12: セキュリティチェック用Difyワークフロー

![セキュリティチェック用Difyワークフロー](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_11.jpg)

これがセキュリティチェックを行うDifyワークフローの内部構造です。DSLを分析し、リスクを判定します。

---

### スライド 13: リスク検知時のSlack通知

![リスク検知時のSlack通知](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_12.jpg)

リスクが検知された場合、Slackに自動で通知が送られ、開発者が迅速に対応できる体制を整えています。

---

### スライド 14: まとめ

![まとめ](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_13.jpg)

AI活用事例として、AIツール（Dify）導入の障壁（セキュリティリスク）を、別のAI（Difyワークフロー）で乗り越えるというアプローチを紹介しました。

---

### スライド 15: (質疑応答など)

![None](https://files.speakerdeck.com/presentations/8c0c4ddd1daa4dd9948409b1ff0fb908/slide_14.jpg)
