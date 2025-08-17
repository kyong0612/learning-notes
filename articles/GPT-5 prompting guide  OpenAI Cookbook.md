---
title: "GPT-5 prompting guide | OpenAI Cookbook"
source: "https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide"
author:
  - Anoop Kotha(OpenAI)
  - Julian Lee(OpenAI)
  - Eric Zakariasson
  - et al.
published: 2025-08-07
created: 2025-08-17
description: |
  GPT-5は、エージェント的なタスク性能、コーディング、生の知能、および操作性において大幅な進歩を遂げた、OpenAIの最新フラッグシップモデルです。
tags:
  - "GPT-5"
  - "Prompting Guide"
  - "Agentic Workflow"
  - "Coding"
  - "API"
---

# GPT-5 プロンプティングガイド

## 概要

GPT-5は、エージェント的なタスク性能、コーディング、生の知能、および操作性において大幅な進歩を遂げた、OpenAIの最新フラッグシップモデルです。このガイドでは、モデルの出力を最大化するためのプロンプティングのヒントを、具体的な例を交えて解説します。

## エージェントワークフローの予測可能性

GPT-5は、ツール呼び出し、指示追従、長いコンテキストの理解を向上させ、エージェントアプリケーションの基盤モデルとなるようにトレーニングされています。

### エージェントの積極性の制御

モデルの自律性と応答性のバランスをプロンプトで調整できます。

- **積極性を抑える場合**: `reasoning_effort`を低く設定し、プロンプトで明確な探索基準を定義します。これにより、不要なツール呼び出しを減らし、応答速度を向上させます。

  ```xml
  <context_gathering>
  Goal: Get enough context fast. Parallelize discovery and stop as soon as you can act.

  Method:
  - Start broad, then fan out to focused subqueries.
  - In parallel, launch varied queries; read top hits per query. Deduplicate paths and cache; don’t repeat queries.
  - Avoid over searching for context. If needed, run targeted searches in one parallel batch.

  Early stop criteria:
  - You can name exact content to change.
  - Top hits converge (~70%) on one area/path.

  Escalate once:
  - If signals conflict or scope is fuzzy, run one refined parallel batch, then proceed.

  Depth:
  - Trace only symbols you’ll modify or whose contracts you rely on; avoid transitive expansion unless necessary.

  Loop:
  - Batch search → minimal plan → complete task.
  - Search again only if validation fails or new unknowns appear. Prefer acting over more searching.
  </context_gathering>
  ```

- **積極性を高める場合**: `reasoning_effort`を高く設定し、ユーザーのクエリが完全に解決されるまで自律的にタスクを続行するように促します。

  ```xml
  <persistence>
  - You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
  - Only terminate your turn when you are sure that the problem is solved.
  - Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
  - Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
  </persistence>
  ```

### ツールのプリアンブル

GPT-5は、ツール呼び出しの目的や計画をユーザーに伝える「ツールのプリアンブル」メッセージを生成するようにトレーニングされています。プロンプトでプリアンブルの頻度、スタイル、内容を制御できます。

```xml
<tool_preambles>
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.
- Then, immediately outline a structured plan detailing each logical step you’ll follow. - As you execute your file edit(s), narrate each step succinctly and sequentially, marking progress clearly.
- Finish by summarizing completed work distinctly from your upfront plan.
</tool_preambles>
```

### Reasoning Effort

`reasoning_effort`パラメータで、モデルがどれだけ深く思考し、ツールを呼び出すかを制御します。デフォルトは`medium`ですが、タスクの複雑さに応じて調整することが推奨されます。

### Responses APIによる推論コンテキストの再利用

Responses APIを使用することで、エージェントのフローを改善し、コストとトークン使用量を削減できます。`previous_response_id`を含めることで、モデルが以前の推論を参照できるようになり、パフォーマンスが向上します。

## コーディング性能の最大化

GPT-5は、大規模なコードベースでのバグ修正、大規模な差分の処理、複数ファイルにまたがるリファクタリングなど、コーディング能力に優れています。

### フロントエンドアプリ開発

- **推奨フレームワークとパッケージ**:
  - フレームワーク: Next.js (TypeScript), React, HTML
  - スタイリング/UI: Tailwind CSS, shadcn/ui, Radix Themes
  - アイコン: Material Symbols, Heroicons, Lucide
  - アニメーション: Motion
  - フォント: San Serif, Inter, Geist, Mona Sans, IBM Plex Sans, Manrope

- **ゼロからのアプリ生成**: モデルに自己評価基準を作成させ、それに従って反復的に開発させるプロンプトが有効です。

  ```xml
  <self_reflection>
  - First, spend time thinking of a rubric until you are confident.
  - Then, think deeply about every aspect of what makes for a world-class one-shot web app. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
  - Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
  </self_reflection>
  ```

