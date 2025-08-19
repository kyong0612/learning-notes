---
title: "CAI"
source: "https://aliasrobotics.github.io/cai/"
author:
  - "Víctor Mayoral-Vilches"
published:
created: 2025-08-19
description: |
  A lightweight, ergonomic framework for building bug bounty-ready Cybersecurity AIs (CAIs).
tags:
  - "Cybersecurity"
  - "AI"
  - "BugBounty"
  - "Pentest"
  - "OpenSource"
---
## Cybersecurity AI (CAI)

A lightweight, ergonomic framework for building bug bounty-ready Cybersecurity AIs (CAIs).

![](https://github.com/aliasrobotics/cai/raw/main/media/cai.png)

| CAI with `alias0` on ROS message injection attacks in MiR-100 robot | CAI with `alias0` on API vulnerability discovery at Mercado Libre |
| --- | --- |
| [![asciicast](https://asciinema.org/a/dNv705hZel2Rzrw0cju9HBGPh.svg)](https://asciinema.org/a/dNv705hZel2Rzrw0cju9HBGPh) | [![asciicast](https://asciinema.org/a/9Hc9z1uFcdNjqP3bY5y7wO1Ww.svg)](https://asciinema.org/a/9Hc9z1uFcdNjqP3bY5y7wO1Ww) |

| CAI on JWT@PortSwigger CTF — Cybersecurity AI | CAI on HackableII Boot2Root CTF — Cybersecurity AI |
| --- | --- |
| [![asciicast](https://asciinema.org/a/713487.svg)](https://asciinema.org/a/713487) | [![asciicast](https://asciinema.org/a/713485.svg)](https://asciinema.org/a/713485) |

## 🎯 Milestones

- Hack The Box (HTB) Spainでトップランキング達成
- HTB Human vs AI CTFで世界1位（AI部門）、スペイン1位を獲得
- Mistral AI Robotics Hackathonで受賞
- バグ報奨金を獲得

## 📦 Package Attributes

> ⚠️ CAIは活発に開発中であり、完全な動作を保証するものではありません。問題報告やプルリクエストによる貢献が歓迎されています。
>
> このライブラリへのアクセスおよび情報の利用は、適用される法律や規制に違反する場合には意図されておらず、禁止されています。実行中のシステムへの不正な改ざんを推奨・助長するものではありません。

## Motivation

### Why CAI?

サイバーセキュリティ分野はAIの統合により劇的に変化しており、2028年までにはAI搭載のセキュリティテストツールが人間のペネトレーションテスターの数を上回ると予測されています。CAIは、この変化に対応するため、高度なサイバーセキュリティAIツールへのアクセスを民主化することを目的としたオープンソースフレームワークです。

バグバウンティプログラムは現代のサイバーセキュリティの基盤となっており、CAIは偵察から脆弱性の検証、報告に至るまで、バグハンティングの様々な側面を支援する特化したAIエージェントを構築するためのフレームワークを提供します。

### Ethical principles behind CAI

CAIのオープンソース化は、以下の2つの倫理原則に基づいています。

1. **サイバーセキュリティAIの民主化**: 高度なAIツールを一部の資金力のある組織だけでなく、セキュリティコミュニティ全体が利用できるようにします。
2. **AIセキュリティ能力の透明性**: 現在のLLMベンダーがサイバーセキュリティ能力を過小評価している現状に対し、CAIをオープンに開発することで、AIシステムが実際に何ができるかの透明なベンチマークを提供します。

### CAIの基本原則

- **サイバーセキュリティ指向**: 攻撃的および防御的セキュリティタスクの自動化を目指します。
- **オープンソース**: 研究目的であれば無料。商用利用にはライセンスが必要です。
- **軽量**: 高速で使いやすい設計。
- **モジュール性とエージェント中心**: 柔軟性とスケーラビリティを提供します。
- **ツール統合**: 既存のツールとカスタムツールの両方を容易に統合できます。
- **ロギングとトレーシング**: `phoenix`を使用し、エージェントの実行を詳細に追跡できます。
- **マルチモデル対応**: `LiteLLM`により300以上のモデルをサポート。

### Closed-source alternatives

多くのグループが閉鎖的なアプローチでサイバーセキュリティAIを開発していますが、CAIはオープンなアプローチを取ることで、リソースの浪費や重複した取り組みを避けることを目指しています。

---

[1] Deng, G., Liu, Y., Mayoral-Vilches, V., Liu, P., Li, Y., Xu, Y.,... & Rass, S. (2024). {PentestGPT}: Evaluating and harnessing large language models for automated penetration testing. In 33rd USENIX Security Symposium (USENIX Security 24) (pp. 847-864).

## Citation

```
@misc{mayoralvilches2025caiopenbugbountyready,
      title={CAI: An Open, Bug Bounty-Ready Cybersecurity AI},
      author={Víctor Mayoral-Vilches and Luis Javier Navarrete-Lozano and María Sanz-Gómez and Lidia Salas Espejo and Martiño Crespo-Álvarez and Francisco Oca-Gonzalez and Francesco Balassone and Alfonso Glera-Picón and Unai Ayucar-Carbajo and Jon Ander Ruiz-Alcalde and Stefan Rass and Martin Pinzger and Endika Gil-Uriarte},
      year={2025},
      eprint={2504.06017},
      archivePrefix={arXiv},
      primaryClass={cs.CR},
      url={https://arxiv.org/abs/2504.06017},
}
```

## Acknowledgements

CAIはAlias Roboticsによって開発され、欧州EICアクセラレータープロジェクトの共同資金提供を受けました。OpenAIの`swarm`ライブラリに触発されており、`LiteLLM`や`phoenix`といった他のオープンソースプロジェクトも活用しています。
