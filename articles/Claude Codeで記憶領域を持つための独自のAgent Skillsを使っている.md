---
title: "Claude Codeで記憶領域を持つための独自のAgent Skillsを使っている"
source: "https://zenn.dev/yamadashy/articles/claude-code-agent-skills-agent-memory"
author:
  - "yamadashy"
published: 2026-01-05
created: 2026-01-10
description: |
  Claude Codeでエージェントに作業内容を記憶させ、中断と再開を容易にするための独自Agent Skill「agent-memory」の実装と活用方法を解説。ファイルベースのシンプルな仕組みで、「記憶して」「思い出して」といった自然言語コマンドで対話のコンテキストを保存・復元できる。
tags:
  - "AI"
  - "Claude"
  - "Claude Code"
  - "Agent Skill"
  - "Productivity"
---

## 概要

Claude Codeを使った開発において、作業内容をエージェントに記憶させて「ひとまず忘れたい」と思う場面がある。例えば：
- 作業中に別の差し込みが入ったとき
- 気になった何かを調査させて、一旦寝かせておきたいとき

Claude Codeには履歴から再開する機能があるが、履歴は日々増えていくため古いものを辿るのは面倒。そこで、**agent-memory**というスキルをローカルに作成して活用している。

---

## やっていること

シンプルな仕組みのスキル：

- **中断するとき**: 「記憶して」「覚えておいて」と言うと、要点がマークダウンファイルとして保存される
- **再開するとき**: 「○○について思い出して」と言えば、保存された内容を探し出し、そこから続けられる

記憶させる内容は自由：
- 調査結果
- 方針
- 決定事項
- 今やっていたことの要約

特に残しておきたいのは**対話の中で整理された意図と判断**。ここさえ残っていれば再開しやすい。

### フォルダ構造

```
.claude/
└── skills/
    └── agent-memory/
        ├── SKILL.md
        ├── .gitignore
        └── memories/
            └── (保存されたメモリファイル)
```

- `memories` フォルダ配下をどのように整理するかはエージェントにすべて任せる
- プライベートな記憶領域として扱うため `.gitignore` で除外

### SKILL.mdの役割

`SKILL.md` の description で、どんな発話でスキルが発火するかを定義：
- 「記憶して」「保存して」→ 記憶の保存
- 「思い出して」「メモ確認して」→ 記憶の検索・復元

**参考**: [SKILL.md (GitHub)](https://github.com/yamadashy/repomix/blob/main/.claude/skills/agent-memory/SKILL.md)

### 記憶ファイルの形式

記憶はマークダウンファイルとして保存され、frontmatterに `summary` を書くように指示しているため、エージェントが探しやすく一覧性も上がる。

```yaml
---
summary: ○○に関する調査結果
---
(詳細な内容)
```

### 検索の仕組み（Progressive Disclosure）

「思い出して」と言われたとき、Claude Codeは：
1. まず `rg` (ripgrep) で `summary` 行だけを取り出す
2. どのファイルを読むべきか判断
3. 必要なファイルだけを読む

これは Agent Skill の **Progressive Disclosure（段階的開示）** と同じ考え方：
> 「まず概要で判断、必要なら詳細を読む」

少し変えれば**自己成長するスキル**も作れる。

---

## 導入方法

1. **フォルダを作成**
   ```bash
   mkdir -p .claude/skills/agent-memory/memories
   ```

2. **SKILL.mdをコピー**
   - [こちら](https://github.com/yamadashy/repomix/blob/main/.claude/skills/agent-memory/SKILL.md) の SKILL.md をコピーして `.claude/skills/agent-memory/SKILL.md` に配置

3. **.gitignoreを作成**
   ```
   # .claude/skills/agent-memory/.gitignore
   memories/
   ```

これで「記憶して」「思い出して」が使えるようになる。

---

## なぜAgent Skillか

### 代替案との比較

| 選択肢 | 特徴 | 課題 |
|--------|------|------|
| **Memory MCP** (Anthropic公式) | 公式サポート | 保存先が共通、人間の確認がしづらい、MCPを使うまでもない |
| **claude-mem** | 高機能（自動キャプチャ、ベクトル検索） | Claude Codeプラグインなので他ツールでは使えない |
| **Agent Skill** ✅ | シンプル、ポータブル | - |

### Agent Skillを選んだ理由

- **リポジトリごとに記憶領域を持たせたい**
- ファイルベースで記憶して、`rg` で探索させれば十分
- Markdownなら**人間でも探して読める**
- **オープンな仕様**: Codex, Cursor, Copilot などのエージェントツールからも参照可能
- MCPに比べて**ポータビリティに優れる**
- シンプルな構造で**カスタマイズ性が高い**

---

## おわりに

マルチタスクをこなすうえで大事なのは、**「メモを残して忘れること」**。

> 「記憶して」と言えば残る。  
> 「思い出して」と言えば戻れる。

それだけで、中断と再開のハードルがぐっと下がる。

気になる方は試して自分好みにカスタマイズしてみてください。

---

## 関連リンク

- [yamadashy/repomix - GitHub](https://github.com/yamadashy/repomix)
- [SKILL.md (agent-memory)](https://github.com/yamadashy/repomix/blob/main/.claude/skills/agent-memory/SKILL.md)
- [yamadashy - Zenn](https://zenn.dev/yamadashy)
