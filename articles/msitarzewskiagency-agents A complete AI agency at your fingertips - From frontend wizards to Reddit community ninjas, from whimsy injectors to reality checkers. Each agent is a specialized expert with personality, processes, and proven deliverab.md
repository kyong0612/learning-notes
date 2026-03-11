---
title: "msitarzewski/agency-agents: A complete AI agency at your fingertips - From frontend wizards to Reddit community ninjas, from whimsy injectors to reality checkers. Each agent is a specialized expert with personality, processes, and proven deliverables."
source: "https://github.com/msitarzewski/agency-agents"
author:
  - "[[msitarzewski]]"
published:
created: 2026-03-11
description: "Redditの議論から生まれた、112以上の専門AIエージェントパーソナリティのコレクション。エンジニアリング、デザイン、マーケティング、テスト、ゲーム開発など11部門にわたり、各エージェントは独自の個性・ワークフロー・成功指標を持つ。Claude Code、Cursor、Aider、Windsurf等の主要AIコーディングツールと統合可能。"
tags:
  - "clippings"
  - "ai-agents"
  - "prompt-engineering"
  - "claude-code"
  - "multi-agent-system"
  - "developer-tools"
---

## 概要

**The Agency** は、Redditのスレッドと数ヶ月の反復から生まれた、精巧に作り込まれたAIエージェントパーソナリティの成長するコレクションである。各エージェントは以下の特徴を持つ：

- **専門特化**: 汎用プロンプトテンプレートではなく、各ドメインに深い専門性
- **パーソナリティ駆動**: 独自の声、コミュニケーションスタイル、アプローチ
- **成果物重視**: 実際のコード、プロセス、測定可能なアウトカム
- **本番対応**: 実戦テスト済みのワークフローと成功指標

## 統計

- **112の専門エージェント**（11部門）
- **10,000行以上**のパーソナリティ、プロセス、コード例
- **数ヶ月の反復**（実際の使用からのフィードバック）
- Reddit公開後**12時間以内に50件以上のリクエスト**

## クイックスタート

### Option 1: Claude Code（推奨）

```bash
cp -r agency-agents/* ~/.claude/agents/
```

Claude Codeセッション内でエージェントを呼び出すだけで使用可能。

### Option 2: リファレンスとして使用

各エージェントファイルには、アイデンティティ・個性、コアミッション・ワークフロー、技術的成果物（コード例付き）、成功指標・コミュニケーションスタイルが含まれる。

### Option 3: 他ツール連携（Cursor, Aider, Windsurf, Gemini CLI, OpenCode等）

```bash
./scripts/convert.sh    # 統合ファイル生成
./scripts/install.sh    # インタラクティブインストール（自動検出）
```

## エージェント一覧（11部門）

### 💻 Engineering Division（8エージェント）

| エージェント | 専門分野 | 用途 |
|---|---|---|
| Frontend Developer | React/Vue/Angular, UI実装, パフォーマンス | モダンWebアプリ、Core Web Vitals最適化 |
| Backend Architect | API設計, DB設計, スケーラビリティ | サーバーサイドシステム、マイクロサービス |
| Mobile App Builder | iOS/Android, React Native, Flutter | ネイティブ・クロスプラットフォームモバイルアプリ |
| AI Engineer | MLモデル、デプロイ、AI統合 | 機械学習機能、データパイプライン |
| DevOps Automator | CI/CD、インフラ自動化 | パイプライン開発、デプロイ自動化 |
| Rapid Prototyper | 高速POC開発、MVP | プロトタイプ、ハッカソン |
| Senior Developer | Laravel/Livewire、高度なパターン | 複雑な実装、アーキテクチャ決定 |
| Security Engineer | 脅威モデリング、セキュアコードレビュー | アプリセキュリティ、脆弱性評価 |

### 🎨 Design Division（7エージェント）

| エージェント | 専門分野 | 用途 |
|---|---|---|
| UI Designer | ビジュアルデザイン、コンポーネントライブラリ | インターフェース作成、ブランド一貫性 |
| UX Researcher | ユーザーテスト、行動分析 | ユーザビリティテスト、デザインインサイト |
| UX Architect | 技術アーキテクチャ、CSSシステム | 開発者フレンドリーな基盤 |
| Brand Guardian | ブランドアイデンティティ、一貫性 | ブランド戦略、ガイドライン |
| Visual Storyteller | ビジュアルナラティブ | 視覚的ストーリーテリング |
| Whimsy Injector | 遊び心、マイクロインタラクション | Easter eggs、ブランドパーソナリティ |
| Image Prompt Engineer | AI画像生成プロンプト | Midjourney, DALL-E, Stable Diffusion向け |

### 💰 Paid Media Division（7エージェント）

広告費を測定可能なビジネス成果に変換する部門。PPC Campaign Strategist、Search Query Analyst、Paid Media Auditor（200+ポイント監査）、Tracking & Measurement Specialist（GTM, GA4, CAPI）、Ad Creative Strategist、Programmatic & Display Buyer、Paid Social Strategist が所属。

### 📢 Marketing Division（11エージェント）

Growth Hacker、Content Creator、Twitter Engager、TikTok Strategist、Instagram Curator、Reddit Community Builder、App Store Optimizer、Social Media Strategist に加え、中国市場向けの **Xiaohongshu Specialist**、**WeChat Official Account Manager**、**Zhihu Strategist** を含む。

### 📊 Product Division（3エージェント）

Sprint Prioritizer（アジャイル計画、機能優先順位付け）、Trend Researcher（市場インテリジェンス、競合分析）、Feedback Synthesizer（ユーザーフィードバック分析）。