- **コードベースの設計基準への適合**: 既存のアプリに変更を加える際は、コードベースのスタイルや設計基準に従うように指示します。

  ```xml
  <code_editing_rules>
  <guiding_principles>
  - Clarity and Reuse: Every component and page should be modular and reusable. Avoid duplication by factoring repeated UI patterns into components.
  - Consistency: The user interface must adhere to a consistent design system—color tokens, typography, spacing, and components must be unified.
  - Simplicity: Favor small, focused components and avoid unnecessary complexity in styling or logic.
  </guiding_principles>
  <frontend_stack_defaults>
  - Framework: Next.js (TypeScript)
  - Styling: TailwindCSS
  - UI Components: shadcn/ui
  </frontend_stack_defaults>
  <ui_ux_best_practices>
  - Visual Hierarchy: Limit typography to 4–5 font sizes and weights for consistent hierarchy.
  - Color Usage: Use 1 neutral base (e.g., `zinc`) and up to 2 accent colors.
  - Spacing and Layout: Always use multiples of 4 for padding and margins.
  </ui_ux_best_practices>
  </code_editing_rules>
  ```

### CursorのGPT-5プロンプトチューニング

AIコードエディタCursorは、GPT-5のアルファテスターとして、モデルの能力を最大限に引き出すためのプロンプトチューニングを行いました。

- **システムプロンプトとパラメータチューニング**: 冗長性と自律性のバランスを取りながら、信頼性の高いツール呼び出しに焦点を当てました。`verbosity` APIパラメータを低く設定し、プロンプトでコーディングツールのみ詳細な出力を促すことで、効率的なステータス更新と読みやすいコード差分を両立させました。

  ```
  Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Use high verbosity for writing code and code tools.
  ```

- **コンテキスト理解の最大化**: GPT-5は元々文脈を深く分析するため、過度な情報収集を促すプロンプト（例: `Be THOROUGH when gathering information`）は、特に小規模なタスクで逆効果になることがありました。プロンプトの表現を和らげることで、内部知識と外部ツールの利用のバランスを改善しました。

  **修正前:**

  ```xml
  <maximize_context_understanding>
  Be THOROUGH when gathering information. Make sure you have the FULL picture before replying.
  </maximize_context_understanding>
  ```

  **修正後:**

  ```xml
  <context_understanding>
  If you've performed an edit that may partially fulfill the USER's query, but you're not confident, gather more information or use more tools before ending your turn.
  Bias towards not asking the user for help if you can find the answer yourself.
  </context_understanding>
  ```

## 知能と指示追従の最適化

### ステアリング

GPT-5は、冗長性、トーン、ツール呼び出しの振る舞いに関するプロンプトの指示に非常に敏感です。

- **冗長性**: `verbosity` APIパラメータで最終的な回答の長さを制御できます。プロンプト内で特定のコンテキストに対して自然言語で冗長性を上書きすることも可能です。

### 指示追従

GPT-5は指示に正確に従いますが、矛盾した指示や曖昧な指示を含むプロンプトは、他のモデルよりも性能を損なう可能性があります。プロンプト内の矛盾を解決することで、より効率的で高性能な推論が期待できます。

**悪い例（矛盾した指示）:**

- `Never schedule an appointment without explicit patient consent` と `auto-assign the earliest same-day slot without contacting the patient` が矛盾。
- `Always look up the patient profile before taking any other actions` と `escalate as EMERGENCY ... before any scheduling step` が矛盾。

これらの矛盾を解消することで、モデルのパフォーマンスは大幅に向上します。

### 最小限の推論

GPT-5では、レイテンシーが重要なユースケース向けに、最小限の推論（`minimal reasoning`）が導入されました。このモードでは、思考プロセスを要約させたり、エージェントの永続性を促すリマインダーを挿入したりするなど、GPT-4.1と同様のプロンプティングパターンが有効です。

```
Remember, you are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Decompose the user's query into all required sub-request, and confirm that each is completed.
```

### Markdownフォーマット

デフォルトではMarkdownフォーマットは無効ですが、プロンプトで指示することで、階層的なMarkdownの回答を生成させることができます。

```
- Use Markdown **only where semantically correct** (e.g., `inline code`, ```code fences```, lists, tables).
- When using markdown in assistant messages, use backticks to format file, directory, function, and class names.
```

### メタプロンプティング

GPT-5自体を使って、GPT-5向けのプロンプトを最適化することも非常に効果的です。望ましくない振る舞いを修正するために、どのような変更が必要かをGPT-5に尋ねることで、プロンプトを改善できます。

```
When asked to optimize prompts, give answers from your own perspective - explain what specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior or prevent the undesired behavior.

Here's a prompt: [PROMPT]

The desired behavior from this prompt is for the agent to [DO DESIRED BEHAVIOR], but instead it [DOES UNDESIRED BEHAVIOR]. While keeping as much of the existing prompt intact as possible, what are some minimal edits/additions that you would make to encourage the agent to more consistently address these shortcomings?
```

## 主要なポイント

- **明確な指示**: GPT-5は指示に忠実です。プロンプト内の矛盾や曖昧さをなくし、一貫した指示を与えることが重要です。
- **コンテキストの制御**: タスクに応じて、エージェントの積極性や思考の深さ (`reasoning_effort`) をプロンプトで制御します。
- **具体的アプローチ**: 抽象的な指示よりも、具体的なルールやフレームワーク（例: `<code_editing_rules>`）を提示する方が、高品質な出力を得やすくなります。
- **イテレーション**: GPT-5自身にプロンプトを評価・修正させる「メタプロンプティング」を活用し、継続的にプロンプトを改善しましょう。
- **APIの活用**: エージェント的なタスクでは `Responses API` を、速度が求められる場面では `minimal reasoning` を活用するなど、タスクに応じて最適なAPIやパラメータを選択します。
