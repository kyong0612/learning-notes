---
title: "Thread by @_chenglou"
source: "https://x.com/_chenglou/status/2037713766205608234?s=12"
author:
  - "[[@_chenglou]]"
published: 2026-03-28
created: 2026-03-30
description: "Cheng Lou（React, ReScript, Midjourney出身）が、DOMレイアウト・リフローを完全にバイパスする純TypeScriptテキスト計測・レイアウトライブラリ「Pretext」を発表。従来のDOM計測と比較して約500倍高速で、多言語・RTL・emoji・混合双方向テキストに対応。AI時代のUI構築における最大のボトルネックであったテキストレイアウト問題を解決する基盤技術。"
tags:
  - "clippings"
  - "TypeScript"
  - "text-layout"
  - "web-performance"
  - "frontend"
  - "UI-engineering"
---

## 要約

### スレッドの概要

Cheng Lou（[@_chenglou](https://x.com/_chenglou)）が2026年3月28日に、フロントエンド開発の将来を大きく変える基盤技術として **Pretext** を発表したスレッド。Pretextは、**純粋なTypeScriptで実装されたテキスト計測・レイアウトアルゴリズム**であり、DOMの計測やCSSに依存せずにWebページ全体のテキストレイアウトを実現する。

> "I have crawled through depths of hell to bring you, for the foreseeable years, one of the more important foundational pieces of UI engineering"

---

### 解決する問題：テキストレイアウトのボトルネック

従来のWeb開発では、テキストの高さや幅を正確に知るためには `getBoundingClientRect` や `offsetHeight` などのDOM計測が必要だった。これらの操作はブラウザの **レイアウトリフロー（reflow）** を発生させ、ブラウザで最もコストの高い処理の一つとなっていた。

Cheng Louは「テキストレイアウトと計測は、より興味深いUIを実現するための最後かつ最大のボトルネックだった。特にAIの時代において」と述べている。Pretextによりこの問題が解決され、**GLランディングページの派手さとブログ記事の実用性を両立**できるようになった。

---

### Pretextの主要な特徴

| 特徴 | 詳細 |
|---|---|
| **パフォーマンス** | 従来のDOM計測と比較して **約500倍高速** |
| **サイズ** | 数KB程度の軽量ライブラリ |
| **多言語対応** | emoji、RTL（右から左）、CJK、混合双方向テキストを含むすべての言語に対応 |
| **レンダリング出力** | DOM、Canvas、SVG、将来的にはサーバーサイドレンダリング |
| **計測手法** | ブラウザ自身のフォントエンジンを「正解」として使用しつつ、独自のテキスト計測ロジックを実装 |

#### ベンチマーク

- `prepare()`: 500テキストの共有バッチに対して約 **19ms**（一回限りの前処理）
- `layout()`: 同バッチに対して約 **0.09ms**（純粋な算術処理、リフローなし）

---

### API設計

Pretextは2つのユースケースに対応する。

#### ユースケース1: DOMに触れずに段落の高さを計測

```typescript
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('AGI 春天到了. بدأت الرحلة 🚀', '16px Inter')
const { height, lineCount } = layout(prepared, textWidth, 20)
```

- `prepare()` はテキストの正規化・セグメンテーション・計測を行う一回限りの前処理
- `layout()` はキャッシュされた幅に対する純粋な算術処理（リサイズ時はこちらだけ再実行）
- `{ whiteSpace: 'pre-wrap' }` オプションでtextarea的なテキスト保持も可能

#### ユースケース2: 手動での行レイアウト制御

- **`layoutWithLines()`**: 固定幅での全行レイアウト情報を返す
- **`walkLineRanges()`**: テキスト文字列を構築せずに行幅とカーソル情報を返す（バイナリサーチによる最適幅の探索に利用）
- **`layoutNextLine()`**: 行ごとに異なる幅でテキストを配置（画像の回り込みなど）

---

### デモと実用例

スレッドで紹介された3つのデモに加え、公式デモサイト（[chenglou.me/pretext](https://chenglou.me/pretext/)）には合計8つのデモが公開されている。

#### 1. Masonry（仮想化/オクルージョン）
- 数十万個のテキストボックスをDOM計測なしで仮想化
- 高さの可視性チェックが**単一の線形キャッシュレストラバーサル**に簡略化
- スクロール＆リサイズが **120fps** で動作
- [デモ](https://chenglou.me/pretext/masonry/)

#### 2. Shrinkwrapped Chat Bubbles（チャットバブルの収縮ラップ）
- CSSの `width: fit-content` では最も長い行に合わせてサイズが決まり、短い最終行に無駄な空間が生じる
- Pretextの `walkLineRanges()` を使ったバイナリサーチで、**同じ行数を維持する最小幅**を発見
- **無駄なピクセル: 0**（CSSでは不可能）
- CJK、emoji、アラビア語の混合テキストにも対応
- [デモ](https://chenglou.me/pretext/bubbles/)

#### 3. Dynamic Layout（動的マガジンレイアウト）
- レスポンシブかつ動的な複数カラムのエディトリアルレイアウト
- 障害物認識タイトルルーティングと連続フロー
- すべてJSでレイアウト
- [デモ](https://chenglou.me/pretext/dynamic-layout)

#### その他のデモ
- **Accordion**: DOM計測やCSSハックなしでセクション高を計算するアコーディオン
- **Variable Typographic ASCII**: プロポーショナルフォントによるASCIIアート
- **Editorial Engine**: アニメーションオーブ、ライブテキストリフロー、プルクォート、マルチカラムフロー（DOM計測ゼロ）
- **Justification Comparison**: CSS両端揃え・貪欲ハイフネーション・Knuth-Plassアルゴリズムの比較
- **Rich Text**: インラインリッチテキスト、コードスパン、リンク、チップの自然なレイアウト

---

### 実用的なユースケース

Pretextが解決する具体的な課題:

1. **仮想化/オクルージョン**: 推測やキャッシュなしでの正確な仮想スクロール
2. **ユーザーランドレイアウト**: masonry、JS駆動のflexbox的実装、CSSハック不要の微調整
3. **開発時検証**: AI生成UIでボタンラベルが次の行にオーバーフローしないことをブラウザなしで検証
4. **レイアウトシフト防止**: 新しいテキスト読み込み時のスクロール位置再アンカリング
5. **テキストエディタ**: auto-growingなtextareaの正確な高さ計算
6. **AIフレンドリー**: AI駆動のUI生成における動的レイアウト計算

---

### 制限事項

- 完全なフォントレンダリングエンジンではない
- 対応するCSSプロパティ: `white-space: normal`、`word-break: normal`、`overflow-wrap: break-word`、`line-break: auto`
- macOSでは `system-ui` フォントの使用は `layout()` の精度が不安定（名前付きフォントを推奨）
- 非常に狭い幅ではグラフェム境界での単語内改行が発生する可能性がある

---

### クレジットと背景

- **Cheng Lou** は React、ReScript、Midjourney での経歴を持つ開発者
- Sebastian Markbageが前の10年間に [text-layout](https://github.com/chenglou/text-layout) で種を蒔いた設計思想（Canvas `measureText` によるシェーピング、pdf.jsからのbidi、ストリーミング改行処理）が基盤
- GitHubで **14,500+スター** を獲得（2026年3月時点）
- npm: `npm install @chenglou/pretext`

---

### 重要な結論

> **テキストレイアウトはWeb UIの最後のボトルネックだった。** Pretextはこれを純粋な算術処理に変換することで、フロントエンド開発者がブラウザのCSS/DOMの制約から解放され、より自由で高性能なUIを構築できる道を開いた。これはAI時代における動的UI生成において特に重要な意味を持つ。

---

## 元のスレッド

**Cheng Lou** @\_chenglou [2026-03-28](https://x.com/_chenglou/status/2037713766205608234)

My dear front-end developers (and anyone who's interested in the future of interfaces):

I have crawled through depths of hell to bring you, for the foreseeable years, one of the more important foundational pieces of UI engineering (if not in implementation then certainly at least in concept):

Fast, accurate and comprehensive userland text measurement algorithm in pure TypeScript, usable for laying out entire web pages without CSS, bypassing DOM measurements and reflow

---

**Cheng Lou** @\_chenglou [2026-03-28](https://x.com/_chenglou/status/2037714022964064560)

Text layout & measurement was the last & biggest bottleneck for unlocking much more interesting UIs, especially in the age of AI

With this solved, no longer do we have to choose between the flashiness of a GL landing page, vs the practicality of a blog article. Demos:

---

**Cheng Lou** @\_chenglou [2026-03-28](https://x.com/_chenglou/status/2037714278141362516)

1\. Occlusion (virtualization) of hundreds of thousands of text boxes, each with differing height, without DOM measurement, therefore simplifying the visibility check to a single linear cache-less traversal of heights, scrolling & resizing at 120fps https://chenglou.me/pretext/masonry/…

---

**Cheng Lou** @\_chenglou [2026-03-28](https://x.com/_chenglou/status/2037714396680741221)

2\. Shrinkwrapped chat bubbles https://chenglou.me/pretext/bubbles/…

---

**Cheng Lou** @\_chenglou [2026-03-28](https://x.com/_chenglou/status/2037714574057898427)

3\. Multi-columns magazine layout, but \_responsive\_ and dynamic https://chenglou.me/pretext/dynamic-layout…
