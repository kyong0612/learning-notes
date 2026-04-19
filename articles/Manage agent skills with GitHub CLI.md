---
title: "Manage agent skills with GitHub CLI"
source: "https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/"
author:
  - "[[Allison]]"
published: 2026-04-17
created: 2026-04-19
description: |
  GitHub CLI に新コマンド `gh skill` が追加され、Agent Skills を GitHub リポジトリから発見・インストール・管理・公開できるようになった。GitHub Copilot / Claude Code / Cursor / Codex / Gemini CLI など複数のエージェントホストに対応し、バージョンピン留めやツリー SHA ベースの変更検知で、スキル配布のサプライチェーンセキュリティを担保する。
tags:
  - "clippings"
  - "github-cli"
  - "agent-skills"
  - "ai-agents"
  - "developer-tools"
  - "supply-chain-security"
---

## 概要

GitHub は GitHub CLI v2.90.0 で、AI コーディングエージェント向けの「Agent Skills」を管理する新コマンド **`gh skill`** をパブリックプレビューとして公開した。これにより、GitHub リポジトリをソースとしてスキルを発見・インストール・更新・公開する一連のワークフローが、既存のパッケージマネージャに近い体験で利用できるようになる。

## Agent Skills とは

- **Agent Skills** は、AI エージェントに特定タスクの実行方法を教える「命令・スクリプト・リソースのポータブルなセット」。
- オープン仕様の [Agent Skills specification](https://agentskills.io/) に準拠し、単一のフォーマットで複数のエージェントホストを横断して動作する。
- 対応ホスト: **GitHub Copilot, Claude Code, Cursor, Codex, Gemini CLI, Antigravity** など。

## 主要機能

### 1. スキルのインストールと発見

GitHub CLI をアップデート後、以下のコマンドでインタラクティブ／ダイレクトにインストールできる。

```bash
# リポジトリ内のスキルをブラウズして対話的にインストール
gh skill install github/awesome-copilot

# 特定スキルを直接インストール
gh skill install github/awesome-copilot documentation-writer

# @tag でバージョン指定
gh skill install github/awesome-copilot documentation-writer@v1.2.0

# コミット SHA を指定
gh skill install github/awesome-copilot documentation-writer@abc123def

# キーワード検索
gh skill search mcp-apps
```

スキルは各エージェントホストに対応したディレクトリへ自動配置される。`--agent` と `--scope` フラグでターゲットを明示指定することも可能。

```bash
gh skill install github/awesome-copilot documentation-writer \
  --agent claude-code --scope user
```

### 対応エージェントホスト一覧

| Host | インストール例 |
| --- | --- |
| GitHub Copilot | `gh skill install OWNER/REPOSITORY SKILL` |
| Claude Code | `gh skill install OWNER/REPOSITORY SKILL --agent claude-code` |
| Cursor | `gh skill install OWNER/REPOSITORY SKILL --agent cursor` |
| Codex | `gh skill install OWNER/REPOSITORY SKILL --agent codex` |
| Gemini CLI | `gh skill install OWNER/REPOSITORY SKILL --agent gemini` |
| Antigravity | `gh skill install OWNER/REPOSITORY SKILL --agent antigravity` |

### 2. バージョンピン留めとサプライチェーン整合性

スキルは AI エージェントの挙動を書き換える「実行可能な命令」であるため、**サイレントな変更はサプライチェーンリスク**になる。`gh skill` は GitHub が既に提供するプリミティブを使って、パッケージマネージャ同等の保証を実現する。

- **タグとリリース**: 公開リリースは必ず git タグに紐付く。`gh skill publish` は [immutable releases](https://docs.github.com/repositories/releasing-projects-on-github/about-releases) の有効化を促し、公開後は管理者でもリリース内容を改ざんできない状態にできる。
- **コンテンツアドレス方式の変更検知**: インストール時に対象ディレクトリの **git tree SHA** を記録。`gh skill update` はローカル SHA とリモートを比較し、バージョン番号の上げ下げではなく「実際のコンテンツ差分」を検出する。
- **ポータブルな来歴 (provenance)**: トラッキング用メタデータ（リポジトリ、ref、tree SHA）は `SKILL.md` の [frontmatter](https://agentskills.io/specification#frontmatter) に書き込まれる。ファイルが別プロジェクトへコピー／移動されてもトラッキングと更新が追従できる。
- **バージョンピン留め**: `--pin` でタグ／コミット SHA に固定。ピン留めされたスキルは更新対象から除外されるため、意図しないアップデートを防げる。

```bash
# リリースタグにピン
gh skill install github/awesome-copilot documentation-writer --pin v1.2.0

# コミット SHA にピン（最大の再現性）
gh skill install github/awesome-copilot documentation-writer --pin abc123def
```

### 3. スキルの公開

スキルリポジトリのメンテナ向けに、公開前バリデーションを提供。

```bash
# すべてのスキルを検証
gh skill publish

# メタデータの問題を自動修正
gh skill publish --fix
```

`gh skill publish` は以下を検査する。

- [agentskills.io specification](https://agentskills.io/specification) への準拠
- リモート側の推奨設定: **tag protection, secret scanning, code scanning, immutable releases**

これらは必須ではないが、リポジトリが乗っ取られた場合でも既存リリースが改変されなくなるなど、利用者側のタグピン留めを本当に意味のあるものにする。

### 4. スキルの更新

`gh skill update` は既知のエージェントホストディレクトリをスキャンし、各スキルの provenance メタデータを読んで上流の変更を確認する。

```bash
# 対話的に更新確認
gh skill update

# 特定スキルだけ更新
gh skill update git-commit

# 確認なしで全更新
gh skill update --all
```

## セキュリティ上の注意

- インストールは **利用者の自己責任**。GitHub による検証は行われず、スキルには **プロンプトインジェクション・隠し命令・悪意あるスクリプト** が含まれる可能性がある。
- インストール前には **`gh skill preview`** でスキル内容を確認することが強く推奨されている。

## 重要な示唆

- スキルの配布基盤が「リポジトリ + タグ + tree SHA」に標準化されたことで、**AI エージェント向けの事実上のパッケージマネージャ**が GitHub 上に整備された。
- 来歴メタデータを `SKILL.md` frontmatter に埋め込む設計により、スキルがコピー・移動されても追跡可能で、**ポータビリティと監査性が両立**している。
- マルチエージェント（Copilot / Claude Code / Cursor / Codex / Gemini / Antigravity）を `--agent` で横断管理できるため、**エージェントロックインを避けつつスキルを共有**できる。

## 制限事項

- `gh skill` は **パブリックプレビュー**であり、予告なく仕様が変更される可能性がある。
- GitHub CLI **v2.90.0 以降**が必須。
- スキルコンテンツ自体は GitHub による検証対象外のため、利用者側のレビューが前提。

## 参考リンク

- [Agent Skills specification](https://agentskills.io/)
- [gh_skill documentation](https://cli.github.com/manual/gh_skill)
- [GitHub CLI v2.90.0 リリース](https://github.com/cli/cli/releases/tag/v2.90.0)
- [GitHub Community discussions](https://github.com/orgs/community/discussions)
