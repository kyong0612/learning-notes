---
title: "Claude Codeでreact-best-practicesスキルをadd-skillでインストールして使ってみた"
source: "https://zenn.dev/tonkotsuboy_com/scraps/01b829b7e7c157"
author:
  - "鹿野 壮"
published: 2026-01-15
created: 2026-01-16
description: |
  Vercelがリリースした10年分のReactとNext.jsの知見が詰まった「react-best-practices」スキルを、add-skillツールを使ってClaude Codeにインストールし、実際にPRレビューで活用した体験記。
tags:
  - "Claude Code"
  - "React"
  - "Next.js"
  - "AI"
  - "コードレビュー"
  - "Vercel"
---

## 概要

Vercelが公開した **react-best-practices** は、10年分のReactとNext.jsの知見が詰まったスキルセット。Claude Code、Codex、Cursor等のAIコーディングツールにインストールして活用できる。

📎 公式発表: https://vercel.com/blog/introducing-react-best-practices

---

## インストール方法

### add-skill ツールについて

Vercelが公開した「add-skill」ツールを使用することで、各種AI開発環境にインタラクティブにスキルをインストールできる。

📦 npm: https://www.npmjs.com/package/add-skill

### インストールコマンド

```bash
npx add-skill vercel-labs/agent-skills
```

実行すると、どの環境にインストールするかをインタラクティブに選択できる。

![インストール先の選択画面](https://storage.googleapis.com/zenn-user-upload/b960dc00e3e4-20260115.png)

**対応環境:**
- Claude Code
- Codex
- Cursor
- その他

---

## 使い方：PRレビューでの活用例

### 実践例

開発中のPRに対して、以下のように指示：

> 「今回のPRについて、next.jsのベスト・プラクティスに沿っているかチェックして」

### スキル発動の様子

![スキルが発動している様子](https://storage.googleapis.com/zenn-user-upload/c893b0ea6d0f-20260115.png)

### レビュー結果

Claude Codeがreact-best-practicesスキルに基づいてレビューを実施し、具体的な改善提案を出力：

![レビュー結果](https://storage.googleapis.com/zenn-user-upload/ed62bb138e79-20260115.png)

**主な指摘内容:**
- `React.cache` の使用を推奨

---

## 結論

react-best-practicesスキルをインストールすることで、Claude CodeでReact/Next.jsのベストプラクティスに沿ったコードレビューが可能になる。

```bash
npx add-skill vercel-labs/agent-skills
```

---

## 著者情報

**鹿野 壮**
- 所属: Ubie
- 専門: フロントエンド、バックエンド、アプリ開発、AIエージェント
- 著書: 「JavaScriptコードレシピ集」
- 実績: CSSNite ベストセッション、TechFeed公認エキスパート
