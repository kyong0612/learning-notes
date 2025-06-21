---
title: "awesome-llm-apps/advanced_ai_agents/multi_agent_apps/ai_mental_wellbeing_agent/ai_mental_wellbeing_agent.py at main · Shubhamsaboo/awesome-llm-apps"
source: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/ai_mental_wellbeing_agent/ai_mental_wellbeing_agent.py"
author:
  - "[[Shubhamsaboo]]"
published: 2024-07-23
created: 2025-06-21
description: |
  A Streamlit application that uses a multi-agent AI system (powered by Autogen and OpenAI's GPT-4o) to generate a personalized mental health support plan. It gathers user input on their emotional state, stress, and symptoms, then uses three specialized agents (Assessment, Action, and Follow-up) to create a comprehensive report.
tags:
  - "AI"
  - "LLM"
  - "Agent"
  - "AutoGen"
  - "Streamlit"
  - "MentalHealth"
  - "MultiAgentSystem"
  - "Python"
---

このPythonスクリプトは、`Streamlit`と`AutoGen`ライブラリを使用して構築された、精神的ウェルビーイング（心の健康）を支援するためのAIエージェントアプリケーションです。ユーザーからの入力に基づき、パーソナライズされたメンタルヘルスサポートプランを生成します。

## 概要

このアプリケーションは、ユーザーが自身の感情状態、ストレスレベル、睡眠パターンなどを入力するためのWebインターフェースを提供します。入力が完了すると、3つの専門的なAIエージェントからなるチームが連携し、状況分析、行動計画、長期的なフォローアップ戦略を含む包括的なレポートを作成します。

## 機能

### 1. ユーザー入力

アプリケーションは以下の情報をユーザーから収集します。

- **感情状態**: 最近の感情、思考、懸念事項に関する自由記述。
- **睡眠パターン**: 1日あたりの睡眠時間。
- **ストレスレベル**: 1から10のスケールでの現在のストレスレベル。
- **サポートシステム**: 家族、友人、セラピストなど、現在の支援状況。
- **最近の生活の変化**: 仕事、人間関係、喪失体験などの重要な出来事。
- **現在の症状**: 不安、うつ、不眠、疲労感など、多岐にわたる症状から選択。

### 2. AIエージェントチーム

このアプリケーションの中核をなすのは、`AutoGen Swarm`を利用して構築された3つのAIエージェントです。

- **🧠 Assessment Agent (分析エージェント)**:
  - ユーザーの状況と感情的なニーズを分析します。
  - 臨床的な精度と共感を持ち、安全な空間を提供しながら状況を評価します。
- **🎯 Action Agent (行動計画エージェント)**:
  - 即座に実行可能な行動計画とリソースを提供します。
  - 具体的な対処法、ウェルネスプラン、サポートコミュニティへの接続を提案します。
- **🔄 Follow-up Agent (フォローアップエージェント)**:
  - 長期的なサポート戦略と回復計画を設計します。
  - 進捗のモニタリングシステムや再発防止策を提案し、持続可能な習慣作りを支援します。

### 3. 処理フロー

1. ユーザーがフォームに情報を入力し、「サポートプランを取得」ボタンをクリックします。
2. 入力内容からタスクが生成され、`Assessment Agent`から始まるエージェント間の「スウォームチャット」が開始されます。
3. `Assessment` → `Action` → `Follow-up`の順でエージェントが連携し、各エージェントは前のエージェントの出力をコンテキストとして利用します。
4. 各エージェントはまず自身の担当分野に関する短い要約を生成し、それを用いて詳細なレポート部分を作成します。
5. 最終的な出力は「状況評価」「行動計画とリソース」「長期的なサポート戦略」の3つのセクションに分割され、StreamlitのUI上に表示されます。

## 技術スタック

- **Webフレームワーク**: `Streamlit`
- **AIエージェント**: `AutoGen` (特に `SwarmAgent`)
- **LLM**: `OpenAI GPT-4o` (ユーザーが自身のAPIキーを提供する必要がある)

## 重要な注意喚起

このアプリケーションは、専門的な医療の代替となるものではないことが明確に警告されています。深刻な危機状態にある場合は、国の危機管理ホットライン（988）や救急サービス（911）に連絡し、速やかに専門家の助けを求めるよう促しています。

[Skip to content](https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/ai_mental_wellbeing_agent/#start-of-content)

[Open in github.dev](https://github.dev/) [Open in a new github.dev tab](https://github.dev/) [Open in codespace](https://github.com/codespaces/new/Shubhamsaboo/awesome-llm-apps/tree/main?resume=1)

## Latest commit

[ea3fe69](https://github.com/Shubhamsaboo/awesome-llm-apps/commit/ea3fe6913b5a3f8178d2405f9f87f85947cc76c6) ·
