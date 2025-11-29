---
title: "Gemini 3 Proはデザインに強いのか？"
source: "https://blog.lai.so/gemini-3-pro-ui/"
author:
  - "laiso"
published: 2025-11-28
created: 2025-11-30
description: "Gemini 3 ProとClaude Opus 4.5のUI再現能力をpixelmatchで比較検証。Claude Opus 4.5が最も高精度かつ安定しており、Gemini 3 Proは悪くないものの「当たり外れ」があるという結果に。「Gemini 3 ProがUIに最強」という評判は検証では実証できなかった。"
tags:
  - "AI"
  - "UIデザイン"
  - "LLM"
  - "Gemini"
  - "Claude"
  - "ベンチマーク"
  - "Next.js"
  - "Tailwind CSS"
---

## 結論

**UI再現タスクでは Claude Opus 4.5 が最も高精度かつ安定**していた。Gemini 3 Pro は悪くないものの「当たり外れ」があり、次点。「Gemini 3 ProがUIデザインで最強」という評判は、少なくとも今回の検証では実証できなかった。

---

## 背景：なぜ「Gemini 3 ProはUIに強い」と言われているのか？

### 1. Nano Banana効果

- Geminiがマルチモーダルに注力していることから来る「画像認識が得意なら、コード生成も得意だろう」という連想
- Nano Banana（Gemini 2.5 Flash Image）のマーケティングがGeminiの「画像に強い」イメージを強く印象づけた

### 2. 公表されているベンチマーク結果

| モデル | ScreenSpot-Proスコア |
|--------|---------------------|
| Gemini 3 Pro | **72.7%** |
| Claude Sonnet 4.5 | 36.2% |
| GPT-5.1 | 3.5% |

- Figma MakeやReplitといった主要ツールがGeminiを採用

---

## 検証方法

### タスク設計

「DribbbleのUIデザイン画像1枚を基準として、各モデルにNext.js + Tailwind CSSベースのコンポーネントとして再現させ、pixelmatchで差分を測定」

### 基準画像

