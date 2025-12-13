---
title: "Google Antigravity を使い込んで感じた5つの活用ポイント | DevelopersIO"
source: "https://dev.classmethod.jp/articles/google-antigravity-five-tips/"
author:
  - "[[すらぼ]]"
published: 2025-12-10
created: 2025-12-13
description: |
  Google Antigravity のパブリックプレビューリリースと有料プランの登場を受けて、著者が実際に使い込んだ中で見えてきた5つの活用ポイントを紹介。ユーザー承認の制御、思考モードの使い分け、モデルの使い分け、DevContainerの活用、Customizationsでのグローバル指示について実践的なTipsを解説している。
tags:
  - "clippings"
  - "Google Antigravity"
  - "Gemini"
  - "AI開発ツール"
  - "DevContainer"
  - "AIエージェント"
---

## 概要

2024年11月18日（米国時間）にパブリックプレビューとしてリリースされた Google Antigravity について、著者が実際に使い込んで見えてきた5つの活用ポイントを紹介する記事。有料プランの登場により Rate Limit を気にせず使えるようになり、実際の開発での活用が進んでいる。

### 筆者の環境

- ホストOS(CPU): macOS（M4）
- Google One プラン: Google AI Pro
- メインツール: Claude Code（AIツール）、VS Code（エディタ）

---

## 1. ユーザー承認の制御

Antigravity では2つの項目でユーザー許可の度合いを設定できる（3段階：全部許可制／エージェント判断／すべて許可不要）。

### Artifact Review Policy

**推奨設定: `Request Review`（レビュー必須）**

理由:

1. **設計段階での早期レビュー** - 修正を減らせる
2. **手間・ストレスが少ない** - タイミングが最初と最後に寄る
3. **作業実行前にモデルを変更できる（最重要）** - 計画立案時は思考型モデルを使用し、設計後は実装に適したモデルに切り替え可能

### Terminal Command Auto Execution

**推奨設定: `Auto`**

- Read 系コマンドは自動実行
- ファイル削除やGit操作などリスクを伴うコマンドはユーザー許可を求める
- DevContainer など独立した環境内で実行することでリスク軽減可能

---

## 2. 思考モードの使い分け

### Fast モード

- 指示に対してほぼ1アクションで処理停止
- アーティファクトを**生成しない**
- Plan → アクションではなく直接アクションを実行
- **用途**: 簡単なセットアップ、簡単な質問への回答
- **不向き**: 継続的な手を動かす作業、トライアンドエラーの繰り返し

### Planning モード

- 指示に対して計画を立ててからタスクを実行し、計画に沿って実行し続ける
- Task, Implementation Plan などのアーティファクトは Planning でのみ生成
- **用途**: 具体的な実装、クラウドインフラの構築、デプロイなどエラーが出やすい作業

> **著者の使用比率**: Planning が9割。Fast は「コマンド教えて」程度の些細なタスクにのみ使用。

この2つのモードは「賢さ」ではなく「回答のスタンス」を定めるパラメータとして解釈すべき。

---

## 3. モデルの使い分け

### 利用可能なモデル（執筆時点）

- Gemini 3 Pro (High)
- Gemini 3 Pro (Low)
- Claude Sonnet 4.5
- Claude Sonnet 4.5 (Thinking)
- Claude Opus 4.5 (Thinking)
- GPT-OSS 120B (Medium)

### Gemini 3 Pro の High と Low の使い分け

| モード | 特徴 | 用途 |
|--------|------|------|
| **High** | 推論の深さを最大化。最初のトークンまでに時間がかかるが、出力はより慎重に推論される | 最初のプラン作成、設計 |
| **Low** | レイテンシと費用を最小限に抑える。簡単な指示の実行、チャット、高スループットアプリケーションに最適 | 設計後の実装 |

> **著者の使い方**: 設計を `high` で行い、設計後の実装は `low` を使用。Low と Planning を組み合わせることで、素早いトライアンドエラーと継続的な作業遂行が可能。

---

## 4. DevContainer の活用

Antigravity は VS Code と同様に DevContainer 機能をサポート（組み込み機能として提供、拡張機能不要）。

### メリット

- コマンドの実行環境、ファイルシステム、拡張機能などの開発環境を丸ごとコンテナ化
- Antigravity が自動実行するコマンドによるホストOSへの影響リスクを大幅軽減

### 設定ファイルの引き継ぎ

DevContainer を使う場合、git config などホストOSの設定は自動で引き継がれない（VS Codeとは異なる）。マウント設定で引き継ぎ可能:

```json
{
  "name": "Sample Python",
  "image": "mcr.microsoft.com/devcontainers/python:3",
  "mounts": [
    "source=${localEnv:HOME}/.gitconfig,target=/home/vscode/.gitconfig,type=bind,consistency=cached",
    "source=${localEnv:HOME}/.gemini/GEMINI.md,target=/home/vscode/.gemini/GEMINI.md,type=bind,consistency=cached"
  ]
}
```

---

## 5. Customizations でのグローバル指示

`~/.gemini/GEMINI.md` に書いた指示が全てのセッションでグローバルに共有される。

### アクセス方法

Customizations > +Global をクリック

### 著者の設定例

```markdown
思考は英語で行い、ユーザーへのレスポンスは日本語に翻訳すること。
アーティファクトはユーザーにレビューを求める前に日本語に翻訳すること。

タスクを実行中、Stepが10を超えたら一度処理を停止して「完了した作業」「状況の報告」「次のアクション」を報告し、ユーザーの判断を仰ぐこと。
```

### ポイント

1. **日本語対応**: Antigravity はデフォルトで英語出力のため、日本語翻訳指示が有効
2. **Step10制限**: 複雑なタスクで明後日の方向に努力し続けることを防止
3. **状況整理のメリット**: トライアンドエラー中にエラーの直接原因に向き合い続けて根本原因を見失うことを防ぐ。立ち止まらせることで根本原因も分析させる

---

## まとめ

- 有料プランの登場でRate Limitを気にせず自由に使えるようになった
- Antigravity の特性を理解した活用ポイントが見えてきた
- ユーザー承認制御、思考モード、モデル選択、DevContainer、グローバル指示の5つが重要

---

## 参考資料

- [Antigravity Documentation](https://antigravity.google/docs/home)
- [Gemini API ドキュメント](https://ai.google.dev/gemini-api/docs/gemini-3?hl=ja)
- [Antigravity Terminal Command Auto Execution の調査記事](https://dev.classmethod.jp/articles/antigravity-terminal-command-auto-execution/)
- [DevContainer 設定の記事](https://dev.classmethod.jp/articles/dont-forget-to-use-devcontainer-when-using-antigravity/)
