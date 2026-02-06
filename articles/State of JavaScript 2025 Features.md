---
title: "State of JavaScript 2025: Features"
source: "https://2025.stateofjs.com/en-US/features/"
author:
  - "[[Sacha Greif]]"
published:
created: 2026-02-06
description: "State of JavaScript 2025 サーベイの「Features」セクション。約13,000人の開発者を対象に、JavaScript の構文機能、String/Array/Set/Object の新機能、非同期機能、Browser API の使用状況、言語のペインポイント、今後期待される提案（Temporal、Decorators、Static Typing など）を網羅的に調査した結果。"
tags:
  - "clippings"
  - "JavaScript"
  - "Survey"
  - "ECMAScript"
  - "Web Development"
  - "Browser APIs"
  - "TypeScript"
  - "Frontend"
---

## 概要

State of JavaScript 2025 は、JavaScriptエコシステムの最新トレンドを調査する年次サーベイである。本「Features」セクションでは、約13,000人の回答者を対象に、JavaScript の構文機能、組み込みオブジェクトの新メソッド、非同期機能、Browser API の使用状況、そして言語に対する不満点や今後期待される提案について包括的に調査している。

全体を通じて、**静的型付けの欠如**が最大のペインポイントとして浮かび上がり、**Temporal** が最も期待される提案であり続けている。また、多くの開発者が新機能のキャッチアップに苦労している実態も明らかになった。

## 主要なトピック

### 1. Syntax Features（構文機能）

回答者 12,367人（全体の95%）が回答。

| 順位 | 機能 | 使用者数 |
|------|------|----------|
| 1 | **Nullish Coalescing** (`??`) | 10,717 |
| 2 | **Dynamic Import** | 8,222 |
| 3 | **Private Fields** | 5,314 |
| 4 | **Logical Assignment** (`&&=`, `||=`, `??=`) | 4,327 |
| 5 | **Iterator Methods** | 4,041 |
| 6 | Hashbang Grammar | 3,383 |
| 7 | `error.cause` | 2,795 |
| 8 | `RegExp.escape` | 873 |
| 9 | Float16Array | 533 |

- Nullish Coalescing が圧倒的に高い使用率を誇り、ほぼ全回答者の87%が使用済み
- Dynamic Import も広く普及しており、コード分割の標準的手法として定着
- 新しめの機能（`RegExp.escape`、`Float16Array`）はまだ浸透が限定的

### 2. String Features（文字列機能）

回答者 12,097人（93%）。

| 順位 | 機能 | 使用者数 |
|------|------|----------|
| 1 | `string.replaceAll()` | 9,642 |
| 2 | `string.matchAll()` | 6,036 |
| 3 | Regexp Match Indices | 2,754 |

- `replaceAll()` は非常に高い採用率（80%）を示し、開発者にとって待望だった機能であることがわかる

### 3. Array Features（配列機能）

回答者 11,604人（89%）。

| 順位 | 機能 | 使用者数 |
|------|------|----------|
| 1 | `array.toSorted()` | 5,419 |
| 2 | `array.toReversed()` | 4,264 |
| 3 | `array.findLast()` | 4,082 |
| 4 | `array.toSpliced()` | 2,349 |
| 5 | `array.with()` | 1,421 |
| 6 | `array.fromAsync()` | 860 |

- **イミュータブルな配列メソッド**（`toSorted`、`toReversed`、`toSpliced`）が順調に採用されている
- ただし「使ったことがない」回答者も3,879人と、まだ浸透の余地がある

### 4. Set Features（Set 機能）

回答者 10,913人（84%）。

| 順位 | 機能 | 使用者数 |
|------|------|----------|
| 1 | `set.union()` | 2,561 |
| 2 | `set.intersection()` | 2,487 |
| 3 | `set.difference()` | 2,243 |
| 4 | `set.isSubsetOf()` | 1,216 |
| 5 | `set.isSupersetOf()` | 723 |
| 6 | `set.symmetricDifference()` | 500 |
| 7 | `set.isDisjointFrom()` | 420 |

- **「使ったことがない」が最多（7,328人、67%）** で、Set の新しい集合演算メソッドはまだ採用初期段階
- `union()`、`intersection()`、`difference()` が比較的高い使用率

### 5. Object Features（オブジェクト機能）

回答者 10,405人（80%）。

- `Object.groupBy()`: **4,018人**が使用
- 「使ったことがない」: **6,387人（61%）**

`Object.groupBy()` は新しい機能だが、約4割の回答者が既に使用しており、急速に浸透しつつある。

### 6. Async Features（非同期機能）

回答者 11,506人（88%）。

| 順位 | 機能 | 使用者数 |
|------|------|----------|
| 1 | `Promise.allSettled()` | 6,035 |
| 2 | `Promise.any()` | 5,386 |
| 3 | `Promise.try()` | 1,838 |

