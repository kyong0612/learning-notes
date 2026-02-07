---
title: "Overview"
source: "https://agentskills.io/home"
author:
  - "[[Anthropic]]"
published:
created: 2026-02-07
description: "Agent Skillsは、AIエージェントに新しい能力や専門知識を付与するための、シンプルでオープンなフォーマット。Anthropicが開発し、オープンスタンダードとして公開された。"
tags:
  - "clippings"
  - "agent-skills"
  - "ai-agents"
  - "open-standard"
  - "anthropic"
  - "developer-tools"
---

## 概要

**Agent Skills** は、AIエージェントに新しい能力や専門知識を与えるための **シンプルでオープンなフォーマット**。スキルとは、エージェントが発見・活用できる **指示書・スクリプト・リソースのフォルダ** であり、エージェントがより正確かつ効率的にタスクを遂行できるようにする。

## なぜAgent Skillsが必要か

エージェントは年々高性能化しているが、実務を確実に行うための **コンテキスト（文脈情報）** が不足しがちである。Skillsはエージェントに以下を提供する：

- **手続き的知識** へのアクセス
- **企業・チーム・ユーザー固有のコンテキスト** をオンデマンドで読み込み
- タスクに応じた **能力の動的拡張**

### 3つのステークホルダーへの価値

| 対象 | メリット |
|---|---|
| **スキル作成者** | 一度構築すれば複数のエージェント製品に展開可能 |
| **互換エージェント** | エンドユーザーがすぐに新しい能力を追加可能 |
| **チーム・企業** | 組織知識をポータブルかつバージョン管理可能なパッケージとして保存 |

## Agent Skillsが実現できること

- **ドメイン専門知識**: 法務レビューやデータ分析パイプラインなど、専門知識を再利用可能な指示書にパッケージ化
- **新しい能力**: プレゼン作成、MCPサーバー構築、データセット分析など、エージェントに新たな機能を付与
- **再現可能なワークフロー**: 複数ステップのタスクを一貫性と監査可能性のあるワークフローに変換
- **相互運用性**: 同じスキルを異なるスキル互換エージェント製品間で再利用

## スキルの仕組み

スキルは **プログレッシブ・ディスクロージャ（段階的開示）** を用いてコンテキストを効率的に管理する：

1. **Discovery（発見）**: 起動時、エージェントは各スキルの `name` と `description` のみを読み込む（関連性の判断に必要十分な情報）
2. **Activation（有効化）**: タスクがスキルの説明に一致した場合、`SKILL.md` の完全な指示書をコンテキストに読み込む
3. **Execution（実行）**: 指示書に従い、必要に応じて参照ファイルの読み込みやバンドルコードの実行を行う

## SKILL.mdファイル

すべてのスキルは `SKILL.md` ファイルから始まる。YAMLフロントマターとMarkdownの指示書で構成される。

### ディレクトリ構造

```
my-skill/
├── SKILL.md       # 必須: 指示書 + メタデータ
├── scripts/       # 任意: 実行可能コード
├── references/    # 任意: ドキュメント
└── assets/        # 任意: テンプレート、リソース
```

### フロントマター（必須フィールド）

```yaml
---
name: skill-name
description: このスキルが何をするか、いつ使うかの説明。
---
```

### 全フィールド一覧

| フィールド | 必須 | 制約 |
|---|---|---|
| `name` | Yes | 最大64文字。小文字英数字とハイフンのみ。ハイフンで開始・終了不可 |
| `description` | Yes | 最大1024文字。スキルの機能と使用タイミングを記述 |
| `license` | No | ライセンス名またはバンドルされたライセンスファイルへの参照 |
| `compatibility` | No | 最大500文字。環境要件（対象製品、必要パッケージ等）を示す |
| `metadata` | No | 追加メタデータ用のキー・バリューマッピング |
| `allowed-tools` | No | スペース区切りの事前承認ツールリスト（実験的機能） |

### ボディコンテンツ

フロントマター以降のMarkdownボディにスキルの指示書を記述する。フォーマットの制限はなく、推奨セクションは以下の通り：

- ステップバイステップの手順
- 入出力の例
- よくあるエッジケース

> **推奨**: `SKILL.md` は500行以下に収め、詳細なリファレンスは別ファイルに分離する。

## オプションディレクトリ

### scripts/
エージェントが実行できるコードを格納。自己完結型であるか、依存関係を明確にドキュメント化する必要がある。対応言語はエージェントの実装に依存する（Python、Bash、JavaScriptが一般的）。

### references/
追加ドキュメント。`REFERENCE.md`、`FORMS.md`、ドメイン固有ファイルなど。エージェントはオンデマンドで読み込むため、個別ファイルは小さく保つ。

### assets/
テンプレート、画像、データファイル（スキーマ、ルックアップテーブル等）などの静的リソース。

## プログレッシブ・ディスクロージャの構造

| レイヤー | トークン量 | タイミング |
|---|---|---|
| メタデータ | 〜100トークン | 起動時（全スキル） |
| 指示書 | < 5000トークン推奨 | スキル有効化時 |
| リソース | 必要に応じて | 実行中に参照時のみ |

## エージェントへの統合

### 2つの統合アプローチ

1. **ファイルシステムベース**: コンピュータ環境（bash/unix）で動作。`cat /path/to/my-skill/SKILL.md` などのシェルコマンドでスキルを有効化する最も高機能なオプション
2. **ツールベース**: 専用のコンピュータ環境なしで機能。モデルがスキルをトリガーしアセットにアクセスするためのツールを実装

### 統合の5ステップ

1. 設定されたディレクトリ内のスキルを **発見**
2. 起動時に **メタデータ（nameとdescription）を読み込み**
3. ユーザータスクと関連スキルを **マッチング**
4. 完全な指示書を読み込んでスキルを **有効化**
5. スクリプトの実行やリソースへのアクセスを **実行**

### コンテキストへの注入（Claudeモデルの例）

```xml
<available_skills>
  <skill>
    <name>pdf-processing</name>
    <description>Extracts text and tables from PDF files...</description>
    <location>/path/to/skills/pdf-processing/SKILL.md</location>
  </skill>
</available_skills>
```

### セキュリティ上の考慮事項

- **サンドボックス**: スクリプトを隔離された環境で実行
- **許可リスト**: 信頼されたスキルのスクリプトのみ実行
- **確認**: 潜在的に危険な操作の前にユーザーに確認
- **ログ記録**: 監査のためにすべてのスクリプト実行を記録

## オープン開発

Agent Skillsフォーマットは **Anthropic** が開発し、**オープンスタンダード** としてリリースされた。現在は多くのエージェント製品に採用されており、エコシステム全体からの貢献を受け付けている。

- **GitHub**: [agentskills/agentskills](https://github.com/agentskills/agentskills)
- **リファレンスライブラリ**: [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) — スキルの検証とプロンプトXML生成のためのPythonユーティリティとCLI
- **サンプルスキル**: [anthropics/skills](https://github.com/anthropics/skills)

## 関連リンク

- [Agent Skills 公式サイト](https://agentskills.io)
- [What are skills?](https://agentskills.io/what-are-skills)
- [Specification](https://agentskills.io/specification)
- [Integrate skills](https://agentskills.io/integrate-skills)
- [ベストプラクティス（Claude Platform）](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
