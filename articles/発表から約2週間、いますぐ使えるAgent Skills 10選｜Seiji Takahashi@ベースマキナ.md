---
title: "発表から約2週間、いますぐ使えるAgent Skills 10選｜Seiji Takahashi@ベースマキナ"
source: "https://note.com/timakin/n/na8b2789897ea"
author:
  - "Seiji Takahashi@ベースマキナ"
published: 2025-12-28
created: 2025-12-29
description: "2025年12月18日にAnthropicが発表したAgent Skillsについて、発表から約2週間で話題になっている実用的なスキル10選を紹介。ドキュメント処理、開発ワークフロー、エンタープライズ連携などカテゴリ別に整理し、インストール方法や業界標準化の動きも解説。MCPと比較したSkillsの特徴や、コミュニティによる大規模コレクション、マーケットプレイス情報も含む。"
tags:
  - "clippings"
  - "AI"
  - "生成AI"
  - "Agent Skills"
  - "Claude"
  - "業務効率化"
---

## 概要

2025年12月18日、AnthropicがAgent Skillsをオープンスタンダードとして発表。MCPに続く標準化の動きとして注目を集めている。発表からわずか数日でOpenAIがCodex CLIとChatGPTに同規格を採用し、GitHub Copilotも対応を発表。Anthropicが仕様を公開し、競合が追従する——MCPで見た流れが再び起きており、一気に業界標準となりつつある。

## Agent Skillsとは

Agent Skillsは、Claude（やCodex CLI、Copilot）に特定のタスクを教えるための仕組み。技術的には、`SKILL.md`ファイル + スクリプト + リソースで構成されたフォルダ。

特徴的なのは「Progressive Disclosure」という設計思想。Claudeはまずメタデータだけをスキャンして（約100トークン）関連性を判断し、必要なときだけフルコンテンツを読み込みます（約5kトークン）。この仕組みのお陰で大量にスキルを組み込んでもパフォーマンスが劣化しない（とはいえ適切に選択できるかは別問題）。

## おすすめスキル10選

### ドキュメント処理系（公式）

Anthropicの公式リポジトリには、すぐに使えるドキュメント処理スキルが揃っている。

#### 1. docx（Word文書）

Word文書の生成・編集が可能。テンプレートを使った定型文書の作成、既存文書の修正など、実務で重宝するスキル。

#### 2. xlsx（Excel）

数式付きのスプレッドシートを生成可能。「売上データをピボットテーブル風にまとめて」といった依頼にも対応。

#### 3. pptx（PowerPoint）

プレゼンテーション資料の生成。スライド構成から内容まで一気に作れるため、時間短縮になる。

#### 4. pdf

PDF生成やフォーム作成に対応。契約書のテンプレートなど、フォーマットが固定されたドキュメントに向いている。

### 開発ワークフロー系

エンジニアにとって実用的なスキルも充実している。

#### 5. Playwright Browser Automation

Webアプリのテスト・検証を自動化するスキル。「このフォームの入力バリデーションをテストして」といった依頼に対応。Claudeがブラウザを操作してテストを実行し、結果を報告してくれる。

#### 6. Git automation（obra/superpowers）

obra/superpowersというコミュニティ製コレクションに含まれるスキル。コミットメッセージの自動生成、ステージング、プッシュまでを一連の流れで実行可能。`/brainstorm`、`/write-plan`、`/execute-plan`といったコマンドも便利。

#### 7. Test fixing

失敗しているテストを特定し、修正案を提示するスキル。CI/CDでテストが落ちたときに「直して」と頼むだけで対応してくれる。

### エンタープライズ連携系

Anthropicはパートナー企業と連携し、エンタープライズ向けスキルも提供。Skills Directory（claude.com/connectors）から有効化できる。

#### 8. Atlassian（Jira/Trello連携）

「このバグをJiraチケットにして」「Trelloにタスクを追加して」といった依頼に対応。プロジェクト管理ツールとの連携は、PdMにとって特に有用。

#### 9. Figma連携

ブランドガイドラインをFigmaのデザインに適用するスキル。マーケティング資料の作成時に、ブランドカラーやタイポグラフィを自動で統一してくれる。

### 個人・チーム向けユーティリティ

