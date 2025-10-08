---
title: "cc-sddで仕様駆動開発を試してみた"
source: "https://zenn.dev/canly/articles/c77bf9f7a67582"
author:
  - "kuwano"
published: 2025-10-03
created: 2025-10-08
description: |
  cc-sddを使った仕様駆動開発（SDD）の実践レポート。AIコーディングにおける「Vibe Coding」の課題を解決し、要件定義から設計、実装まで段階的に仕様を明確化する開発手法を紹介。日本語対応されたcc-sddの導入方法から開発フロー、実際に使ってみた感想までを詳しく解説。
tags:
  - Claude Code
  - cc-sdd
  - 仕様駆動開発
  - SDD
  - AI開発
  - Kiro
---

## 概要

株式会社カンリーのエンジニア・桑野氏による、仕様駆動開発（SDD: Spec-Driven Development）とその実装ツール「cc-sdd」の実践レポート。AIを活用したコーディングにおける新しい開発手法について、導入から実践までを詳しく解説している。

## 仕様駆動開発（SDD）とは

### 背景と課題

AIの登場により、**Vibe Coding**（自然言語で指示を出してAIにコードを生成させる方法）が活発化した。しかし、以下のような課題が顕在化：

- 最適化されていないコードの増加
- 「どうなっているんだっけ？」という実装の増加
- 曖昧さや再現性の低さ

### SDDのアプローチ

従来の人の手による開発と同様に「**要件定義 → 設計 → 実装**」という流れで仕様を明確化。段階的に具体性を上げることで、上記の課題を回避する。

### cc-sddの特徴

- KiroのようなSDD実装の一つ
- **Claude Code**でSDDが可能
- **日本語対応**されている
- npmトレンドで利用が増加傾向

![npmトレンドグラフ](https://storage.googleapis.com/zenn-user-upload/8273cfcdb683-20251002.png)

## cc-sddの導入方法

### インストール

基本的なインストール：

```bash
npx cc-sdd@latest --lang ja
```

Cursorなど他のIDEで使う場合：

```bash
npx cc-sdd@latest --cursor --lang ja
```

インストールすると、指定したIDEに**カスタムスラッシュコマンド**が追加される。

![Claude Code向けインストール](https://storage.googleapis.com/zenn-user-upload/e0547964573b-20251002.png)

![利用可能なコマンド](https://storage.googleapis.com/zenn-user-upload/c9f2d4203650-20251002.png)

## プロジェクトナレッジの作成

### 初期設定コマンド

```bash
/kiro:steering
```

### 生成されるファイル

`kiro`ディレクトリに以下が生成される：

- **product.md** - プロダクト概要
- **structure.md** - プロジェクト構造
- **tech.md** - 技術スタック

![生成されたナレッジファイル](https://storage.googleapis.com/zenn-user-upload/0320a7b5b4de-20251002.png)

## 開発フロー

### 1. 要件定義

**初期化コマンド：**

```bash
/kiro:spec-init <プロジェクト説明>
```

**生成されるファイル：**

- `.kiro/specs/<project-name>/spec.json` - メタデータと各ステップの承認状況
- `.kiro/specs/<project-name>/requirements.md` - 要件ドキュメントのテンプレート

![requirements.mdの初期状態](https://storage.googleapis.com/zenn-user-upload/42240c59edc4-20251002.png)

**要件の詳細化：**

```bash
/kiro:spec-requirements <プロジェクト名>
```

AIが`requirements.md`に要件を詳細に書き出す。内容を確認し、意図と違う場合はコメントして修正。

![次のステップの案内](https://storage.googleapis.com/zenn-user-upload/2cf363e84cd3-20251002.png)

### 2. 設計

```bash
/kiro:spec-design <プロジェクト名> -y
```

`.kiro/specs/<project-name>/design.md`が追加され、AIによる設計が提案される。

![設計ファイル](https://storage.googleapis.com/zenn-user-upload/9131a0580469-20251002.png)

### 3. タスク生成

```bash
/kiro:spec-tasks <プロジェクト名> -y
```

`tasks.md`が追加され、実装に必要なタスクがリストアップされる。

![タスクファイル](https://storage.googleapis.com/zenn-user-upload/2a7bc07c905c-20251002.png)

### 4. 実装

```bash
/kiro:spec-impl <プロジェクト名>          # 全タスク実行
/kiro:spec-impl <プロジェクト名> 1.1      # 特定タスク実行
/kiro:spec-impl <プロジェクト名> 1,2,3    # 複数タスク実行
```

定義されたタスクに基づいて実装を実行。

### 5. 検証

```bash
/kiro:spec-validate-gap <プロジェクト名>
```

要件と実装の整合性を確認。齟齬がある場合は該当箇所が明示され、修正すべきポイントが示される。

## cc-sddを使ってみた感想

### 良かった点

1. **日本語対応されているので使い勝手が良い**
2. **仕様を壁打ちしながら詳細度を上げていくので、出力結果に納得感がある**
   - Claude CodeのPlan Modeだと評価しきれない場合があるが、SDDでは段階的に評価できる
3. **設計書があるので別セッションでもブレが少ない**

### 課題に感じたところ

1. **設計中にコンテキスト圧縮が発生した時に精度が落ちる可能性**
2. **既存のClaude Code環境との共存が難しい**
   - 既にCLAUDE.mdやナレッジファイルがある場合の配置問題
   - steering結果はナレッジファイル置き場に、仕様書は別ディレクトリに置きたいが、今のところ分けることはできない

## まとめ

### SDDの価値

SDDは、AIに大規模な実装をさせた際に感じる**「これでいいんだっけ？」という不安を解消**できるアプローチ。単なるVibe Codingよりも構造化された開発プロセスを踏むことで、**より品質の高い成果物**を得られる。

### 今後の展望

- プロジェクトの規模や性質に応じて、SDDを適切に取り入れることで、AI時代の新しい開発手法として定着する可能性
- 特に**日本語対応されたcc-sdd**は、日本の開発現場でも取り入れやすい
- 今後は自分のプロジェクトにうまく取り込める設定を検討していく

---

**著者について：** 株式会社カンリーでフロントエンドエンジニアとして働く桑野氏。カンリーは「店舗経営を支える、世界的なインフラを創る」をミッションに、店舗アカウントの一括管理・分析SaaS「カンリー店舗集客」を提供している。
