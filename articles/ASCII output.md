---
title: "ASCII output"
source: "https://d2lang.com/blog/ascii/"
author:
  - "[[Terrastruct]]"
published: 2025-08-02
created: 2025-08-26
description: |
  In the latest release of D2 (0.7.1), we introduce ASCII outputs for generating text-based diagrams, useful for code documentation and environments where images aren't supported.
tags:
  - "clippings"
  - "D2"
  - "ASCII"
  - "diagram-as-code"
  - "documentation"
---
D2の最新リリース（0.7.1）で、ASCII出力が導入されました。

拡張子が `txt` の出力ファイルは、ASCIIレンダラーを使用して書き込まれます。

```
d2 in.d2 out.txt
```

これは[D2 Vim拡張機能](https://github.com/terrastruct/d2-vim)でのレンダリング例です。ユーザーが `.d2` ファイルを開くとプレビューウィンドウが開き、保存するたびに更新されます。

![D2 Vim preview](https://d2lang.com/assets/images/preview-d04cd1ad32fec06203b93a3ac64d903f.gif)

## コードドキュメント

ASCIIダイアグラムが最も役立つ場所の一つは、ソースコードのコメント内でしょう。関数やクラスの隣に小さくシンプルな図を置くことで、フローを説明するよりもはるかに明確になります。

ここでもVim拡張機能が、D2コードを書いて選択範囲をASCIIレンダリングに置き換える機能を示しています。

![D2 Vim replace](https://d2lang.com/assets/images/replace-7658a2addaa42da73547218f1cffe1d5.gif)

## Unicodeと標準ASCII

ASCIIレンダリングのデフォルト文字セットはUnicodeで、より見栄えの良い罫線文字が含まれています。最大限の移植性のために真のASCIIが必要な場合は、`--ascii-mode=standard` フラグで指定できます。

## 制限事項

> **Alpha**
> ASCIIレンダラーはアルファ段階と見なすべきです。多くのコーナーケース、改善点、そして明らかなバグが存在するでしょう。もし利用してみて気に入ったら、遭遇した問題を[GitHub Issues](https://github.com/terrastruct/d2/issues)に報告していただけると幸いです。

ASCIIレンダラーは、ELKレイアウトエンジンによって決定されたレイアウトをダウンスケールし、さらにコンパクトにするための後処理を加えたものです。

- **スタイルはサポートされていません**
  - `animated`や`font`のように、ASCIIでは意味をなさないため、永久にサポートされないものもあります。
  - ターミナルでレンダリングする際の色のように、将来的に限定的な範囲でサポートされる可能性があります。
    - そのため、テーマも意味がありません。
  - `double-border`や`multiple`などはTODOと考えるべきです。
- **不均一なスペーシング**
  - ダウンスケーリングの結果、ボックスのスペーシングが不均一になることがあります（例：幅5の長方形に2文字のラベル）。ASCIIレンダリングの離散的な座標空間のため、一部の出力はSVG版ほど均一に見えない場合があります。
- **レンダリングできない要素**
  - 特殊なテキスト（Markdown, Latex, Codeなど）
  - 画像やアイコン
  - UMLクラス図やSQLテーブル
  - 現時点ではこれらは特別扱いされていません。ダイアグラムから削除するか、プレースホルダーを使用するかの判断は未定です。
- **すべてのシェイプがサポートされているわけではありません**
  - 以下は、すべてのシェイプがASCIIでどのようにレンダリングされるかを示したものです。クラウドや円のように、曲線がASCIIにうまく変換できないものもあります。これらは長方形としてレンダリングし、左上に本来の形を表す小さなアイコンを追加しています。これらは変更される可能性があります。今のところ、カスタムシェイプなしでのレンダリングを推奨します。

```
                                                       ┌────────┐         ***
                   ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱   ╱‾‾‾‾‾‾‾‾‾╱╲    │callout │     ****   ****     ╱‾‾‾‾‾‾‾‾‾╲
  ┌──────────┐    ╱               ╱   │         │  │   └────────┘  ***  diamond  *** ╱           ╲
  │rectangle │   ╱ parallelogram ╱    │   queue │  │        │ ╱      ****     ****   ╲  hexagon  ╱
  │          │  ╱_______________╱      ╲________ ╲╱         │╱           *****        ╲_________╱
  └──────────┘
        │                 │                  │              │              │                │
        ▼                 ▼                  ▼              ▼              │                ▼
   ┌─────────┐      ┌──────────┐        ┌────┐        ╱‾‾‾‾‾‾‾‾‾‾‾╱        ▼          ┌☁─────────┐
   │         │      │ document │        │    └────┐  ╱           ╱    ┌⬭────────┐     │          │
   │ square  │      │     .-`-.│        │ package │ │ stored_data     │  oval   │     │  cloud   │
   │         │       `-.-\`              └─────────┘  ╲           ╲    │         │     │          │
   │         │                                        ╲___________╲   └─────────┘     │          │
   └─────────┘            │                  │              │              │          └──────────┘
        │                 │                  │              │              │
        ▼                 ▼                  ▼              ▼              │
    ┌─────┐          .-‾‾‾‾-.          ╲‾‾‾‾‾‾‾ ╲         ╱‾‾╲             ▼
    │     ╲┐        │╲-____-╱│          ╲        ╲        ╲__╱        ┌⬭────────┐
    │ page │        │        │           ╲        ╲      ╱‾‾‾‾╲       │         │
    │      │        │        │           ╱ step   ╱      ‾‾‾‾‾‾       │ circle  │
    └──────┘        │cylinder│          ╱        ╱       person       │         │
                    │        │         ╱_______ ╱                     │         │
                     ╲-____-╱                                         └─────────┘
```

## 試してみる

この機能はD2 Playgroundでライブになっています。以下のコードブロックを開いて試してみてください（右上のアイコンをクリック）。

```markdown
1LangUnits: {
2  RegexVal: {
3    ds
4  }
5  SQLSelect: {
6    ds
7  }
8  PythonTr: {
9    ds
10  }
11  langunit: {
12    "... ds"
13  }
14}
15
16LangUnits <- ExperimentHost.Dataset: "load dataset"
17Dataset UI -> LangUnits: "manage datasets"
18
19Dataset UI
20
21ExperimentHost: {
22  Experiment
23  Dataset
24}
25ExperimentHost.Experiment -> Experiment
26
27Experiment.ModelConfigurations
28Experiment.LangUnit
29
30Experiment.ModelConfigurations -> ModelConfiguration
31
32ModelConfiguration.Prompting
33ModelConfiguration.Model
34ModelConfiguration.LangUnit
```
