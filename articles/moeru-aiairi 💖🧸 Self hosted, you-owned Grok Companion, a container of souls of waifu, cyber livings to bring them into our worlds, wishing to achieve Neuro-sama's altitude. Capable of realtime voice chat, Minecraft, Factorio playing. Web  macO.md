---
title: "moeru-ai/airi: 💖🧸 Self hosted, you-owned Grok Companion, a container of souls of waifu, cyber livings to bring them into our worlds, wishing to achieve Neuro-sama's altitude. Capable of realtime voice chat, Minecraft, Factorio playing. Web / macOS / Windows supported."
source: "https://github.com/moeru-ai/airi"
author:
  - "moeru-ai"
published:
created: 2026-03-07
description: "Neuro-samaにインスパイアされたオープンソースのAIコンパニオンプロジェクト。セルフホスト可能で、リアルタイム音声チャット、Minecraft・Factorioのゲームプレイ、Discord/Telegram連携などを備えたデジタルコンパニオンをWeb/デスクトップ/モバイルで実現する。"
tags:
  - "clippings"
  - "ai-companion"
  - "vtuber"
  - "open-source"
  - "llm"
  - "game-ai"
---

## 概要

**Project AIRI** は、[Neuro-sama](https://www.youtube.com/@Neurosama)にインスパイアされたオープンソースプロジェクトで、「AIワイフ / バーチャルキャラクターの魂の容器」を再現することを目指している。セルフホスト型のデジタルコンパニオンを**いつでも、どこでも**所有・利用できることがコンセプト。

既存のチャットベースのAIプラットフォーム（Character.ai、JanitorAI、SillyTavernなど）と異なり、AIRIは**ゲームプレイ、音声チャット、マルチプラットフォーム対応**を統合したリッチなインタラクションを提供する。

> ⚠️ プロジェクトに関連する公式の暗号通貨やトークンは存在しない。

> ⭐ GitHub Stars: 約29,900

---

## 技術的特徴

AIRIは初日から多くの**Web技術**を活用して構築されている:

- **WebGPU** — GPU加速処理
- **WebAudio** — 音声処理
- **Web Workers** — 並列処理
- **WebAssembly** — 高性能計算
- **WebSocket** — リアルタイム通信

これにより、**モダンブラウザ・モバイルデバイス（PWA対応）で動作可能**。

デスクトップ版では、ネイティブの**NVIDIA CUDA**および**Apple Metal**をサポート（HuggingFace [candle](https://github.com/huggingface/candle) プロジェクトにより実現）。複雑な依存関係管理なしに高性能な推論が可能。

---

## 現在の機能（進捗状況）

### 🧠 Brain（頭脳）
- ✅ [Minecraft](https://www.minecraft.net) プレイ
- ✅ [Factorio](https://www.factorio.com) プレイ（WIP、PoCデモあり）
- ✅ [Telegram](https://telegram.org) チャット
- ✅ [Discord](https://discord.com) チャット
- ✅ ブラウザ内データベース（DuckDB WASM / pglite）
- 🚧 Memory Alaya（開発中）
- 🚧 ブラウザ内ローカル推論（WebGPU）

### 👂 Ears（聴覚）
- ✅ ブラウザからの音声入力
- ✅ Discordからの音声入力
- ✅ クライアントサイド音声認識
- ✅ 発話検知

### 👄 Mouth（発話）
- ✅ [ElevenLabs](https://elevenlabs.io/) 音声合成

### 🧍 Body（身体）
- ✅ VRMモデルサポート（制御・アニメーション・自動まばたき・視線追従・アイドル時の目の動き）
- ✅ Live2Dモデルサポート（制御・アニメーション・自動まばたき・視線追従・アイドル時の目の動き）

---

## 対応LLM APIプロバイダー

[xsai](https://github.com/moeru-ai/xsai) を利用して、以下を含む多数のプロバイダーに対応:

- **主要プロバイダー**: OpenAI, Anthropic Claude, Google Gemini, DeepSeek, xAI, Mistral, Groq
- **推論ランタイム**: vLLM, SGLang, Ollama
- **ルーター/アグリゲーター**: OpenRouter, AIHubMix, 302.AI
- **クラウドサービス**: Cloudflare Workers AI, Together.ai, Fireworks.ai, Novita, SiliconFlow
- **中国系プロバイダー**: Qwen, Zhipu, Baichuan, Minimax, Moonshot AI, ModelScope, Stepfun, Tencent Cloud
- その他多数（計25+プロバイダー）

---

## プラットフォーム対応

| プラットフォーム | コマンド | 備考 |
|---|---|---|
| **Web（ブラウザ）** | `pnpm dev` | [airi.moeru.ai](https://airi.moeru.ai) で公開 |
| **デスクトップ（Tamagotchi）** | `pnpm dev:tamagotchi` | macOS / Windows対応、Nixパッケージあり |
| **モバイル（Pocket）** | `pnpm dev:pocket` | iOS対応（Capacitor + Xcode） |

---

## アーキテクチャ

プロジェクトはモジュラー構造を採用:

- **Core** — 中核ロジック（LLM連携、メモリ、音声認識）
- **Stage** — UI・プレゼンテーション層（VRM/Live2Dレンダリング）
- **Server Components** — サーバーサイドSDK・ランタイム
- **Game Agents** — Minecraft Agent（Mineflayer経由）、Factorio Agent（RCON API経由）

すべてが [xsAI](https://github.com/moeru-ai/xsai) を通じてLLMと連携する。

---

## 派生プロジェクト

AIRIから多数のサブプロジェクトが生まれている:

- [**Awesome AI VTuber**](https://github.com/proj-airi/awesome-ai-vtuber) — AI VTuberのキュレーションリスト
- [**unspeech**](https://github.com/moeru-ai/unspeech) — ASR/TTS向けユニバーサルプロキシサーバー
- [**xsai**](https://github.com/moeru-ai/xsai) — 軽量LLM対話ライブラリ（Vercel AI SDK的だが極小）
- [**MCP Launcher**](https://github.com/moeru-ai/mcp-launcher) — MCPサーバーの簡易ビルダー＆ランチャー
- [**WebAI: Realtime Voice Chat**](https://github.com/proj-airi/webai-realtime-voice-chat) — VAD+STT+LLM+TTSによるリアルタイム音声チャットの完全実装例
- [**tauri-plugin-mcp**](https://github.com/moeru-ai/airi/blob/main/crates/tauri-plugin-mcp/README.md) — MCPサーバー連携用Tauriプラグイン
- [**demodel**](https://github.com/moeru-ai/demodel) — モデル/データセットの高速ダウンロードツール
- [**Velin**](https://github.com/luoling8192/velin) — Vue SFC + MarkdownでLLM向けステートフルプロンプトを記述

---

## 類似プロジェクト（オープンソース）

| プロジェクト | 特徴 |
|---|---|
| [kimjammer/Neuro](https://github.com/kimjammer/Neuro) | 完成度の高いNeuro-sama再現 |
| [SugarcaneDefender/z-waif](https://github.com/SugarcaneDefender/z-waif) | ゲーミング・自律行動・プロンプトエンジニアリングに優れる |
| [semperai/amica](https://github.com/semperai/amica/) | VRM・WebXRに強い |
| [elizaOS/eliza](https://github.com/elizaOS/eliza) | エージェント統合の優れた設計例 |
| [t41372/Open-LLM-VTuber](https://github.com/t41372/Open-LLM-VTuber) | オープンLLM VTuber |

---

## コントリビューション募集分野

プロジェクトは開発初期段階であり、以下の分野で貢献者を募集中:

- Live2D / VRMモデリング、VRChatアバターデザイン
- コンピュータビジョン、強化学習
- 音声認識・音声合成
- ONNX Runtime、Transformers.js
- WebGPU、Three.js、WebXR
- vLLM

---

## 制限事項・注意点

- プロジェクトは**開発初期段階**であり、多くの機能がWIP
- Memory Alaya（高度なメモリシステム）は未完成
- ブラウザ内ローカル推論（WebGPU）は未実装
- Azure OpenAI API、AWS Claude、一部中国系プロバイダー（Sparks、Volcano Engine）は未対応（PR歓迎）
- 公式の暗号通貨・トークンは存在しない（詐欺に注意）