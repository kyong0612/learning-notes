---
title: "Can this be used with a Max subscription (without an API key)? · Issue #4 · anthropics/claude-code-action"
source: "https://github.com/anthropics/claude-code-action/issues/4#issuecomment-2920787612"
author:
  - "GitHub Community"
published: 2025-05-19
created: 2025-06-02
description: "GitHubイシューで議論されているClaude Code ActionをClaude Maxサブスクリプション（APIキーなし）で使用する方法について。公式サポートはないが、セルフホストランナーを使った回避策や、フォーク版の実装例が紹介されている。"
tags:
  - "claude-code-action"
  - "claude-max"
  - "github-actions"
  - "self-hosted-runner"
  - "oauth"
  - "api-key"
---

# Claude Code ActionでClaude Maxサブスクリプションの利用について

## 問題提起

**原典**: [GitHub Issue #4](https://github.com/anthropics/claude-code-action/issues/4)  
**日付**: 2025年5月19日オープン  
**ステータス**: 未解決（Enhancement要求）

walkerkeユーザーによって提起されたこのイシューは、Claude Code ActionをAPIキーではなくClaude Maxサブスクリプション経由で認証・使用できるかという質問です。

## 公式回答

**Anthropic（ashwin-ant）の公式回答**:

- 現在、Claude Code ActionはClaude Maxサブスクリプションをサポートしていない
- GitHub Actionを使用するには `console.anthropic.com` でAPIキーを作成する必要がある

## コミュニティからの解決策

### 1. セルフホストランナーを使用した方法

**ybkimmによる詳細手順**:

1. **セルフホストランナーとClaude Codeのセットアップ**
   - 自分のマシンにセルフホストランナーを設定
   - Claude Codeをインストールし、`/login`で認証

2. **アクションのフォークと修正**
   - `claude-code-action`と`claude-code-base-action`をフォーク
   - フォーク版を使用するように設定

3. **設定の調整**
   - `Setup Node.js`と`Install Bun`ステップを削除
   - APIキー検証を削除（`claude-code-base-action/src/validate-env.ts`）
   - リポジトリで`runs-on: [self-hosted, ...]`を設定

### 2. コミュニティフォーク版の利用

**grllによるフォーク実装**:

- **リポジトリ**: [https://github.com/grll/claude-code-action](https://github.com/grll/claude-code-action)
- **ガイド**: [https://grll.bearblog.dev/use-claude-github-actions-with-claude-max/](https://grll.bearblog.dev/use-claude-github-actions-with-claude-max/)
- **重要**: 個人使用に限定、フェアユース厳守が必要

## 利用規約（ToS）の確認

**nichikiによるAnthropic サポートへの問い合わせ結果**:

### 質問

Claude MaxのToSで、Claude Codeを自動化・ヘッドレス環境（GitHub Actions セルフホストランナー）で使用することは規約違反か？

### Anthropic サポートの公式回答

**✅ 許可される事項**:

- 自動化・ヘッドレス使用の明示的な禁止はない
- 個人プロジェクトでの適度な規模での使用は問題なし
- コミュニティでの実装共有は歓迎

**⚠️ 注意事項**:

- コンシューマープランは主にインタラクティブ使用向けのため「グレーゾーン」
- 将来的にToSが変更される可能性あり
- ビジネス使用や大規模利用には商用プランが適切

## 技術的実装の詳細

### コマンドライン引数の活用

jordandakotaが言及した `-p` フラグを使用する方法：

- Claude Codeは `-p` フラグでプロジェクト実行をサポート
- 公式ドキュメントを参照すれば、Claudeにも実装方法を説明してもらえる

### OAuth認証の実装

一部のフォーク版では、Claude Maxのアカウント認証情報を使用したOAuth実装が提供されています。

## コスト比較の検討

### Claude Max vs API料金

複数のユーザーが指摘している点：

- **Claude Max**: 月額固定料金（$100-200）
- **API使用**: 従量課金制
- **多くのチームにとってMaxプランの方がコスト効率が良い**

コミュニティからは「Max料金＋API料金」の二重負担を避けたいという強い要望が表明されています。

## Anthropicへの要望

### コミュニティからの提案

jordandakotaによる建設的な提案：

1. **公式サポートの提供** または **Claude CodeのMaxからの除外**
2. **OAuthサポートの追加**によるMax利用者への配慮
3. **定額制での統合ツール利用**の提供

### 現在の状況への批判

- Sinityユーザー: 現在のMaxプランは「定額制でのAPIアクセス」と同等であり、MCPの時代にアプリサブスクリプションモデルは時代遅れ
- 多くのユーザーが公式OAuth対応を強く要望

## 今後の展望

### 短期的解決策

1. **コミュニティフォーク版の使用**（個人利用限定）
2. **セルフホストランナーでの実装**
3. **API料金を受け入れての併用**

### 長期的な希望

1. **公式OAuth対応**
2. **Max/Ultraプラン内での統合ツール提供**
3. **予測可能な定額料金モデル**

## まとめ

Claude Code ActionのClaude Max対応は現在未実装ですが、コミュニティによる回避策が複数提供されています。Anthropic サポートからは個人使用での自動化について一定の理解が示されており、将来的な公式対応への期待も高まっています。

**推奨アプローチ**:

- **個人開発者**: コミュニティフォークまたはセルフホストランナーの検討
- **企業**: API料金での運用、または公式対応を待つ
- **すべてのユーザー**: ToS遵守と適切な使用量の維持

この議論は、AI開発ツールの料金体系と開発者体験の両立という重要な課題を浮き彫りにしており、今後のAnthropicの対応が注目されます。
