# In the Matter of OpenAI vs LangGraph

ref: <https://www.latent.space/p/oai-v-langgraph>

# OpenAI vs LangGraph に関する考察 (In the Matter of OpenAI vs LangGraph)

ref: <https://www.latent.space/p/oai-v-langgraph>

## 概要

この記事は、OpenAI が発表したエージェント構築ガイドと、LangChain の Harrison Chase による LangGraph の観点からの反論を中心に、AI エージェント開発における「大規模モデル主導」対「ワークフロー主導」という対立するアプローチについて論じています。

* **背景:** OpenAI の「エージェント構築実践ガイド」([PDF](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)) が公開され、一部で話題となったが、LangChain の Harrison Chase はこれを「見当違い (misguided)」と批判し、詳細な反論 ([LangChain Blog](https://blog.langchain.dev/how-to-think-about-agent-frameworks/)) を発表した。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffce66548-8530-40df-a357-e7c8e13f3a77_601x487.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/fce66548-8530-40df-a357-e7c8e13f3a77_601x487.png)
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F201f144a-3adc-447b-afc2-4b59ac311362_2390x1314.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/201f144a-3adc-447b-afc2-4b59ac311362_2390x1314.png)
* **中心的な対立:** 「Big Model take the wheel（大規模モデルに任せる）」派 vs 「nooooo we need to write code（いや、コードを書く必要がある）」派（以前は「チェーン」、現在は「ワークフロー」と呼ばれることが多い）の対立。

## Team Big Workflows (ワークフロー重視派)

Harrison Chase の主張の要点:

* ワークフロー内のすべての LLM コールをエージェントに置き換えても、エージェントシステムとして機能する。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9e47efdb-80c3-4904-a2d3-ddc595b83139_853x765.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/9e47efdb-80c3-4904-a2d3-ddc595b83139_853x765.png)
* 理想的なエージェントフレームワークは、スペクトラムの一方の端（ワークフロー寄り）からもう一方（エージェント寄り）へ移行でき、コードの変更容易性に最適化されているべき ([Optimized for Change](https://overreacted.io/optimized-for-change/))。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0862fbbb-eebe-433b-b8f2-8b814c1a969f_894x585.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/0862fbbb-eebe-433b-b8f2-8b814c1a969f_894x585.png)
* 時にはエージェントが多すぎることによる決定を覆す必要もある。例: Augment Code の SWE-Bench No.1 エントリ ([Blog](https://www.augmentcode.com/blog/1-open-source-agent-on-swe-bench-verified-by-combining-claude-3-7-and-o1), [Video](https://www.youtube.com/watch?v=Iw_3cRf3lnM)) では、当初のアプローチから変更を加えている。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff91375cc-2cee-44f0-b822-3e1f04aca8ba_1488x382.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/f91375cc-2cee-44f0-b822-3e1f04aca8ba_1488x382.png) ([Tweet](https://x.com/augmentcode/status/1906821537325576385))

## Team Big Model (大規模モデル重視派)

大規模モデル派の視点:

* **Bitter Lesson の経験:** 手作業で調整されたワークフローが、次世代モデルの登場によって一夜にして陳腐化する経験を繰り返してきた。([AI engineering with the Bitter Lesson in mind](https://x.com/swyx/status/1902454997427904865))
* **近年の成功例:** OpenAI の O3 や Google の Gemini Deep Research ([Latent Space記事](https://www.latent.space/p/gdr))、Bolt ([Latent Space記事](https://www.latent.space/p/bolt?utm_source=publication-search))、Manus AI ([YouTube](https://www.youtube.com/watch?v=Xtw6Og7fNG0)) などは、ワークフローエンジニアリングを最小限に抑え、大規模モデルの推論能力を活用して成功している。
* **構造化の限界:** Hyung Won Chung (OpenAI) は、構造を追加することは短期的には有効だが、モデルや計算能力がスケールアップするにつれてパフォーマンスで劣る傾向があると指摘（ただし、これは内部モデルアーキテクチャに関する発言であり、外部システムへの適用は推測）。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F518933ca-2674-4984-9afd-20df1ba73bf6_1188x810.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/518933ca-2674-4984-9afd-20df1ba73bf6_1188x810.png) ([Talk](https://www.youtube.com/watch?v=kYWUEV_e2ss&t=370s))
* **プラットフォーム戦略:** AGI構築や非技術者向けプラットフォームを目指す場合、モデル主導のアプローチは理解できる（データセット/人間フィードバック収集の観点からも）。

## Workflows AND Agents, not OR (ワークフローとエージェント、両方の選択肢)

筆者の見解:

* Harrison Chase は、実際には両方のアプローチのための選択肢を持つことの重要性を認め、バランスの取れた議論を展開している。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F019331c5-299c-4f4e-b103-7cfeb4ae8369_612x488.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/019331c5-299c-4f4e-b103-7cfeb4ae8369_612x488.png)
* 重要なのは、現在の技術水準（Pareto frontier）がどこにあるか、そしてそれをどう進展させるかである。
* **価値を持続するワークフローシステム:** モデルがアップグレードされても価値を維持するワークフローシステムも存在する。例: AlphaCodium ([初期リリース](https://www.qodo.ai/blog/qodoflow-state-of-the-art-code-generation-for-code-contests/), [o1リリース後](https://www.qodo.ai/blog/system-2-thinking-alphacodium-outperforms-direct-prompting-of-openai-o1/)) ([Latent Space ポッドキャスト](https://www.latent.space/p/bolt?utm_source=publication-search)で議論)。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F949940d0-63ba-400d-904c-0cdc37f72175_1494x1140.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/949940d0-63ba-400d-904c-0cdc37f72175_1494x1140.png)

## IMPACT of Agent Frameworks (エージェントフレームワークのインパクト)

* Harrison Chase は、関連するエージェントフレームワークの比較表 ([Google Sheets](https://docs.google.com/spreadsheets/d/1jzgbANBVi6rNzZVsjZC2CSaCU-byXGlSs0bgy2v2GNQ/edit?usp=sharing)) を公開した。
* **IMPACT フレームワーク:** エージェントの定義を記述するためのメタフレームワークとして提案。
  * **I**ntent (意図)
  * **M**emory (記憶)
  * **P**lanning (計画)
  * **A**uth (認証/権限)
  * **C**ontrol flow (制御フロー)
  * **T**ools (ツール)
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff0aee6de-16b7-46ed-9040-c4a40accacf9_1640x855.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/f0aee6de-16b7-46ed-9040-c4a40accacf9_1640x855.png)
* このフレームワークは、エージェントエンジニアが求める抽象化と機能の良いリストであり、フレームワークに不足している点を明確にするのに役立つ。

## The Great Debates (大討論会)

* Latent.Space は、業界の関連する論争について、善意の討論者による「The Great Debates」セッションの提案を受け付けている ([AI Engineer World's Fair 2025 CFP](https://sessionize.com/ai-engineer-worlds-fair-2025))。
  * [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F77b70e86-faa2-4cae-9eaf-cd958863821b_645x566.png)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/77b70e86-faa2-4cae-9eaf-cd958863821b_645x566.png)

---

**注記:**

* この記事は、AI エージェント開発における重要な対立点を浮き彫りにし、それぞれの立場の根拠と、両アプローチを組み合わせる可能性について考察しています。
* 技術的な詳細よりも、概念的な対立と開発思想に焦点を当てています。
* 元の記事にはコメントセクションへのリンクが含まれていますが、要約には含めていません。