### 🎬 Project Management Division（5エージェント）

Studio Producer（ハイレベルオーケストレーション）、Project Shepherd（クロスファンクショナル調整）、Studio Operations（日常効率化）、Experiment Tracker（A/Bテスト）、Senior Project Manager（リアルなスコーピング）。

### 🧪 Testing Division（8エージェント）

Evidence Collector（スクリーンショットQA）、Reality Checker（エビデンスベース認証）、Test Results Analyzer、Performance Benchmarker、API Tester、Tool Evaluator、Workflow Optimizer、**Accessibility Auditor**（WCAG監査、支援技術テスト）。

### 🛟 Support Division（6エージェント）

Support Responder、Analytics Reporter、Finance Tracker、Infrastructure Maintainer、Legal Compliance Checker、Executive Summary Generator。

### 🥽 Spatial Computing Division（6エージェント）

XR Interface Architect、macOS Spatial/Metal Engineer、XR Immersive Developer（WebXR）、XR Cockpit Interaction Specialist、visionOS Spatial Engineer（Apple Vision Pro）、Terminal Integration Specialist。

### 🎮 Game Development Division（16エージェント）

**クロスエンジン（5）**: Game Designer, Level Designer, Technical Artist, Game Audio Engineer, Narrative Designer

**Unity（4）**: Unity Architect, Shader Graph Artist, Multiplayer Engineer, Editor Tool Developer

**Unreal Engine（4）**: Systems Engineer, Technical Artist, Multiplayer Architect, World Builder

**Godot（3）**: Gameplay Scripter, Multiplayer Engineer, Shader Developer

**Roblox Studio（3）**: Systems Scripter, Experience Designer, Avatar Creator

### 🎯 Specialized Division（8エージェント）

Agents Orchestrator（マルチエージェント調整）、Data Analytics Reporter、LSP/Index Engineer、Sales Data Extraction Agent、Data Consolidation Agent、Report Distribution Agent、**Agentic Identity & Trust Architect**（エージェント認証・信頼検証）、**Identity Graph Operator**（共有IDレゾリューション）。

## 実世界ユースケース

### Scenario 1: スタートアップMVP構築

Frontend Developer + Backend Architect + Growth Hacker + Rapid Prototyper + Reality Checker の5名チームで、各ステージで専門知識を活用し迅速にリリース。

### Scenario 2: マーケティングキャンペーンローンチ

Content Creator + Twitter Engager + Instagram Curator + Reddit Community Builder + Analytics Reporter による、プラットフォーム固有の専門知識を持つマルチチャネル協調キャンペーン。

### Scenario 3: エンタープライズ機能開発

Senior PM + Senior Developer + UI Designer + Experiment Tracker + Evidence Collector + Reality Checker による、品質ゲートとドキュメント付きのエンタープライズグレードデリバリー。

### Scenario 4: ペイドメディアアカウントテイクオーバー

Paid Media Auditor → Tracking Specialist → PPC Strategist → Search Query Analyst → Ad Creative Strategist → Analytics Reporter の連携で、30日以内にトラッキング検証・無駄排除・構造最適化・クリエイティブ刷新を完了。

### Scenario 5: フルエージェンシー製品ディスカバリー

8部門が並列に単一ミッションに取り組み、市場検証・技術アーキテクチャ・ブランド戦略・GTM・サポートシステム・UXリサーチ・プロジェクト実行・空間UIデザインをカバーする統合製品計画を1セッションで生成。

## マルチツール統合

| ツール | 形式 | インストール先 |
|---|---|---|
| **Claude Code**（ネイティブ） | `.md` | `~/.claude/agents/` |
| **GitHub Copilot** | `.md` | `~/.github/agents/` |
| **Antigravity (Gemini)** | `SKILL.md` | `~/.gemini/antigravity/skills/` |
| **Gemini CLI** | Extension + `SKILL.md` | `~/.gemini/extensions/agency-agents/` |
| **OpenCode** | `.md` | `.opencode/agents/` |
| **Cursor** | `.mdc` | `.cursor/rules/` |
| **Aider** | 単一 `CONVENTIONS.md` | `./CONVENTIONS.md` |
| **Windsurf** | 単一 `.windsurfrules` | `./.windsurfrules` |
| **OpenClaw** | `SOUL.md` + `AGENTS.md` + `IDENTITY.md` | エージェントごと |

インストールスクリプトはシステムをスキャンしてインストール済みツールを自動検出し、チェックボックスUIで選択可能。

## エージェント設計哲学

1. **強い個性**: 汎用テンプレートではなく、本物のキャラクターと声
2. **明確な成果物**: 曖昧なガイダンスではなく、具体的なアウトプット
3. **成功指標**: 測定可能な結果と品質基準
4. **実証済みワークフロー**: 段階的プロセス
5. **学習メモリ**: パターン認識と継続的改善

## 他との差別化

- **汎用AIプロンプト**との違い: 個性とプロセスを持つ深い専門特化
- **プロンプトライブラリ**との違い: ワークフローと成果物を含む包括的エージェントシステム
- **AIツール**との違い: 透明でフォーク可能、適応可能なエージェントパーソナリティ

## コミュニティ・ロードマップ

- MITライセンス（商用・個人利用自由）
- 中国語翻訳（簡体字）あり：[agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh)（100エージェント翻訳 + 中国市場向け9オリジナル）
- 今後の計画: インタラクティブエージェント選択Webツール、ビデオチュートリアル、コミュニティマーケットプレイス、プロジェクトマッチング用「パーソナリティクイズ」
