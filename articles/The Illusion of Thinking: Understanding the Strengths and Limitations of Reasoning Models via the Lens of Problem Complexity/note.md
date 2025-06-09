---
title: The Illusion of Thinking: Understanding the Strengths and Limitations of Reasoning Models via the Lens of Problem Complexity
source: https://ml-site.cdn-apple.com/papers/the-illusion-of-thinking.pdf
author:
  - Parshin Shojaee
  - Maxwell Horton
  - Iman Mirzadeh
  - Samy Bengio
  - Keivan Alizadeh
  - Mehrdad Farajtabar
published:
created: 2025-06-09 18:49:34
description: |
  Recent generations of frontier language models have introduced Large Reasoning Models (LRMs) that generate detailed thinking processes before providing answers. While these models demonstrate improved performance on reasoning benchmarks, their fundamental capabilities, scaling properties, and limitations remain insufficiently understood. Current evaluations primarily focus on established mathematical and coding benchmarks, emphasizing final answer accuracy. However, this evaluation paradigm often suffers from data contamination and does not provide insights into the reasoning traces' structure and quality. In this work, we systematically investigate these gaps with the help of controllable puzzle environments that allow precise manipulation of compositional complexity while maintaining consistent logical structures. This setup enables the analysis of not only final answers but also the internal reasoning traces, offering insights into how LRMs "think". Through extensive experimentation across diverse puzzles, we show that frontier LRMs face a complete accuracy collapse beyond certain complexities. Moreover, they exhibit a counter-intuitive scaling limit: their reasoning effort increases with problem complexity up to a point, then declines despite having an adequate token budget. By comparing LRMs with their standard LLM counterparts under equivalent inference compute, we identify three performance regimes: (1) low-complexity tasks where standard models surprisingly outperform LRMs, (2) medium-complexity tasks where additional thinking in LRMs demonstrates advantage, and (3) high-complexity tasks where both models experience complete collapse. We found that LRMs have limitations in exact computation: they fail to use explicit algorithms and reason inconsistently across puzzles. We also investigate the reasoning traces in more depth, studying the patterns of explored solutions and analyzing the models' computational behavior, shedding light on their strengths, limitations, and ultimately raising crucial questions about their true reasoning capabilities.
tags:
  - Large Reasoning Models
  - LLM
  - Reasoning
  - Problem Complexity
  - Evaluation
---

## TL;DR

本論文は、大規模推論モデル（LRM）の推論能力を、問題の複雑性を制御可能なパズル環境を用いて体系的に調査したものです。その結果、LRMは一定の複雑性を超えると性能が完全に崩壊すること、問題が複雑になるにつれて推論努力（思考トークン）が逆に減少するという直感に反するスケーリングの限界があることが明らかになりました。また、思考型モデルと思考型でないモデルを比較し、低・中・高複雑度のタスクで性能が異なる3つのレジームが存在することを特定しました。これらの発見は、現在のLRMの一般化された推論能力には基本的な限界があることを示唆しています。

## 1. はじめに

近年の大規模言語モデル（LLM）の進化形である大規模推論モデル（LRM）は、思考プロセスを生成してから回答することで注目されています。しかし、その基本的な能力や限界は十分に理解されていません。現在の評価は、主に数学やコーディングのベンチマークに依存しており、最終的な回答の正解率に重点を置いていますが、これにはデータ汚染の問題や、思考プロセスの質を評価できないという欠点があります。

本研究では、これらの課題に対処するため、構成的な複雑さを精密に操作できる制御可能なパズル環境を利用します。これにより、最終的な回答だけでなく、内部の推論の軌跡も分析し、LRMがどのように「思考」するかについての洞察を得ることを目指します。

本研究の主な貢献は以下の通りです。

* **制御可能な実験環境の設計**: 数学ベンチマークの現在の評価パラダイムに疑問を呈し、問題の複雑性を制御できるアルゴリズム的なパズル環境を設計。
* **一般化能力の限界の提示**: 最先端のLRMが、一定の複雑性を超えると正解率がゼロに崩壊し、一般化された問題解決能力を開発できていないことを示す。
* **推論努力のスケーリング限界の発見**: LRMの思考トークンが、ある複雑性の点を超えると直感に反して減少する傾向があることを発見。
* **思考プロセスの詳細な分析**: 決定論的なパズルシミュレータを用いて思考の軌跡を評価し、複雑性が増すにつれて正しい解が思考の後半に出現する傾向があることを明らかにし、自己修正メカニズムに関する洞察を提供。
* **計算能力の限界の解明**: 明示的なアルゴリズムを与えても性能が向上しないなど、LRMが正確な計算を実行する能力に驚くべき限界があることを発見。

## 2. 関連研究

LLMの推論能力は長年の研究テーマです。Chain of Thought（CoT）などの手法で性能は向上しましたが、高品質なデータの不足が課題でした。強化学習（RL）を用いてモデルに思考を教えるアプローチにより、DeepSeek-R1のようなLRMが登場しました。

近年の研究では、LRMが思考の軌跡と最終回答の間に不一致を示すことや、「考えすぎ（overthinking）」による効率性の問題が指摘されています。本研究は、これらのモデルの挙動を問題の複雑性という観点から体系的に分析し、特に思考型モデルと思考型でないモデルの比較を通じて、その限界と能力をより深く探求します。

## 3. 数学およびパズル環境

