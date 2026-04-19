---
title: "browser-use/video-use"
source: "https://github.com/browser-use/video-use"
author:
  - "browser-use"
published:
created: 2026-04-19
description: "Claude Code で動画を編集する 100% オープンソースの Skill。生素材のフォルダを指定して対話するだけで、フィラー除去・カラーグレーディング・字幕焼き込み・アニメ合成などを行い `final.mp4` を返す。LLM は映像を「見る」のではなく音声トランスクリプトを「読む」ことで、word-boundary 精度のカットを実現する。"
tags:
  - "clippings"
  - "claude-code"
  - "video-editing"
  - "agent-skills"
  - "ffmpeg"
  - "llm-tooling"
---

## 概要

**video-use** は、[browser-use](https://github.com/browser-use) が公開した Claude Code 向けの動画編集 Skill。「生素材を置いたフォルダを指定して Claude Code と会話するだけで `final.mp4` が返ってくる」ことを目指した、100% オープンソースのツール。トーキングヘッド、モンタージュ、チュートリアル、旅行動画、インタビューなど、プリセットやメニューなしにあらゆるコンテンツに対応する。

コアアイデアは **browser-use の「LLM に screenshot ではなく DOM を渡す」発想を動画に適用した**こと。LLM は動画を直接「見る」のではなく、構造化されたテキスト（トランスクリプト）を「読む」ことで編集判断を行う。

## 主な機能 (What it does)

- **フィラー語・間の除去**: `umm`、`uh`、言い直し、テイク間のデッドスペースを自動カット
- **自動カラーグレーディング**: warm cinematic / neutral punch / 任意の ffmpeg チェーンを各セグメントに適用
- **ポップノイズ防止**: すべてのカット境界に 30ms のオーディオフェードを挿入
- **字幕焼き込み**: デフォルトは 2 単語の UPPERCASE チャンク、スタイルは自由にカスタマイズ可能
- **アニメーションオーバーレイ生成**: [Manim](https://www.manim.community/)、[Remotion](https://www.remotion.dev/)、PIL を並列サブエージェントで起動（1 アニメーション = 1 サブエージェント）
- **レンダリング結果の自己評価**: カット境界ごとに出力を自己チェックしてからユーザーに提示
- **セッションメモリの永続化**: `project.md` に状態を保存し、翌週の続きから再開可能

## セットアップ

```bash
# 1. clone して Claude Code の skills ディレクトリに symlink
git clone https://github.com/browser-use/video-use
cd video-use
ln -s "$(pwd)" ~/.claude/skills/video-use

# 2. 依存関係のインストール
pip install -e .
brew install ffmpeg           # 必須
brew install yt-dlp           # オンラインソースをダウンロードする場合のみ

# 3. ElevenLabs API キーを設定
cp .env.example .env
$EDITOR .env                   # ELEVENLABS_API_KEY=...
```

使用時は、生素材を置いたフォルダで `claude` を起動し、

> edit these into a launch video

のように指示するだけ。ソースをインベントリし、戦略を提案→ユーザーの OK を待って、`edit/final.mp4` を出力する。すべての出力は `/edit/` 配下にまとまり、Skill ディレクトリは汚さない。

## アーキテクチャ: LLM は動画を「読む」

video-use の要は **LLM に映像フレームを送り込まないこと**。2 層構造のテキスト/視覚表現で、単語境界レベルのカット精度を実現している。

### Layer 1 — 音声トランスクリプト (常時ロード)

ElevenLabs Scribe を 1 ソースにつき 1 回呼び出し、

- 単語レベルのタイムスタンプ
- 話者ダイアライゼーション (diarization)
- 音声イベント (`(laughter)`、`(applause)`、`(sigh)` など)

を取得。全テイクを **~12KB の単一 `takes_packed.md`** にパックし、これが LLM の主要な読み込みビューとなる。

```
## C0103  (duration: 43.0s, 8 phrases)
  [002.52-005.36] S0 Ninety percent of what a web agent does is completely wasted.
  [006.08-006.74] S0 We fixed this.
```

### Layer 2 — 視覚コンポジット (オンデマンド)

`timeline_view` ツールで、指定範囲について **フィルムストリップ + 波形 + 単語ラベル** を 1 枚の PNG として生成。以下のような判断ポイントでのみ呼び出す。

- 曖昧な pause の扱い
- 複数テイクの比較
- カット位置の最終サニティチェック

### 規模の対比 (強調された重要ポイント)

> ナイーブな手法: 30,000 フレーム × 1,500 tokens = **ノイズ 45M tokens**
> Video Use: **12KB のテキスト + ごく少数の PNG**

これは「LLM にスクショではなく構造化 DOM を渡す」という **browser-use と同じ発想を動画に適用したもの**。

## パイプライン

```
Transcribe ──> Pack ──> LLM Reasons ──> EDL ──> Render ──> Self-Eval
                                                              │
                                                              └─ issue? fix + re-render (max 3)
```

- **Transcribe**: ElevenLabs Scribe で単語単位書き起こし
- **Pack**: 全テイクを `takes_packed.md` に集約
- **LLM Reasons**: LLM がトランスクリプト上で編集判断
- **EDL (Edit Decision List)**: カット・トランジション・エフェクトの決定リストを生成
- **Render**: ffmpeg 等で実レンダリング
- **Self-Eval**: レンダリング済み出力に対して各カット境界で `timeline_view` を再実行し、視覚的ジャンプ・オーディオポップ・非表示字幕などを検出。問題があれば修正して再レンダリング（最大 3 回）。プレビューはパスしてからユーザーに出す。

## 設計原則 (Design principles)

1. **Text + on-demand visuals**: フレームダンプはしない。トランスクリプトが一次インターフェース。
2. **Audio is primary, visuals follow**: カットは発話境界と silence gap から導く。
3. **Ask → confirm → execute → self-eval → persist**: 戦略承認なしにカットには触れない。
4. **Zero assumptions about content type**: 見て、聞いて、それから編集。
5. **12 hard rules, artistic freedom elsewhere**: プロダクション正しさ（production-correctness）は非交渉。センスの部分は自由。

編集クラフトと 12 の production rule の詳細は、リポジトリ内の [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) に記載されている。

## 重要な示唆

- **ハーネス設計としての意義**: LLM に巨大なマルチモーダル入力（動画フレーム列）を直接与えず、**ドメインに即したテキスト中間表現 + オンデマンドの視覚ツール** に落とし込むことで、コンテキスト窓・コスト・精度のすべてで優位に立てる。これは browser-use が Web でやっていることを動画領域にそのまま翻訳した好例。
- **Claude Code Skill としてのパッケージング**: `~/.claude/skills/` にシンボリックリンクするだけで Claude Code の能力拡張になる形式は、エージェントスキルの配布モデルとして参考になる。
- **Self-Eval ループ**: レンダリング後に自分の出力を再検査して自己修正する (最大 3 回) ループは、エージェント系ツールにおける品質担保パターンとして汎用的に使える。

## 制限事項・前提

- `ffmpeg` は必須、`yt-dlp` はオンラインソース取得時のみ必要
- 文字起こしは **ElevenLabs Scribe API** に依存 (`ELEVENLABS_API_KEY` が必要)
- セットアップは Claude Code の Skill 機構 (`~/.claude/skills/`) を前提とする
- 自己評価による自動修正の上限は **3 回**
- README には評価ベンチマークや定量的な品質比較は記載されていない
