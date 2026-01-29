---
title: "AGENTS.md outperforms skills in our agent evals"
source: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
author:
  - "[[Jude Gao]]"
published: 2026-01-27
created: 2026-01-29
description: "A compressed 8KB docs index in AGENTS.md achieved 100% on Next.js 16 API evals. Skills maxed at 79%. Here's what we learned and how to set it up."
tags:
  - AI-agents
  - AGENTS.md
  - Next.js
  - coding-agents
  - documentation
  - retrieval-led-reasoning
  - Vercel
---

## 概要

VercelチームがAIコーディングエージェントにフレームワーク固有の知識を教える2つのアプローチ（**Skills** vs **AGENTS.md**）を評価した結果、圧縮された8KBのドキュメントインデックスを`AGENTS.md`に直接埋め込む方法が100%のパス率を達成し、Skillsベースのアプローチ（最大79%）を大幅に上回った。

---

## 解決しようとした問題

AIコーディングエージェントは、古くなったトレーニングデータに依存している。Next.js 16で導入された新しいAPI（`'use cache'`、`connection()`、`forbidden()`など）は現在のモデルのトレーニングデータに含まれていないため、エージェントは誤ったコードを生成したり、古いパターンに戻ってしまう。

逆に、古いNext.jsバージョンを使用している場合、モデルがまだプロジェクトに存在しない新しいAPIを提案することもある。

---

## 2つのアプローチの比較

### Skills（スキル）
- コーディングエージェントが使用できるドメイン知識をパッケージ化する[オープンスタンダード](https://agentskills.io/)
- エージェントがフレームワーク固有のヘルプが必要と認識したときにオンデマンドで呼び出す
- [skills.sh](https://skills.sh/)で再利用可能なスキルのディレクトリが成長中

### AGENTS.md
- プロジェクトルートにあるMarkdownファイルで、コーディングエージェントに永続的なコンテキストを提供
- `AGENTS.md`に記載された内容は、エージェントがロードを決定する必要なく、すべてのターンで利用可能
- Claude Codeは同じ目的で`CLAUDE.md`を使用

---

## 評価結果

### Skillsの問題点

| 構成 | パス率 | ベースライン比 |
|------|--------|----------------|
| ベースライン（ドキュメントなし） | 53% | — |
| Skill（デフォルト動作） | 53% | +0pp |
| 明示的指示付きSkill | 79% | +26pp |
| **AGENTS.md ドキュメントインデックス** | **100%** | **+47pp** |

**Skillsが信頼性低く呼び出されなかった理由:**
- 56%のケースでスキルが呼び出されなかった
- エージェントはドキュメントにアクセスできたが、使用しないことを選択した
- これはモデルがツールを確実に使用しないという[既知の制限](https://developers.openai.com/blog/eval-skills)

### 明示的な指示の脆弱性

異なる文言が劇的に異なる結果を生み出した：

| 指示 | 動作 | 結果 |
|------|------|------|
| 「必ずスキルを呼び出せ」 | ドキュメントを先に読み、ドキュメントパターンに固執 | プロジェクトコンテキストを見落とす |
| 「プロジェクトを先に探索し、それからスキルを呼び出せ」 | 先にメンタルモデルを構築し、ドキュメントを参照として使用 | より良い結果 |

---

## 評価スイートの構築

Next.js 16のAPI（モデルのトレーニングデータに含まれていないもの）に焦点を当てた評価：

- `connection()` - 動的レンダリング用
- `'use cache'` ディレクティブ
- `cacheLife()` と `cacheTag()`
- `forbidden()` と `unauthorized()`
- `proxy.ts` - APIプロキシ用
- 非同期 `cookies()` と `headers()`
- `after()`、`updateTag()`、`refresh()`

---

## AGENTS.mdの成功要因

### 詳細な評価結果

| 構成 | Build | Lint | Test |
|------|-------|------|------|
| ベースライン | 84% | 95% | 63% |
| Skill（デフォルト動作） | 84% | 89% | 58% |
| 明示的指示付きSkill | 95% | 100% | 84% |
| **AGENTS.md** | **100%** | **100%** | **100%** |

![Eval results across all four configurations](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F5klujg5rHUkECCKEGbllHN%2Fb6cf879ce5a9aa4b88e1c275e460e32f%2FCleanShot_2026-01-21_at_11.19.58_2x.png&w=1920&q=75)

### パッシブコンテキストがアクティブな取得に勝る理由

1. **決定ポイントがない** - `AGENTS.md`では「これを調べるべきか」という決定の瞬間がない。情報はすでに存在している
2. **一貫した可用性** - Skillsは非同期で呼び出されたときのみロードされる。`AGENTS.md`のコンテンツはすべてのターンでシステムプロンプトに含まれる
3. **順序の問題がない** - Skillsは順序決定（ドキュメントを先に読むかプロジェクトを先に探索するか）を作成する。パッシブコンテキストはこれを完全に回避

---

## コンテキスト肥大化への対処

### 圧縮アプローチ
- 初期のドキュメント注入は約40KB
- 8KBに圧縮（80%削減）しながら100%のパス率を維持
- パイプ区切り形式を使用してドキュメントインデックスを最小限のスペースにパック

```
[Next.js Docs Index]|root: ./.next-docs
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning
|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,...}
|01-app/02-building-your-application/01-routing:{01-defining-routes.mdx,...}
```

![The full compressed docs index](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F7FuC0523TmDXUKhQNe8pAB%2F9060456f97c3863cb3b35a6404ca17a1%2Fimage_6_.png&w=1920&q=75)

**重要な指示:**
```
IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning
for any Next.js tasks.
```

これはエージェントに、古い可能性のあるトレーニングデータに頼るのではなく、ドキュメントを参照するよう指示する。

---

## セットアップ方法

Next.jsプロジェクトで以下のコマンドを実行：

```bash
npx @next/codemod@canary agents-md
```

このコマンドは3つのことを行う：
1. Next.jsバージョンを検出
2. 一致するドキュメントを`.next-docs/`にダウンロード
3. 圧縮されたインデックスを`AGENTS.md`に注入

---

## フレームワーク作者への提言

### Skillsは無用ではない
- `AGENTS.md` - すべてのタスクにわたる広く水平的な改善
- Skills - 明示的にトリガーされる垂直的でアクション固有のワークフロー（「Next.jsバージョンをアップグレード」「App Routerに移行」など）

### 実践的な推奨事項

1. **Skillsの改善を待たない** - モデルがツール使用で改善されるにつれてギャップは縮まるかもしれないが、今結果が重要
2. **積極的に圧縮する** - コンテキストに完全なドキュメントは必要ない。取得可能なファイルを指すインデックスで十分
3. **評価でテストする** - トレーニングデータにないAPIをターゲットにした評価を構築。そこがドキュメントアクセスが最も重要な場所
4. **取得用に設計する** - エージェントがすべてを事前に必要とするのではなく、特定のファイルを見つけて読めるようにドキュメントを構造化

---

## 結論

目標は、エージェントを**事前トレーニング主導の推論**から**取得主導の推論**にシフトさせること。`AGENTS.md`がそれを実現する最も信頼性の高い方法であることが判明した。