- `Promise.allSettled()` と `Promise.any()` は半数以上が使用しており、定着済み
- `Promise.try()` は新しい機能でまだ使用率は低め

### 7. Browser APIs

回答者 11,918人（92%）。

| 順位 | API | 使用者数 | 前年比 |
|------|-----|----------|--------|
| 1 | **WebSocket** | 7,595 | - |
| 2 | **Progressive Web Apps** | 5,740 | - |
| 3 | **Geolocation API** | 4,061 | - |
| 4 | Web Animations | 2,759 | - |
| 5 | WebAssembly (WASM) | 2,522 | +2 |
| 6 | WebGL | 2,517 | -1 |
| 7 | Page Visibility API | 2,505 | -1 |
| 8 | WebRTC | 1,989 | - |
| 9 | URLPattern API | 1,599 | - |
| 10 | Broadcast Channel API | 1,446 | +1 |
| 11 | Web Speech API | 1,267 | +1 |
| 12 | Web Authentication API | 1,242 | -3 |
| 13 | Temporal | 1,116 | -3 |
| 14 | Gamepad API | 443 | -1 |
| 15 | Scheduler API | 334 | - |
| 16 | `navigator.xr` (WebXR) | 274 | -2 |

- WebSocket と PWA が圧倒的に高い使用率
- **WebAssembly が順位を上げ**（+2）、採用が加速している
- Temporal は Browser API としても1,116人が使用と報告しているが、まだ限定的

### 8. Language Pain Points（言語のペインポイント）

回答者 3,904人（30%）が自由回答で回答。

| 順位 | ペインポイント | 回答数 | 前年比 |
|------|----------------|--------|--------|
| 1 | **静的型付けの欠如** | 1,102 | - |
| 2 | **日付処理** | 372 | +1 |
| 3 | TypeScript サポート | 276 | +1 |
| 4 | ブラウザサポート | 257 | -2 |
| 5 | ESM & CJS | 197 | - |
| 6 | エラーハンドリング | 185 | - |
| 7 | パフォーマンス | 178 | - |
| 8 | 標準ライブラリ | 171 | +1 |
| 9 | オブジェクトの操作 | 119 | +2 |
| 10 | 過度な複雑さ | 108 | +6 |

- **静的型付けの欠如**が突出して最大のペインポイント（他の3倍）
- **「過度な複雑さ」が大きくランクアップ**（+6）しており、言語の肥大化に対する懸念が増加
- ESM/CJS のモジュール互換性問題は依然として課題

### 9. Browser APIs Pain Points

回答者 2,340人（18%）が回答。

| 順位 | ペインポイント | 回答数 |
|------|----------------|--------|
| 1 | **ブラウザサポート** | 725 |
| 2 | ブラウザテストの問題 | 315 |
| 3 | **Safari** | 165 |
| 4 | 日付管理 | 107 |
| 5 | パフォーマンス | 88 |

- ブラウザ間の互換性が最大の課題
- **Safari が名指しで不満の対象に**なっている点が特徴的

### 10. New Proposals（新しい提案）

回答者 10,675人（82%）が回答。

| 順位 | 提案 | 回答数 |
|------|------|--------|
| 1 | **Temporal** | 5,614 |
| 2 | **Decorators** | 3,672 |
| 3 | `map.getOrInsert()` | 1,816 |
| 4 | JSON.parse source text access | 1,377 |
| 5 | Explicit Resource Management | 1,244 |
| 6 | Deferring Module Evaluation | 832 |
| 7 | Decorator Metadata | 763 |
| 8 | ShadowRealm API | 523 |
| 9 | Iterator Sequencing | 499 |
| 10 | Joint Iteration | 433 |

自由記述で注目されたもの:
- **Signals** (86票)
- **Pipe operator** (54票)
- **Pattern matching** (43票)
- `Record` & `Tuple` (22票)
- `Observable` (17票)
- Type Annotations (14票)

> **Temporal** が引き続き1位だが、Firefoxでの実装が始まったこともあり、昨年より期待度はやや低下。

### 11. Missing Features（不足している機能）

回答者 11,315人（87%）が回答。

| 順位 | 機能 | 回答数 |
|------|------|--------|
| 1 | **Static Typing** | 6,177 |
| 2 | **Standard Library** | 5,441 |
| 3 | **Signals** | 3,339 |
| 4 | **Pipe Operator** (`|>`) | 2,943 |
| 5 | **Pattern Matching** | 2,275 |
| 6 | `Observable` | 1,595 |
| 7 | JavaScript Structs | 1,192 |
| 8 | Async Context | 1,018 |
| 9 | Iterator Chunking | 709 |
| 10 | Extractors | 352 |
| 11 | Composites | 319 |

- トップ5は前年と変わらず
- **Signals への関心は前年よりやや低下**
- **Static Typing が圧倒的1位**で、JavaScript コミュニティの型への強い需要を反映