現在の数学ベンチマーク（MATH500, AIME24/25など）によるLRMの評価は、結果の解釈が難しいという問題があります。性能差が真の推論能力の差なのか、あるいは新しいベンチマークにおけるデータ汚染の度合いによるものなのかが不明確です。

この問題を回避するため、本研究ではより制御された実験が可能な4つのパズル環境を採用しました。

1. **ハノイの塔**: ディスクをルールに従って移動させるパズル。ディスクの数（n）で複雑性を制御。
2. **チェッカージャンピング**: 赤と青のチェッカーの位置を入れ替えるパズル。チェッカーの数で複雑性を制御。
3. **川渡りパズル**: 複数のアクターとエージェントが制約を守りながら川を渡るパズル。アクターとエージェントのペア数で複雑性を制御。
4. **ブロックワールド**: ブロックを初期配置から目標配置へ再構成するパズル。ブロックの数で複雑性を制御。

これらのパズルは、論理構造を維持しつつ複雑性を体系的に変更できるため、LRMの推論パターンと限界を厳密に分析するのに適しています。

## 4. 実験と結果

### 4.1 実験設定

* **モデル**: Claude 3.7 Sonnet（思考/非思考）、DeepSeek-R1/V3、o3-miniを使用。
* **トークン**: ClaudeとDeepSeekモデルには最大64kのトークンバジェットを許可。
* **サンプリング**: 各パズルの各複雑度で25サンプルを生成し、平均性能を報告。

### 4.2 複雑性は推論にどう影響するか？

#### 4.2.1 3つの複雑性レジーム

思考モデルと非思考モデルを比較した結果、問題の複雑性に応じて3つの異なる性能レジームが存在することが明らかになりました。

1. **低複雑性レジーム**: 非思考モデルが、思考モデルと同等かそれ以上の性能を、より効率的に（少ないトークンで）達成する。
2. **中複雑性レジーム**: 思考モデルが優位性を示し、長いCoTを生成する能力が性能向上に寄与する。
3. **高複雑性レジーム**: 両方のモデルの性能が完全に崩壊し、正解率がゼロになる。思考モデルも最終的には同じ限界に直面する。

![3つのレジーム](https://i.imgur.com/eGkH80F.png)
*図5より: 低・中・高複雑度における思考モデルと非思考モデルの性能比較。*

#### 4.2.2 推論モデルの崩壊

すべてのLRMは、問題の複雑性が増加するにつれて精度が低下し、モデル固有のしきい値を超えると完全に崩壊（正解率ゼロ）するパターンを示しました。

さらに興味深いことに、推論に使用される思考トークン（推論努力）も、正解率が崩壊する臨界点に近づくと、問題の難易度が上がっているにもかかわらず**直感に反して減少し始める**ことがわかりました。これは、現在のLRMの思考能力に根本的なスケーリングの限界があることを示唆しています。

![推論の崩壊](https://i.imgur.com/83p0yW8.png)
*図6より: 複雑性が増すと、ある時点から精度が急落し、思考トークンも減少する。*

### 4.3 推論モデルの思考内部で何が起こっているか？

思考の軌跡を詳細に分析した結果、以下のパターンが明らかになりました。

* **単純な問題**: 正しい解を早期に見つけた後も、不正解の選択肢を探し続ける「考えすぎ（overthinking）」の現象が見られる。
* **中程度の問題**: 不正解の選択肢を広範に探索した後、思考の後半で正しい解にたどり着く傾向がある。
* **複雑な問題**: 思考の軌跡内に正しい解を全く生成できず、推論が崩壊する。

### 4.4 未解決の問い：推論モデルの不可解な振る舞い

* **アルゴリズムを実行できない**: ハノイの塔の解法アルゴリズムをプロンプトで明示的に与えても、性能はほとんど向上せず、同じ点で崩壊が見られた。これは、モデルが解法戦略の発見だけでなく、論理的なステップの実行そのものに問題を抱えていることを示唆しています。
* **パズル間での一貫性のなさ**: モデルはハノイの塔では100手以上の正しい手順を生成できる一方、川渡りパズルではわずか4手で誤りを犯すなど、パズルの種類によって性能が大きく異なる。これは、特定の種類の問題例がウェブ上の学習データに乏しいことに起因する可能性があります。

## 5. 結論

本研究は、制御可能なパズル環境を用いてLRMの限界を体系的に明らかにしました。主な発見は以下の通りです。

* LRMは、一定の複雑性を超えると一般化された推論能力を発揮できず、性能が崩壊する。
* 複雑性に応じて、(1)非思考モデルが優位、(2)思考モデルが優位、(3)両モデルが崩壊、という3つの性能レジームが存在する。
* 問題が非常に複雑になると、LRMは思考努力を減らすという、スケーリングに関する根本的な限界を示す。
* 思考プロセスの分析から、「考えすぎ」や、明示的なアルゴリズムの実行失敗など、非効率性や根本的な計算能力の限界が明らかになった。

これらの結果は、現在のLRMの能力に関する一般的な仮定に疑問を投げかけるものであり、より堅牢な推論システムに向けた今後の研究の方向性を示唆しています。

## 6. 限界

本研究にはいくつかの限界があります。

* 使用したパズル環境は、多様な実世界の推論タスクの一部を代表するにすぎない。
* 実験の多くはブラックボックスAPIに依存しており、モデルの内部状態を分析できない。
* 決定論的なシミュレータによる検証方法は、構造化されていないドメインへの適用が難しい可能性がある。

---
