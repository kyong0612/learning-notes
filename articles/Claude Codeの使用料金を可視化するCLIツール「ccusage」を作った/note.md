---
title: "Claude Codeの使用料金を可視化するCLIツール「ccusage」を作った"
source: "https://zenn.dev/ryoppippi/articles/6c9a8fe6629cd6"
author:
  - "ryoppippi"
published: 2025-05-30
created: 2025-06-02
description: |
  Claude Codeの使用料金を可視化するCLIツール「ccusage」を作成した話。Claude Max プランでの従量課金換算コストを確認でき、日別・セッション別レポート、期間フィルタリング、JSON出力などの機能を提供。97%はClaude Codeで自動生成された開発体験についても紹介。
tags:
  - "CLI"
  - "Claude"
  - "Anthropic"
  - "ClaudeCode"
  - "tech"
  - "開発ツール"
  - "料金分析"
---

## はじめに

Claude Codeの使用料金を可視化するCLIツール「ccusage」の開発について、著者がClaude Max プランの従量課金換算コストを確認したいという動機から始まった開発エピソードを詳細に紹介している。

## 背景・きっかけ

**Claude Codeの魅力**

- 著者は元々「Vibe Coding」のアンチだったが、Claude Code + Sonnet 4の組み合わせの強力さに心変わり
- Claude Max プラン（月額$100）の使い放題プランを利用

**開発動機**

- 「従量課金だったらいくらかかってたんだろう？」という疑問
- [@milliondev](https://note.com/milliondev)さんの記事がインスピレーション源
- DuckDBでのクエリ分析が毎回面倒だったため、CLIツール化を決意

## ccusageの主要機能

### 1. インストール不要で即実行

```bash
# npxで実行
npx ccusage@latest

# bunxでも実行可能
bunx ccusage
```

### 2. 日別レポート

- 日付ごとのtoken使用量とコストを表形式で表示
- Input Tokens、Output Tokens、Total Tokens、Cost (USD)を表示
- 実行例では6日間で336.17ドルという使用実績を表示

### 3. セッション別レポート

```bash
ccusage session
```

- プロジェクトとセッションごとの使用量を確認
- どのプロジェクトが最もコストがかかっているかを可視化

### 4. 期間フィルタリング

```bash
# 特定期間のデータ表示
ccusage --since 20250525 --until 20250530
```

### 5. JSON出力対応

```bash
ccusage daily --json | jq .total
```

- プログラム処理しやすい形式
- `jq`等のツールとの組み合わせで詳細分析が可能

## 技術的詳細

### Claude Codeのデータ構造

Claude Codeは`~/.claude/projects/`以下にJSONL形式で使用履歴を保存：

- メッセージの全て
- タイムスタンプ
- 入力token数
- 出力token数
- 使用モデル
- プロジェクト名
- セッションID

### コスト計算方式

- 当初はlitellmのデータを参照してモデルごとのtoken単価を取得する予定
- 実際はログの`costUSD`を単純に足し合わせる方式に変更
- より正確で簡潔な実装となった

## 制限事項

**マルチマシン対応**

- ローカルの履歴ファイルのみを読み込み
- 複数マシンでの使用の場合は履歴ファイルの統合が必要
- Dropbox等での同期を推奨（自己責任）

## 開発体験の重要な洞察

### AI支援による開発

- **97%がClaude Codeによる自動生成**
- 人間の作業は限定的：
  - 環境構築
  - 要件指示
  - ライブラリドキュメントの提供
  - 軽微な修正
  - gitコミットメッセージ作成
  - npm公開作業

### 開発効率の変化

- lintやformatter、テストが適切に設定されていればClaude Codeが自律的にコード記述・修正
- 「Vibe Codingアンチ」から「時代の変化」を実感する体験

## リリース情報

**プロジェクトリンク**

- GitHub: <https://github.com/ryoppippi/ccusage>
- npm: <https://www.npmjs.com/package/ccusage>
- GitHub Sponsors: <https://github.com/sponsors/ryoppippi>

**コミュニティ**

- `#ccusage`ハッシュタグでの使用状況シェアを推奨
- GitHub Issuesでの機能要望受付

## 実際の使用データ

**著者の6日間使用実績**

- 総コスト: 362ドル
- これがMaxプランの$100で利用可能であることの価値を実証

![使用状況グラフ](https://res.cloudinary.com/zenn/image/fetch/s--R3yAN6Ai--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/80a1b05117456d58e22244fb.png%3Fsha%3Dbfa451c5df0af1ad626be97730aa8c0522e09099)

## まとめ

ccusageは単なるCLIツールを超えて、AI支援による開発の新しい可能性を示すケーススタディとなっている。Claude Codeの経済的価値を定量化するツールとして、また現代のAI開発体験の象徴的な事例として価値がある。

```bash
npx ccusage@latest
```

そして、できたら [`#ccusage`](https://x.com/search?q=%23ccusage&src=typed_query) のハッシュタグをつけて、あなたの使用状況をTwitter/BlueSkyにシェアしてください笑

## リンク

## 謝辞

このツールの開発にインスピレーションを与えてくださった [@milliondev](https://note.com/milliondev) さんに感謝します。元記事のDuckDBを使った分析手法は非常に勉強になりました。

## 余談

![usage](https://res.cloudinary.com/zenn/image/fetch/s--R3yAN6Ai--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/80a1b05117456d58e22244fb.png%3Fsha%3Dbfa451c5df0af1ad626be97730aa8c0522e09099)

えー、6日ですでに362ドル使ってますね...。

## 追記

このツールは97%ほどはClaude Codeに書いてもらいました。自分は環境構築とやりたいことを指示して、ライブラリのドキュメントを渡して、自分でやった方が早そうな軽微な修正をし、gitのコミットメッセージを整え、npmへの公開作業を行っただけです。  
lintやformatter、テストを適切に設定していれば、それにそってClaude Codeが自律的にコードを記述、修正してくれるので、非常に楽でした。  
Vibe Codingアンチでしたが、時代が変わっていくのをこの1週間で実感しています。

## 追記2

継続的な開発を支援してくださる方は、ぜひGitHub Sponsorsでのサポートをお願いします！

109

30