### 12. Native Types（ネイティブ型）

回答者 10,934人（84%）が回答。

| 実装方法 | 回答数 | 割合 |
|----------|--------|------|
| **Type Annotations**（TypeScript風の型注釈） | 5,380 | 49% |
| **Runtime Types**（ランタイム型） | 3,524 | 32% |
| 実装してほしくない | 1,170 | 11% |
| JSDoc-like types | 901 | 8% |

> 型がJavaScriptにネイティブ実装されるとすれば、**TypeScript風の型注釈**が最も支持されている。ランタイム型も32%が支持しているが、公式に実装される可能性が高いのは型注釈の方だと記事は指摘。

### 13. Pace of Change（変化のペース）

回答者 11,615人（89%）が回答。平均スコア: **2.5/5**

| レベル | 説明 | 回答数 |
|--------|------|--------|
| 1 | ほとんどの機能について学んでも試してもいない | 2,276 |
| 2 | いくつかの機能について学んだが試していない | 3,552 |
| 3 | いくつかの機能について学び、試した | 4,226 |
| 4 | ほとんどの機能について学び、いくつか試した | 1,269 |
| 5 | ほとんどの機能について学び、試した | 292 |

- **大多数の開発者が新機能のキャッチアップに苦労**している
- レベル1-2（学んでも試してもいない〜学んだが試していない）が合計50%を占める
- レベル4-5はわずか13%

### 14. Reading List（リーディングリスト）

今年は自動追加機能の導入により、ライブラリ中心のリストとなった。

| 順位 | 項目 | 追加数 |
|------|------|--------|
| 1 | **Svelte** | 2,702 |
| 2 | **Solid** | 2,296 |
| 3 | **Astro** | 2,004 |
| 4 | SvelteKit | 1,882 |
| 5 | **Bun** | 1,825 |
| 6 | **HTMX** | 1,817 |
| 7 | Rolldown | 1,782 |
| 8 | tRPC | 1,768 |
| 9 | `bun test` | 1,475 |
| 10 | Vue.js | 1,450 |

## 重要な事実・データ

- **回答者規模**: 約13,000人（質問により10,000〜12,367人が回答）
- **最も使われている構文機能**: Nullish Coalescing（10,717人、87%）
- **最も使われている文字列メソッド**: `string.replaceAll()`（9,642人、80%）
- **最大のペインポイント**: 静的型付けの欠如（1,102票、ペインポイント回答者の28%）
- **最も期待される提案**: Temporal（5,614票）
- **最も欠けている機能**: Static Typing（6,177票）
- **ネイティブ型の最有力候補**: Type Annotations（5,380票、49%）
- **変化への追随度**: 平均2.5/5（多くの開発者が苦労）
- **Set 新機能**: 67%がまだ使ったことがない
- **Browser API 最大の不満**: Safari のサポート不足

## 結論・示唆

### サーベイが示す主要トレンド

1. **型への強い需要**: 静的型付けの欠如がペインポイント1位、Missing Features でも1位であり、JavaScript コミュニティが型安全性を強く求めていることが明確
2. **イミュータブル操作の普及**: `toSorted()`、`toReversed()` などの非破壊的メソッドが着実に採用されている
3. **新機能の浸透にはタイムラグがある**: Set の集合演算メソッドは67%が未使用、`Object.groupBy()` も61%が未使用と、機能の認知と実践のギャップが存在
4. **Temporal は期待と実装の転換点**: Firefox での実装が始まり、期待度はやや低下したが、依然として最も注目される提案
5. **エコシステムの複雑さへの懸念増加**: 「過度な複雑さ」が前年から+6ランクアップし、言語の肥大化に対する警戒感が高まっている

### 実践的な示唆

- Nullish Coalescing、Dynamic Import、`replaceAll()` は既にデファクトスタンダードであり、積極的に採用すべき
- イミュータブル配列メソッド（`toSorted` 等）は生産性と安全性の向上に寄与するため、早期導入を推奨
- Set の集合演算メソッドはまだ認知が低いが、ユースケースによっては大きな簡潔化が可能
- TypeScript 型注釈スタイルが将来のネイティブ型の最有力候補であり、TypeScript の知識は長期的に有益

## 制限事項・注意点

- サーベイは自己選択型であり、回答者はJavaScriptに関心の高い層に偏っている可能性がある
- 回答者の93%が男性であり、多様性の面で代表性に課題がある
- 回答者の地域分布はUSA（1,671人）が突出しており、グローバルな見解として一般化する際は注意が必要
- 使用率データは「使ったことがある」であり、プロダクション環境での定常的な使用とは限らない
- 公開日が明記されていないため、`published` フィールドは空欄のままとしている

---

*Source: [State of JavaScript 2025: Features](https://2025.stateofjs.com/en-US/features/)*
