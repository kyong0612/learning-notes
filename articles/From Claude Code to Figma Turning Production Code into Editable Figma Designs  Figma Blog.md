---
title: "From Claude Code to Figma: Turning Production Code into Editable Figma Designs | Figma Blog"
source: "https://www.figma.com/blog/introducing-claude-code-to-figma/?utm_source=Claude&utm_medium=organic_social&utm_campaign=CC2F"
author:
  - "[[Gui Seiz]]"
  - "[[Alex Kern]]"
published: 2026-02-17
created: 2026-02-19
description: "Claude Codeで構築したUIをブラウザからキャプチャし、編集可能なFigmaフレームとしてキャンバスに取り込む新機能の紹介。コードファーストのワークフローとデザインキャンバスを双方向に接続し、チームでの探索・分岐・意思決定を加速する。"
tags:
  - "clippings"
  - "Figma"
  - "Claude Code"
  - "AI"
  - "design-to-code"
  - "code-to-design"
  - "MCP"
  - "prototyping"
---

## 概要

Claude Codeで構築した実動するUIを、ブラウザ（本番環境・ステージング・localhost）からキャプチャし、**編集可能なFigmaフレーム**としてキャンバスに変換する新機能「Claude Code to Figma」の紹介記事。コードによる「収束」とキャンバスによる「発散」を流動的に行き来できるワークフローを提唱している。

## コードからキャンバスへ：なぜ必要なのか

- **コードの強み（収束）**: ビルド→クリック→ひとつの状態に到達する直線的なプロセス。リアルデータを扱い、インタラクションを確認し、技術的スコープを把握できる
- **キャンバスの強み（発散）**: 体験全体を見渡し、分岐を確認し、方向性を共同で決めるオープンなスペース
- **課題**: AI駆動のClaude Codeでプロトタイプを素早く作れるようになったが、その成果物を「リニアなコンテキスト」から「共有空間」に持ち出す方法がなかった

> Moving quickly matters. But speed without exploration can turn into momentum in the wrong direction. That's the moment when code needs to meet the canvas.

## Start anywhere, go further（どこから始めても、さらに先へ）

### コードファースト探索の限界

- コードでの探索はローカルかつ単独作業になりがち
- UIが単一画面を超えると、ソロでの高速開発がかえって制約になる
- フィードバック収集にはスクリーンショット共有やローカルビルドの依頼が必要で、チームで広く探索したいタイミングに摩擦が発生する

### Claude Code to Figmaが解決すること

- キャプチャした各画面をクリップボードにコピーし、任意のFigmaファイルにペースト可能
- Figmaフレームとして整理・複製・リファイン・共有ができる
- チームは単にUIを閲覧するだけでなく、**注釈**を付け、不明点を指摘し、異なるアイデアを探索できる
- **複数画面を1セッションでキャプチャ**し、フローのシーケンスとコンテキストを保持できる

## Build the best idea, not just the first one（最初のアイデアだけでなく、最良のアイデアを）

AIによって「始めること」が容易になった今、デザインの会話は「何をどう作るか」から**「どのバージョンを発展させるか」**にシフトしている。

### Figmaでの多様なスタート地点

| スタート地点 | 説明 |
|---|---|
| **Figma Make** | プロンプトからプロトタイプを生成 |
| **Copy design** | Makeプレビューをキャンバスに直接取り込み |
| **Claude Code to Figma** | コードファーストで構築したUIを編集可能なデザイン成果物に変換 |

いずれのスタート地点でも、目標は同じ：**素早く具体物に到達し、そこからさらに深く探索する**。

### Claude Code to Figmaの4つのメリット

1. **システム全体を一目で視覚化**: Figmaキャンバスに並べることで、パターン・ギャップ・トレードオフ・不整合を発見しやすくなる（特にマルチステップフローで有効）
2. **再実装なしにバリエーションを探索**: フレームの複製、ステップの並べ替え、構造変更をコード書き換えなしで試行できる。却下案も将来の参考として残る
3. **より早い段階でより良い意思決定**: デザイナー・エンジニア・PMが同じ成果物・同じコンテキスト・同じ忠実度で反応できる。明確な正解がない場面で、意思決定がまだ容易なうちに論点を浮上させる
4. **構築済みUIを共有の方向性に変換**: チームが意思決定を注釈し、オプションを概念化し、チームメイトの目標を理解することで、機能を「ユーザーが感じられる意味ある体験」に昇華する

## Roundtrip back to code（コードへのラウンドトリップ）

- [Figma MCPサーバー](https://www.figma.com/blog/introducing-figma-mcp-server/)を使って、Figmaからコーディング環境にワークをシンプルに持ち帰ることが可能
- プロンプトとFigmaフレームへのリンクで、共有認識からビルドへコンテキストを失わず移行
- **コード→Figma→コード**の双方向ワークフローが実現し、障壁が少ないほど大胆なアイデアが前進する

## 著者情報

- **Gui Seiz**: FigmaのAIデザインディレクター。エージェンティックワークフロー（デザイン＆コード）を担当。以前はPinterestでAIイニシアチブをリード
- **Alex Kern**: Figmaのソフトウェアエンジニア。コード・デザイン・AIの交差領域に注力。Figma以前はDynaboard（2024年にFigma参画）の創業者

## 関連リソース

- [Figma MCPサーバーガイド](https://help.figma.com/hc/en-us/articles/32132100833559)
- [開発者ドキュメント（MCP tools / generate_figma_design）](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#generate_figma_design)
- [Bringing Figma Make to the canvas（Copy design機能）](https://www.figma.com/blog/bringing-figma-make-to-the-canvas/)
