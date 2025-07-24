---
title: "Deep Security Conference 2025：生成AI時代のセキュリティ監視 /dsc2025-genai-secmon"
source: "https://speakerdeck.com/mizutani/dsc2025-genai-secmon"
author:
  - "[[Masayoshi Mizutani]]"
published: 2025-07-16
created: 2025-07-24
description: |
  本講演では、セキュリティ監視の定義、必要性、導入アプローチから、生成AIを活用した現代的なセキュリティ監視の現状と未来について解説します。生成AIがログ分析やルールチューニングで効果を発揮する一方、大量ログからの異常検知やリスク判定には課題も残ることを指摘し、今後の展望を論じます。
tags:
  - "Security"
  - "GenerativeAI"
  - "SecOps"
  - "Monitoring"
  - "DetectionEngineering"
---

## 講演概要

本講演では、Ubie株式会社の水谷正慶氏が、生成AI時代のセキュリティ監視について解説します。セキュリティ監視の基礎から、生成AIの活用による変化、そして今後の展望までを網羅しています。

---

## 講演内容サマリー

### 1. セキュリティ監視の基礎

* **定義**: 組織内で発生するセキュリティ問題を継続的に検知・調査すること。
  * **検知**: 問題の発生を判断する機能。潜在的なリスク発見も含む。
  * **調査**: 検知された問題の原因や影響を調査し、対応策を検討するための情報を提供する。
* **必要性**: 防御的対策には限界があるため。
  * 対策の抜け漏れ、サプライチェーン攻撃、ゼロデイ攻撃など、防ぎきれない脅威が存在する。
* **メリット**:
    1. **問題の早期発見**: 攻撃が顕在化する前に察知し、被害を最小化する。
    2. **影響範囲の特定**: ログを証跡として攻撃者の行動を追跡し、被害状況を正確に把握する。

![スライド 7](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_6.jpg)
![スライド 8](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_7.jpg)
![スライド 9](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_8.jpg)

### 2. セキュリティ監視の導入と運用

* **構成要素**: ログ収集、保全、分析・調査、アラート検知、アラート対応。
* **導入アプローチ**:
    1. **DWHへログ蓄積**: 低コストだが、検知・対応には作り込みが必要。
    2. **SIEM利用**: 高コストだが、一気通貫でサポート。
* **運用コスト**: アラートのトリアージや検知ルールのチューニングなど、人的コストが大きい。
* **解決策としての「セキュリティ監視エンジニアリング」**:
  * 検知ルールや対応手順をコード化 (as Code) し、CI/CDで自動化する。
  * 品質向上、迅速化、効率化が期待されるが、スキルを持つ人材が希少。

![スライド 11](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_10.jpg)
![スライド 12](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_11.jpg)
![スライド 16](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_15.jpg)

### 3. セキュリティ監視における生成AIの活用

2025年7月時点での生成AIの状況を踏まえ、活用可能性を考察。

* **困難なアプローチ**:
  * **大量ログからの異常検知**: 「異常」の定義が難しく、コンテキストウィンドウやコストの制約がある。
  * **アラートの深刻度・リスク判定**: 多くのコンテキストが必要で、「責任」の所在が問題となる。
* **効果的なアプローチ**:
  * **ログデータの要約・分析・調査**: トークンサイズ上限の増加により、数千件のログ読み込みと分析が可能に。
  * **ルールのチューニング**: 生成AIコーディングエージェントを利用して、ルールの編集やテストを自動化。
  * **アラートの調査・エンリッチメント**: IPアドレス等のインジケータ調査や、検索クエリの自動生成。
  * **外部とのコミュニケーションサポート**: 他部署やサポートへの問い合わせ文面作成を支援。

![スライド 19](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_18.jpg)
![スライド 21](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_20.jpg)
![スライド 24](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_23.jpg)
![スライド 25](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_24.jpg)

### 4. 専用AIエージェント「Warren」

より効果的な連携のため、セキュリティアラートマネジメント用生成AIエージェント「Warren」を開発。

* **目的**: SOARの代替として、生成AIをセキュリティ監視で活用。
* **特徴**:
  * **UI**: SlackとWebUIを連携させ、円滑なコミュニケーションと情報処理を実現。
  * **データアクセス**: MCPや脅威インテリジェンスツール、BigQueryと連携。RAGで過去のチケットも活用。
  * **独自ワークロード**: プロンプティングやLLM呼び出しフローを最適化。

![スライド 31](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_30.jpg)
![スライド 32](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_31.jpg)

### 5. まとめと今後の展望

* セキュリティ監視は効果的だが、コストが課題だった。
* 生成AIは運用コスト改善の可能性を秘めており、特にアラート調査や分析の効率化に貢献する。
* CopilotやCrowdStrikeの事例では、実際に作業時間が大幅に削減されている。
* ただし、最終的なリスク判断は専門家が必要。
* 今後のAIモデル・ツールの発展により、小規模チームでの高度なセキュリティ監視運用が期待される。

![スライド 37](https://files.speakerdeck.com/presentations/57f205f48641405899320731dd67e6be/slide_36.jpg)
