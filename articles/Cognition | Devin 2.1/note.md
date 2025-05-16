---
title: "Cognition | Devin 2.1"
source: "https://cognition.ai/blog/devin-2-1"
author:
  - "The Cognition Team"
published: 2025-05-15
created: 2025-05-16
description: |
  Devin 2.1 の主な変更点を紹介。タスク完了の自信度を🟢🟡🔴で報告し、大規模コードベースでの成功率を向上させるためのコードベースコンテキスト機能を強化。Linear および Jira との連携もアップグレード。
tags:
  - "Devin"
  - "AI agent"
  - "software development"
  - "confidence score"
  - "codebase intelligence"
---
[Devin 2.0 is now available](https://app.devin.ai/)

[/blog](https://cognition.ai/blog)

## Devin 2.1

**発行日:** 2025年5月15日
**著者:** The Cognition Team

Devin (または他のコーディングエージェント) がタスクを成功させるかどうかの判断は難しい場合があります。特に、Devin の現在の能力を超えるタスクや、詳細が不足している初期プロンプトは、時間と ACU (Agent Compute Units) の無駄につながることがあります。

Devin 2.1 ではこれらの問題に対処するための大幅な変更が加えられました。Devin はタスク完了の自信度を 🟢 🟡 🔴 で報告するようになり、より優れたコードベースコンテキスト 🧠 によって大規模なコードベースでの成功率が向上しました。これらのアップグレードは [Linear](https://docs.devin.ai/integrations/linear) および [Jira](https://docs.devin.ai/integrations/jira) 連携にも追加されています。

### **自信度評価 (Confidence Ratings)**

![](https://cdn.sanity.io/images/2mc9cv2v/production/0961dbbf9f925ddd62b1e188205935f858a88040-3840x2160.png?w=1600&fit=max&auto=format)

Devin はセッションの複数ポイントでアプローチに対する自信度を表明します。

* セッション開始時
* プラン作成後
* コードに関する質問への回答時

Devin の自信度が 🟢 でない場合、理解を深めスコアを上げるために明確化のための質問をします。開発者はガイダンスを提供したり、Devin の質問に答えることで自信度を高めることができます。

自信度スコアはタスクの成功と高い相関があり、🟢 スコアは 🔴 スコアと比較してマージされたPRの可能性が2倍になることがわかっています。

<video src="https://cdn.sanity.io/files/2mc9cv2v/production/6703c05bdf96731dbb62b811d5582237082c90bc.mp4" controls=""></video>

#### **課題に対する自動自信度評価**

Linear および Jira 連携経由で Devin を使用する場合、複数の課題に対する自信度スコアを一度に簡単にリクエストできます。これは実際の Devin セッションを開始せずに行われるため、好きなだけ多くの課題をスコアリングし、最も自信度の高い課題のみを Devin に処理させることができます。

設定で、Devin が作成時にすべての課題を自動的にスキャンするように構成できます。

<video src="https://cdn.sanity.io/files/2mc9cv2v/production/6bf25915c76df24a972733ae8f50d8de81b80c2f.mp4" controls=""></video>

### **組み込みのコードベースインテリジェンス (Built-in Codebase Intelligence)**

[DeepWiki](https://deepwiki.com/) を強化しているのと同じコードベース理解能力が Devin に組み込まれました。タスクの任意の時点で、コードに関する質問をしたり、実装に関する明確化を求めたり、フォローアップを依頼したりすると、Devin はコードベースのスニペットに基づいた応答を提供します。

*Devin は質問に答えるためにコードベースをスキャンすべきタイミングを自動検出しますが、`!ask` を使用してトリガーすることもできます。*

![](https://cdn.sanity.io/images/2mc9cv2v/production/fced705e868996af468c0f396040e0f04fb6a3d0-3840x2160.png?w=1600&fit=max&auto=format)

### **計画確認の簡素化 (Plan Confirmation Simplification)**

Devin は自身の自信度を認識するようになったため、プランに確信が持てない場合はユーザーの承認を待ちます。そうでない場合は自動的に進行し、非同期のフィードバックを受け入れます。

> **注記:** Devin が自動的にプランを進行するかどうかを制御する設定は非推奨になります。計画プロセスは引き続きユーザー入力で制御できます。Devin に承認を待つように指示するか、計画確認に関するデフォルト設定を表現するナレッジを追加してください。

### **利用開始 (Get started)**

Devin 2.1 は本日より [app.devin.ai](https://app.devin.ai/) で利用開始できます。

[Devin Enterprise](https://devin.ai/enterprise) の詳細については、[こちら](https://cognition.ai/get-started#company)から営業チームにお問い合わせください。

---

### **採用情報 (Join us)**

Cognition のチームは少数精鋭です。創業チームは IOI (国際情報オリンピック) の金メダルを10個獲得しており、Cursor、Scale AI、Lunchclub、Modal、Google DeepMind、Waymo、Nuro といった企業で応用AIの最前線で活躍してきたリーダーやビルダーが含まれています。

Devin の構築は最初のステップに過ぎず、最も困難な課題はまだ先にあります。世界最大の課題解決に興奮し、推論できるAIを構築することに興味がある場合は、チームの詳細を確認し、以下のいずれかの役職に応募してください。

## Open-positions

Engineering

* [Product Engineer](https://jobs.ashbyhq.com/cognition/e42601bd-a92a-46f5-8485-f3ced1287384)
 San Francisco Bay Area Full time
* [Developer Relations Engineer](https://jobs.ashbyhq.com/cognition/06b70721-1bb5-4982-bb43-d71c62fab963)
 San Francisco Bay Area Full time
* [Machine Learning Researcher](https://jobs.ashbyhq.com/cognition/72d3db28-07d3-4c28-b49f-1bdf6e8e0f10)
 San Francisco Bay Area Full time
* [Software Engineer](https://jobs.ashbyhq.com/cognition/e8086415-62bc-4cc0-96a4-84bb56182d35)
 San Francisco Bay Area Full time
* [GTM Engineer](https://jobs.ashbyhq.com/cognition/d14d0312-e619-4ea6-ab80-e2546e7b2481)
 San Francisco Bay Area Full time

General

* [GTM Manager](https://jobs.ashbyhq.com/cognition/f2e1096f-72c4-42c8-867e-51c2ebc296f9)
 San Francisco Bay Area Full time
* [General Application](https://jobs.ashbyhq.com/cognition/4841bda0-057a-4471-801f-70309c3c02d5)
 San Francisco Bay Area Full time
