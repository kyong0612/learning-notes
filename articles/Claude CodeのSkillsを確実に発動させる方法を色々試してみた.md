---
title: "Claude CodeのSkillsを確実に発動させる方法を色々試してみた"
source: "https://zenn.dev/ka888aa/articles/b7fcb48a3b3fa9"
author:
  - "kaya"
published: 2026-01-03
created: 2026-01-05
description: "Claude Codeの「Skills」機構を確実に発動させるための方法を実験的に検証。CLAUDE.md直書き（100%）、Forced Eval Hook（84%）、権限設定のみ（25%）の3つのアプローチを比較検証した実践的な記事。"
tags:
  - "Claude Code"
  - "Skills"
  - "AI"
  - "Agent Skills"
  - "開発環境"
  - "clippings"
---

## 要約

Claude Codeの「Skills」機構の発動を確実にするための実験的検証記事。理論上は自動で発動するはずのSkillsが、実際には25%程度の低い発動率であることを発見。複数のアプローチを試行した結果、以下の3つの方法とその効果を明らかにした：

### 検証結果

1. **権限設定のみ**: 体感約25%の発動率。`.claude/settings.json`に`"Skill"`権限を追加するだけでは不十分
2. **Forced Eval Hook**: 84%の発動率（200回以上のテストによる）。`UserPromptSubmit`フックで強制的にSkill評価を挿入する方法
3. **CLAUDE.md直書き**: 100%の発動率。最も確実だが、Skillsの機構を使わない回避策

### 重要な発見

- Skillsの自律判断機能は現状信頼できない（25%程度の発動率）
- Forced Eval Hookは「Step 1: 評価」→「Step 2: 実行」→「Step 3: 実装」の3段階強制実行により84%まで改善
- 残り16%の失敗は確率的なブレ（モデルの非決定性）によるもの
- CLAUDE.mdは100%確実だが、チーム共有の観点ではSkillsの方が優れている

### 実用的な推奨事項

- **確実性重視**: CLAUDE.mdに直接ワークフロー指示を記述
- **チーム共有重視**: Skills + Forced Eval Hookの組み合わせ
- 複雑なTDDワークフロー（RED→GREEN→REFACTORのフェーズ分け）などはSkills定義が有効

### 技術的詳細

- Forced Eval Hookの実装には`.claude/hooks/skill-forced-eval-hook.sh`スクリプトを作成
- 「WORTHLESS」「CRITICAL」などの強い言葉を使わないと指示が無視される
- hookのタイミング（`PreToolUse`など）を変えても効果なし
- プロンプト長による影響は限定的