#### 10. Skill Creator

スキル作成のガイドを提供する「メタスキル」。自分でスキルを作りたいときに、フォーマットやベストプラクティスを教えてくれる。Skillsエコシステムに貢献したい人向け。

その他、**Lead Research Assistant**（リード調査・アウトリーチ戦略）や**Domain Name Brainstormer**（ドメイン名のアイデア出し＆空き確認）など、ニッチだけど刺さる人には刺さるスキルがある。

## コレクション

個別スキルだけでなく、まとめてインストールできるコレクションも話題になっている。

### wshobson/agents

107スキル + 99エージェント + 15オーケストレーターを含む大規模コレクション。67個のプラグインに分かれていて、必要なものだけインストール可能。

Kubernetes、Helm、RAG実装、プロンプトエンジニアリングなど、幅広いドメインをカバー。「とりあえず全部入れる」より「必要なプラグインだけ選ぶ」使い方が推奨されている。

### SkillsMP

25,000以上のスキルを検索できるコミュニティマーケットプレイス。GitHubから自動収集しており、Claude Code、Codex CLI、ChatGPTに対応。カテゴリや人気順でフィルタリング可能。

## 業界標準化の流れ

Agent Skillsはすでに業界標準になりつつある。

- OpenAIはCodex CLIとChatGPTで同じAgent Skills規格を採用
- GitHub Copilotも12月18日に対応を発表
- Cursor、Microsoftも採用済み

これはMCPで見た流れと同様。Anthropicが仕様を公開し、オープンスタンダードとして提供する。競合がそれに追従する。結果として、開発者は一度スキルを作れば複数のAIプラットフォームで使えるため、導入も作成も楽でポータビリティがある。

Simon Willisonは「MCPの爆発が控えめに見えるほどのCambrian explosionが起きる」と予測。ここ1〜2週間でGitHubに公開されるスキルの数が急増している。

## インストール方法

```bash
# マーケットプレイス登録（初回のみ）
/plugin marketplace add anthropics/skills

# スキルインストール
/plugin install document-skills@anthropics-skills
```

スキルの配置場所：

- 個人用: `~/.claude/skills/`
- プロジェクト用: `.claude/skills/`

**注意点**: コードを含むスキルは実行前にレビューすることを推奨。SkillsMPなどのコミュニティマーケットプレイスは基本的なフィルタリング（2スター以上）をしているが、信頼できるソースかどうかは自分で判断する必要がある。

## MCPとの比較

MCPと比べてSkillsのほうが扱いやすい場面が多い。

**Skillsの利点**:

- フォルダに`SKILL.md`を置くだけ
- サーバー不要、プロセス管理不要
- Gitでバージョン管理もできる
- チームで共有するときも`.claude/skills/`にコミットするだけで済む

**MCPの利点**:

- 外部サービスとリアルタイムに連携できる
- データベースへのクエリや外部APIの呼び出しなど、動的な処理が必要な場合はMCPのほうが適している

「特定のタスクの進め方を教える」「ワークフローを定義する」といった用途では、Skillsのシンプルさが際立つ。

## まとめ

Agent Skills発表から約2週間、すでにエコシステムが形成されつつある。

公式のドキュメント処理スキル、パートナー企業によるエンタープライズ連携、コミュニティによる大規模コレクション——MCPで見たエコシステムの急激な整備がSkillsでも起きている。

自分のワークフローに合ったスキルを探す楽しさもある。「こんなスキルあったらいいな」が見つかったときの嬉しさは、良いVSCode拡張を見つけたときに似ている。まだ発表から2週間なので、これからさらに面白いスキルが出てくるはず。

## 参考リンク

- [Introducing Agent Skills | Anthropic](https://www.anthropic.com/news/skills)
- [Equipping agents for the real world with Agent Skills | Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Anthropic launches enterprise Agent Skills | VentureBeat](https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard)
- [GitHub - anthropics/skills](https://github.com/anthropics/skills)
- [GitHub - wshobson/agents](https://github.com/wshobson/agents)
- [SkillsMP Marketplace](https://skillsmp.com/)
- [Claude Skills are awesome | Simon Willison](https://simonwillison.net/2025/Oct/16/claude-skills/)
- [GitHub Copilot now supports Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