![Nexocube - AI Intelligence Platform](https://blog.lai.so/content/images/2025/11/image-7.png)

- Dribbbleのトップページから選定
- 情報量が多い（色数、要素の密度、階層構造、カードレイアウト、余白のバリエーション）
- モデルの苦手領域が露出しやすい構造

### 比較対象モデル

| カテゴリ | モデル |
|---------|--------|
| **Pro枠** | Gemini 3 Pro, Claude Opus 4.5, GPT-5.1 Codex |
| **Fast枠** | Claude Haiku 4.5, GPT-5.1 Codex Mini, Gemini 2.5 Flash |

### プロンプト（全モデル共通）

```
添付したUI画像を Next.js + Tailwind CSS で忠実に再現してください。
レイアウト、余白、色、比率を可能な限り維持してください。
Next.js プロジェクトは pages/ ディレクトリ構成です。
生成するコードはすべて pages/index.tsx の中に収めてください。
外部ファイル（CSS, component, public assets）は使用しないでください。
```

### スクリーンショット取得

- **Playwright**で viewport 1440px、deviceScaleFactor 1 の条件で取得
- `waitUntil: 'networkidle'` で全リソースの読み込み完了を待機
- lossless PNG形式

### 評価方法

- 各モデルに**同じ画像を10回生成**させ、平均・最小・最大を評価
- [pixelmatch](https://github.com/mapbox/pixelmatch)（Mapbox社）でピクセル単位比較
- スコアは0〜1で、**小さいほど一致度が高い**

![Diff表示例](https://blog.lai.so/content/images/2025/11/gemini-3-pro-preview-diff.png)

---

## 結果

| 順位 | モデル | 平均スコア | 最小 | 最大 | ブレ幅 |
|------|--------|-----------|------|------|--------|
| 1 | **Claude Opus 4.5** | **0.0896** | 0.0841 | 0.0959 | 0.012 |
| 2 | Gemini 3 Pro | 0.1083 | 0.0950 | 0.1372 | 0.042 |
| 3 | GPT-5.1 Codex | 0.1207 | 0.0902 | 0.1921 | 0.102 |
| 4 | Gemini 2.5 Flash | 0.1228 | 0.1011 | 0.2033 | 0.102 |
| 5 | GPT-5.1 Codex Mini | 0.1234 | 0.0955 | 0.1409 | 0.045 |
| 6 | Claude Haiku 4.5 | 0.1261 | 0.1096 | 0.1449 | 0.035 |

> ※スコアは0に近いほど基準画像に近い

### 表の見方

- **最小値**: モデルが出せる"真の限界性能"（運が良ければここまで出せる上限）
- **最大値**: モデルの"再現の不安定さ"（最悪このレベルが来る可能性）
- **ブレ幅（最大−最小）**: 信頼性指標（小さいほど「毎回同じ品質で返してくれる」）

---

## 考察

### Claude Opus 4.5

![Claude Opus 4.5の出力例](https://blog.lai.so/content/images/2025/11/image-8.png)

- 平均スコア0.0896、ブレ幅わずか0.012（±1%未満）
- **「毎回ほぼ同じものを出す」点で他を圧倒**
- 10回生成しても安定して同じクオリティが出る

### Gemini 3 Pro

![Gemini 3 Proの出力例](https://blog.lai.so/content/images/2025/11/image-10.png)

- 平均0.1083で2位だが、最大0.1372まで振れる
- **「当たり外れがある」**：良いときはOpusに迫るが、悪いときは明らかに劣る
- Nano Bananaが得意とするフォトジェニックな描写と、厳密なレイアウト調整能力との間に相関性は薄い可能性

### GPT-5.1 Codex

![GPT-5.1 Codexの出力例](https://blog.lai.so/content/images/2025/11/image-9.png)

- 「慎重で防御的なコード」を出すことで知られる
- エラーハンドリングは丁寧だが、**レイアウトの整合性で崩れやすい**
- 最大0.2を超えることもあり、ばらつきが大きすぎて信頼しづらい

### Fast系モデル

![Claude Haikuの出力例](https://blog.lai.so/content/images/2025/11/image-11.png)

- 軒並み0.12前後で団子状態
- **ピクセル単位の再現精度を求めるタスクには向いていない**
- Gemini 2.5 Flashは軽量モデルとしては健闘（0.1228）

---

## 検証の限界

今回測ったのは：

- **「1回の推論によるNext.js + TailwindでのUIコピー精度と安定性」だけ**

評価していないもの：

- 創造性
- 対話的な改善能力
- 他フレームワークでの性能

> 「Opus 4.5がUI全般で最強」ではなく、「このタスクで最も安定して高精度だった」が正確な表現

---

## 応用ユースケース

- 自動リデザイン
- Figmaカンプからのコード生成
- ビジュアルリグレッションテスト

### 実務での活用ポイント

- 「安定しているモデルは1回で信頼できる」
- 「発散しがちなモデルは複数回試して良い方を取る」

---

## 技術スタック

| ツール | 用途 |
|--------|------|
| Next.js 16 + Tailwind CSS 4 | 生成コードの実行環境 |
| Vercel AI SDK | 複数モデルへの統一的なAPI呼び出し |
| Playwright | スクリーンショット取得 |
| pixelmatch | 画像比較・差分算出 |

### パイプライン構成

```
/
├── generate-code.ts        # 各モデルにUI画像を送信しコード生成
├── capture-screenshots.ts  # 生成ページのスクリーンショット取得
├── compare-images.ts       # pixelmatchで差分スコア算出
├── run-batch-experiment.ts # 上記を10回繰り返すバッチ処理
└── aggregate-scores.js     # 全イテレーションのスコアを集計
```

ソースコード：[GitHub Gist](https://gist.github.com/laiso/33984289411189ca3e94e083e51999f8)

---

## 生成結果デモ

各モデルが生成したUIを実際にブラウザで確認可能：

<https://lp-compe.vercel.app/>

![6つのモデルで10-20イテレーション生成して一覧化](https://blog.lai.so/content/images/2025/11/image-12.png)

---

## 関連リソース

- [Design Arena](https://www.designarena.ai/) - UIデザイン評価プラットフォーム
- [ScreenSpot-Pro](https://arxiv.org/abs/2504.07981) - UI理解テストベンチマーク
- [DesignBench](https://arxiv.org/html/2506.06251v1) - CLIPモデルを用いた意味的類似度測定を含む高度なUI評価研究
