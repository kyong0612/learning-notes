---
title: "Introducing: React Best Practices"
source: "https://vercel.com/blog/introducing-react-best-practices"
author:
  - "[[Shu Ding]]"
  - "[[Andrew Qu]]"
published: 2026-01-14
created: 2026-01-16
description: "Vercelが10年以上にわたるReactとNext.jsの最適化知識をreact-best-practicesリポジトリにまとめ、AIエージェントやLLM向けに構造化。パフォーマンス改善のための40以上のルールを8カテゴリで提供し、ウォーターフォールの排除やバンドルサイズの削減など、実際の効果が高い順に整理されている。"
tags:
  - React
  - Next.js
  - performance
  - AI-agents
  - best-practices
  - optimization
  - bundle-size
---

## 概要

Vercelは10年以上にわたるReactとNext.jsのパフォーマンス最適化の知見を[react-best-practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)としてまとめた。このリポジトリはAIエージェントやLLM向けに構造化されており、コードレビューや最適化提案時に参照できる形式になっている。

## パフォーマンス問題の根本原因

10年以上の本番コードベース分析から、同じ根本原因が繰り返し見られることが判明：

- **非同期処理が意図せず直列化**される問題
- **クライアントバンドルの肥大化**（時間とともに増加）
- **不要な再レンダリング**を引き起こすコンポーネント

これらはマイクロ最適化ではなく、すべてのユーザーセッションに影響する待機時間、ジャンク、繰り返しコストとして現れる。

## 核心的なアイデア：優先順位付け

ほとんどのパフォーマンス改善が失敗する理由は、**スタックの低レイヤーから始めてしまう**こと。

> リクエストウォーターフォールが600msの待機時間を追加している場合、`useMemo`の最適化は意味がない。毎ページで300KBのJavaScriptを追加で配信している場合、ループを数マイクロ秒短縮しても効果はない。

パフォーマンス改善は**複合的に蓄積**される。今日出荷した小さなリグレッションは、誰かが負債を返済するまで、すべてのセッションに長期的な税金となる。

### 優先順位

1. **ウォーターフォールの排除**（CRITICAL）
2. **バンドルサイズの削減**（CRITICAL）
3. サーバーサイドパフォーマンス
4. クライアントサイドフェッチング
5. 再レンダリング最適化

## 8つのパフォーマンスカテゴリ

リポジトリは**40以上のルール**を8つのカテゴリで網羅：

| カテゴリ | 概要 |
|---------|------|
| Eliminating async waterfalls | 非同期ウォーターフォールの排除 |
| Bundle size optimization | バンドルサイズ最適化 |
| Server-side performance | サーバーサイドパフォーマンス |
| Client-side data fetching | クライアントサイドデータ取得 |
| Re-render optimization | 再レンダリング最適化 |
| Rendering performance | レンダリングパフォーマンス |
| Advanced patterns | 高度なパターン |
| JavaScript performance | JavaScriptパフォーマンス |

各ルールには**影響度レーティング**（CRITICAL〜LOW）が付与され、修正の優先順位付けを支援。コード例も付属。

## コード例：条件付き非同期処理

### ❌ 誤った例（両方のブランチがブロックされる）

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // すぐにreturnするが、userDataを待っている
    return { skipped: true }
  }
  
  // このブランチだけがuserDataを使用
  return processUserData(userData)
}
```

### ✅ 正しい例（必要な時だけブロック）

```typescript
async function handleRequest(
  userId: string,
  skipProcessing: boolean
) {
  if (skipProcessing) {
    return { skipped: true }
  }

  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

## 実践例：本番環境での改善事例

### ループイテレーションの統合

チャットページで同じメッセージリストを**8回別々にスキャン**していた。1回のパスに統合することで、数千のメッセージがある場合に効果を発揮。

### Awaitの並列化

APIが、互いに依存しないデータベース呼び出しを**直列に待機**していた。同時実行により**合計待機時間を半減**。

### フォントフォールバックの調整

カスタムフォント読み込み前にシステムフォントを使用する際、見出しが詰まって見えた。letter-spacingを調整することで、フォールバックが意図的に見えるようになった。

## AIエージェントでの使用方法

個別のルールファイルは`AGENTS.md`にコンパイルされ、エージェントがコードレビューや最適化提案時にクエリできる単一ドキュメントとなる。

これらのベストプラクティスは**Agent Skills**としてパッケージ化されており、以下のコーディングエージェントにインストール可能：

- Opencode
- Codex
- Claude Code
- Cursor
- その他

### インストールコマンド

```bash
npx add-skill vercel-labs/agent-skills
```

エージェントがカスケードする`useEffect`呼び出しや重いクライアントサイドインポートを検出した際、これらのパターンを参照して修正を提案できる。

## 重要なポイント

1. **反応的（reactive）なパフォーマンス改善は高コスト** - リリース後に遅さを追いかけるのではなく、事前に防ぐ
2. **高レイヤーから最適化を始める** - ウォーターフォールとバンドルサイズが最も効果的
3. **AIエージェントとの統合** - 一貫した決定を大規模コードベース全体に適用可能
4. **実践的な知見** - 理論ではなく、実際の本番コードベースから収集されたパターン

## 関連リンク

- [react-best-practices リポジトリ](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- [Agent Skills](https://github.com/vercel-labs/agent-skills)
