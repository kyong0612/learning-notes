---
title: "Everyone is building a software factory - exe.dev blog"
source: "https://blog.exe.dev/bones-of-the-software-factory"
author:
  - "[[exe.dev]]"
published: 2026-03-27
created: 2026-04-01
description: "エージェントツール時代において、組織がソフトウェアを生産するワークフローは人それぞれ異なり、単一の解を押し付けるべきではない。鍵となるのは、豊富で高性能かつ即座にプロビジョニング可能なVMというコンピュートプリミティブであり、それを基盤にチームが自由にエージェント・自動化・ワークフローを実験・進化させることが『ソフトウェアファクトリー』の骨格を形成するという主張。"
tags:
  - "clippings"
  - "Software Factory"
  - "Agentic Development"
  - "Developer Productivity"
  - "Cloud VM"
  - "Developer Workflow"
---

## 概要

exe.dev のブログ記事。エージェントツールが普及した現在、ソフトウェア生産のワークフローにおいて**カンブリア爆発**が起きていると指摘する。Developer Productivity チームが特定のワークフローを押し付けるのは逆効果であり、今は**実験と個人の裁量**が求められるフェーズだと主張する。

## 主要な論点

### 1. 「唯一の正解」は存在しない

> This is not a One Size Fits All moment. This is an Everyone's Workflow is Different moment.

- エージェントツールの登場により、ソフトウェア開発のワークフローは爆発的に多様化している
- 今この瞬間に「The Solution」を宣言して強制するのは賢明ではない
- Developer Productivity チームがユーザーにワークフローを押し付けることは**非生産的（counterproductive）**である

### 2. 鍵は「コンピュートプリミティブ」

成功の鍵は特定のツールやワークフローではなく、**コンピュートプリミティブ**にあるとする。

求められるVMの条件：
- **豊富（plentiful）**: 大量に使える
- **高性能（performant）**: 十分なパフォーマンス
- **即座にプロビジョニング可能（trivial-to-provision）**: セットアップの手間がない
- **どこからでもアクセス可能**: スマートフォンからでも利用できる
- **安全に共有可能（shared securely）**: チーム間で安全に共有できる
- **良好な統合性（integrate nicely）**: 既存ツールとスムーズに連携
- **データを信頼して預けられる（trusted with your data）**: セキュリティと信頼性

このプリミティブが与えられれば、エージェント・自動化・UI・ワークフロー・通知・ボットなどが自然に爆発的に生まれ、その中から成功したものが**ソフトウェアファクトリーの骨格（bones）**へと進化する。

### 3. exe.dev チームの実例：7人9ワークフロー

社内で実際にワークフローを共有したところ、**7人で9つの異なるワークフロー**が存在した。具体例：

| ワークフロー | 内容 |
|---|---|
| **Slackニュースレター** | サポートローテーションの状況をSlackで自動報告 |
| **Clickhouseログ統合** | Clickhouseログとの統合 |
| **テストフレーク対策エージェント** | バックグラウンドでテストのフレーク（不安定なテスト）と戦うエージェント |
| **マルチエージェントオーケストレーター** | 複数エージェントの協調動作 |
| **「Inbox」ビュー** | 全VMからエージェント会話状態を収集し、最新順にソートし、push済みかどうかを表示 |
| **Vanilla Claude Code** | 素のClaude Codeをそのまま使用 |
| **pi coding agent** | [pi.dev](https://pi.dev/) のコーディングエージェント |
| **Shelley** | exe.dev 独自のコーディングエージェント [Shelley](https://exe.dev/shelley) |

### 4. 唯一の共通点：VM

> The only common denominator? We're all using VMs to isolate, try, share, iterate, parallelize. So many VMs.

全員に共通するのは、VMを使って**分離・試行・共有・反復・並列化**を行っていること。ワークフロー自体は異なっていても、その基盤となるコンピュートプリミティブ（VM）は共通している。

## 重要な結論

1. **ワークフローの多様性を受け入れるべき**: 組織はトップダウンで統一ワークフローを強制するのではなく、個人の実験と学習を奨励すべき
2. **コンピュートプリミティブが基盤**: 特定のツールではなく、柔軟で豊富なVMインフラが成功の前提条件
3. **自然選択が働く**: 多様なワークフローの中から、成功したものが自然に組織の標準へと進化する
4. **exe.dev のポジショニング**: 同社はこの「コンピュートプリミティブ」を提供するサービスとして自社を位置づけている

## 備考

- この記事は exe.dev の企業ブログであり、自社プロダクトのポジショニングを兼ねた内容である
- 具体的な技術的詳細（VM のスペック、料金、APIなど）は本記事には含まれていない
- 記事の主張は、エージェントツール普及初期の組織戦略に関するものであり、特定の技術的ソリューションの評価ではない

---

*Source: [Everyone is building a software factory - exe.dev blog](https://blog.exe.dev/bones-of-the-software-factory)*