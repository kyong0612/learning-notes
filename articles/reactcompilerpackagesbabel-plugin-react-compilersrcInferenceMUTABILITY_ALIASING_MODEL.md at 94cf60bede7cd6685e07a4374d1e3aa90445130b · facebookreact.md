---
title: "react/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md at 94cf60bede7cd6685e07a4374d1e3aa90445130b · facebook/react"
source: "https://github.com/facebook/react/blob/94cf60bede7cd6685e07a4374d1e3aa90445130b/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md"
author:
  - "josephsavona"
published: 2025-06
created: 2025-07-09
description: |
  React Compilerの新しいミュータビリティ（可変性）とエイリアシング（別名参照）モデルに関する技術文書です。値がどのように変更され、その影響がどの範囲に及ぶかを特定する仕組みを解説しています。
tags:
  - "React"
  - "React Compiler"
  - "Mutability"
  - "Aliasing"
  - "Compiler Internals"
---

この記事は、React Compilerが採用する新しいミュータビリティ（可変性）とエイリアシング（別名参照）モデルについて解説した技術文書です。このモデルは、どの値が一緒に変更されるか、そしてその変更がどの命令範囲で発生するかを特定することを主な目的としています。最終的にこれらの情報はリアクティブスコープとしてグループ化され、メモ化のための最適化に利用されます。

## The Mutability & Aliasing Model (ミュータビリティとエイリアシングモデル)

2025年6月時点で導入されたReact Compilerの新しいモデルです。値の変更がどの範囲の命令に影響するかを追跡し、共に変化する値のセットを特定します。この分析は、以下のフェーズを経て行われます。

1. `InferMutationAliasingEffects`: 各命令のミューテーションとエイリアシングのエフェクトを推論します。
2. `InferMutationAliasingRanges`: 各値の変更可能な範囲（命令IDの開始から終了まで）を推論します。
3. `InferReactiveScopeVariables`: 共に変更される値のセットを特定し、ユニークなスコープを割り当てます。
4. `AnalyzeFunctions`: ネストされた関数のエフェクトシグネチャを推論します。

## Mutation and Aliasing Effects (ミューテーションとエイリアシングのエフェクト)

このモデルは、値の状態変化を記述するための「エフェクト」に基づいています。

### Creation Effects (生成エフェクト)

- `Create`: 新しい値（プリミティブ、オブジェクト等）の生成を記述します。
- `CreateFunction`: 新しい関数値の生成と、それがキャプチャする可変値を追跡します。
- `Apply`: 関数の呼び出し（`new`、メソッド呼び出し等）による値の生成の可能性をモデル化します。

### Aliasing Effects (エイリアシングエフェクト)

データの流れのみを記述し、状態変化は含みません。

- `Assign`: `x = y` のような単純な代入。受け取り側の値は上書きされます。
- `Alias`: `x ? y : z` のように、複数の値のいずれかが代入される可能性がある非排他的な代入。
- `Capture`: 配列への要素の追加やオブジェクトへのプロパティ設定など、ある値への参照が別の値の内部に保存されるケース。(`array.push(capturedValue)`)
- `CreateFrom`: 配列からの要素の読み出しやオブジェクトのプロパティ読み出しなど、ある値の一部を抽出して新しい変数を初期化するケース。(`createdFrom = array[0]`)
- `ImmutableCapture`: 不変なデータフローを記述します（現在は将来的な利用のため）。

### State-Changing Effects (状態変更エフェクト)

特定の値の状態変化を記述します。

- `Freeze`: 値がReact（JSXのprop、フックの引数/戻り値など）に渡された後、それ以上の変更が安全でないことを示します。これは参照自体を凍結しますが、値そのものを凍結するわけではありません。
- `Mutate` / `MutateConditionally`: 配列への要素追加など、値が直接的に変更されることを示します。
- `MutateTransitiveConditionally` / `MutateTransitive`: ネストされた値を含む、値のあらゆる側面が再帰的に変更される可能性があることを示します。未知の関数呼び出しのデフォルトです。

### Side Effects (副作用)

エラーや潜在的なエラー条件を示します。

- `MutateFrozen`: 凍結された値の変更（常にエラー）。
- `MutateGlobal`: グローバル値の変更（レンダー中はエラー）。
- `Impure`: 副作用のあるロジックの呼び出し（レンダー中はエラー）。
- `Render`: 値がレンダー中に呼び出されることを示します。

## Rules (ルール)

エフェクト間の相互作用を定義するルールセットです。

- **エイリアス/代入/CreateFromされた値の変更**: `Alias`, `Assign`, `CreateFrom` で派生した値を変更すると、元の値も変更されたと見なされます。
- **キャプチャされた値の変更**: `Capture` で派生した値を変更しても、元の値は変更されません。
- **ソースの変更**: 元の値が変更されると、そこから派生した (`Alias`, `Assign`, `CreateFrom`, `Capture`) すべての値も変更されたと見なされます。
- **Freezeの挙動**: `Freeze` は値そのものではなく、参照を凍結します。凍結された参照経由での変更はエラーになりますが、元の値や他の参照経由での変更は許可されます。
- **推移性**: エフェクトは連鎖します。例えば、`Assign` を2回続けると、最初と最後の値の間に `Assign` 関係が成立します。異なるエフェクト間の組み合わせにもルールが定義されています（例: `Capture` と `CreateFrom` の組み合わせは `Alias` と等価になる）。
