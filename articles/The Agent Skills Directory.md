---
title: "The Agent Skills Directory"
source: "https://skills.sh/"
author:
  - "[[Vercel]]"
published: 2026-01-20
created: 2026-02-17
description: "AIエージェント向けの再利用可能なスキルを発見・インストールできるオープンディレクトリ＆リーダーボードプラットフォーム。npxコマンド一つでClaude Code、Cursor、GitHub Copilotなど主要AIエージェントにスキルを追加できる。"
tags:
  - "clippings"
  - "AI-agents"
  - "developer-tools"
  - "skills"
  - "Vercel"
  - "open-source"
---

## 概要

**Skills.sh** は、Vercelが2026年1月20日にローンチしたAIエージェント向けスキルのオープンディレクトリ＆リーダーボードプラットフォームである。AIエージェントに再利用可能な能力（スキル）をワンコマンドでインストールでき、手続き的な知識へのアクセスを提供する。

## スキルとは何か

スキルとは、AIエージェントの再利用可能な能力のこと。エージェントが特定のタスクをより効果的に遂行できるよう支援する手続き的知識を提供する。プラグインや拡張機能のようなもので、フォルダ内に命令、スクリプト、リソースが格納されている。Anthropicが発案した **Agent Skills標準** に基づいており、ツール間でのポータビリティを重視した設計となっている。

## インストール方法

スキルのインストールはCLIで一行で完了する：

```bash
npx skills add vercel-labs/agent-skills
```

## 対応AIエージェント

以下の主要AIエージェントで利用可能：

- **Claude Code**
- **Cursor**
- **GitHub Copilot**
- **Aider**
- **Goose**
- その他のAIエージェント

## リーダーボードシステム

スキルは匿名のテレメトリデータに基づいてランキングされる。インストール時に収集される集計データにより、エコシステム内で最も人気があり有用なスキルが浮上する仕組み。テレメトリは完全に匿名で、どのスキルがインストールされたかのみを追跡し、個人情報や利用パターンは収集されない。

表示モード：
- **All Time**（累計 61,854件以上）
- **Trending (24h)**（直近24時間のトレンド）
- **Hot**（注目のスキル）

## 人気スキル TOP 10（累計インストール数）

| 順位 | スキル名 | 提供元 | インストール数 |
|------|----------|--------|---------------|
| 1 | find-skills | vercel-labs/skills | 246.1K |
| 2 | vercel-react-best-practices | vercel-labs/agent-skills | 139.4K |
| 3 | web-design-guidelines | vercel-labs/agent-skills | 105.4K |
| 4 | remotion-best-practices | remotion-dev/skills | 95.0K |
| 5 | frontend-design | anthropics/skills | 74.7K |
| 6 | vercel-composition-patterns | vercel-labs/agent-skills | 43.8K |
| 7 | agent-browser | vercel-labs/agent-browser | 40.5K |
| 8 | skill-creator | anthropics/skills | 36.7K |
| 9 | browser-use | browser-use/browser-use | 32.0K |
| 10 | vercel-react-native-skills | vercel-labs/agent-skills | 31.4K |

## 主要カテゴリ別スキル

### 開発ベストプラクティス
- **vercel-react-best-practices** — React パフォーマンス最適化ガイドライン
- **web-design-guidelines** — Webデザインガイドライン
- **vercel-composition-patterns** — コンポジションパターン
- **next-best-practices** — Next.js ベストプラクティス
- **supabase-postgres-best-practices** — Supabase/PostgreSQL ベストプラクティス
- **better-auth-best-practices** — 認証ベストプラクティス
- **vue-best-practices** — Vue.js ベストプラクティス
- **react-native-best-practices** — React Native ベストプラクティス

### デザイン＆UI
- **frontend-design** — フロントエンドデザイン
- **ui-ux-pro-max** — UI/UXデザイン
- **tailwind-design-system** — Tailwindデザインシステム
- **canvas-design** — Canvasデザイン
- **interface-design** — インターフェースデザイン

### ドキュメント処理
- **pdf** — PDF処理
- **docx** — Word文書処理
- **pptx** — PowerPoint処理
- **xlsx** — Excel処理

### マーケティング（coreyhaines31/marketingskills）
- **seo-audit** — SEO監査
- **copywriting** — コピーライティング
- **marketing-psychology** — マーケティング心理学
- **content-strategy** — コンテンツ戦略
- **programmatic-seo** — プログラマティックSEO
- 他多数（約20種以上のマーケティング関連スキル）

### 開発ワークフロー（obra/superpowers）
- **brainstorming** — ブレインストーミング
- **systematic-debugging** — 体系的デバッグ
- **writing-plans** — 計画作成
- **test-driven-development** — テスト駆動開発
- **executing-plans** — 計画実行
- **subagent-driven-development** — サブエージェント駆動開発

### ブラウザ＆ツール
- **agent-browser** — ブラウザ自動操作
- **browser-use** — ブラウザ利用
- **mcp-builder** — MCP構築
- **firecrawl** — Webスクレイピング

### フレームワーク固有
- **Expo** — building-native-ui, native-data-fetching, expo-deployment 等
- **Vue/Nuxt** — vue-best-practices, vue-debug-guides, nuxt, pinia 等（antfu/skills）
- **Angular** — angular-component（analogjs）
- **Flutter** — flutter-animations, flutter-expert

## セキュリティ

定期的なセキュリティ監査が実施され、悪意のあるコンテンツがないかスキルとその内容が評価されている。ただし、すべてのスキルの品質やセキュリティを保証するものではなく、インストール前にレビューすることが推奨されている。セキュリティ問題の報告先は [security.vercel.com](https://security.vercel.com/)。

## 注意点・制限事項

- **料金**: 100%無料、サブスクリプションなし
- **品質のばらつき**: 開発者によると、コミュニティスキルの約80%は低品質とされる。**Vercel、Anthropic、GitHub**などのベンダー提供スキルの利用が推奨される
- **セキュリティ保証なし**: 定期監査はあるが、すべてのスキルの品質・安全性は保証されない
- **テレメトリ**: インストール時に匿名のテレメトリデータが収集される（オプトアウト可能かは不明）
