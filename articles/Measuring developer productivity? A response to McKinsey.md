---
title: "Measuring developer productivity? A response to McKinsey"
source: "https://tidyfirst.substack.com/p/measuring-developer-productivity"
author:
  - "[[Kent Beck]]"
published: 2023-08-30
created: 2025-07-05
description: "Part 1 of 2"
tags:
  - "clippings"
---
### Part 1 of 2

## Summary

Kent BeckとGergely Oroszによる、McKinseyが提案した開発者生産性の測定手法への反論記事。

### 問題提起

McKinseyの手法は、開発者の「活動（Activity）」、すなわち**Effort（努力）**や**Output（成果物）**を測定するものに過ぎず、ビジネス上の**Outcome（結果）**や**Impact（影響）**を捉えていないと批判。

このような測定は、指標自体を改善するための行動（ゲーミフィケーション）を誘発し、本来の目的から外れる危険性がある。Facebookで導入されたサーベイスコアが、昇進や評価の道具となり、本来のフィードバック機能を失った例が挙げられている。

### ソフトウェアエンジニアリングの価値創出モデル

記事では、価値創出のプロセスを以下の4段階のモデルで説明している。

1. **Effort**: 計画、コーディングなどの努力
2. **Output**: 機能、コード、設計書などの具体的な成果物
3. **Outcome**: 顧客の行動変容（例：オンボーディングの離脱率低下）
4. **Impact**: ビジネスへの価値（例：収益、フィードバック）

営業や採用などの他部門が高い説明責任を果たせるのは、彼らの評価が**Outcome**や**Impact**（例：契約数、採用充足率）に基づいているからである。エンジニアリングも同様に、これらの指標に焦点を当てるべきだと主張。

### 測定のトレードオフ

- **Impactに近いほど**：組織全体の目標と整合性が取れるが、個人の貢献度を特定するのが難しい。
- **Effortに近いほど**：測定は容易だが、指標のゲーミフィケーションを招き、本来の目的から逸脱するリスクが高い。

DORAやSPACEといったフレームワークはOutcomeやImpactを重視しているのに対し、McKinseyの手法はEffortやOutputに偏りすぎていると指摘。

### 結論

エンジニアリングリーダーは、安易にEffortやOutputを測定するのではなく、**OutcomeとImpactを測定する**ことを強く推奨。例えば、「週に一度、チームとして顧客を喜ばせる」「チームがコミットしたビジネスインパクトを実現する」といった指標を提案している。
