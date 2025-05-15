---
title: "生成AI時代のフルスタック開発"
source: "https://speakerdeck.com/kenn/sheng-cheng-aishi-dai-nohurusutatukukai-fa"
author:
  - "Kenn Ejima"
published: "2025-05-14"
created: "2025-05-14" # ファイルの作成日を維持
description: |
  生成AI時代におけるフルスタック開発のあり方や、変化する技術スタック、AIツールの活用法について解説するプレゼンテーション。
tags:
  - "生成AI"
  - "フルスタック開発"
  - "技術スタック"
  - "ソフトウェア開発"
  - "AI活用"
---

## 要約

本プレゼンテーションは、生成AIがフルスタック開発に与える影響、変化する技術スタック、そしてAIツールの効果的な活用法についてKenn Ejima氏が解説するものです。開発の効率化が進む一方で、本質的な課題解決能力の重要性が増しており、より軽量で柔軟な技術スタック（Ultra Light Stack）への移行や、AIを組み込んだアプリケーション開発のポイントが議論されています。

### 1. はじめに (スライド 1-2)

* **タイトル:** 生成AI時代のフルスタック開発
* **発表者:** Kenn Ejima (Full Stack Entrepreneur)
* **テーマ:** 生成AIがフルスタック開発に与える影響と、これからの開発スタイルについて。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_0.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_1.jpg)

### 2. 生成AIによる開発の変化 (スライド 3-11)

* エンジニアの役割は、単なるコーディングからより高度な問題解決へとシフトします。
* AIによるコーディング効率化は進むものの、事業やプロダクトの本質を理解していなければ、価値ある成果を生み出すことは困難です。
* ソフトウェア開発の敷居が下がることで競争が激化し、少数精鋭での開発が求められる可能性があります。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_2.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_3.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_4.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_5.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_6.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_7.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_8.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_9.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_10.jpg)

### 3. フルスタックの進化 (スライド 12-18)

* 個人が広範囲の技術を扱う「フルスタック化」と、使用する技術スタックを絞り込む「簡略化」が同時に進行します。
* 従来の複雑な開発環境構築（Docker、Homebrewなど多数のツール管理）から、よりシンプルで軽量な構成への移行が提案されます。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_11.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_12.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_13.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_14.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_15.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_16.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_17.jpg)

### 4. Ultra Light Stack (スライド 19-22)

* **提案される軽量技術スタック:**
  * 開発環境: VS Code, Volta (Node.jsバージョン管理), SQLite
  * デプロイ環境: PaaS (例: Render), SQLiteファイル
  * **SQLiteの活用:**
    * Dockerなしでローカル開発を簡素化。
    * 開発サーバー起動中のみメモリ上で動作し、終了すれば消える手軽さ。
    * 複数プロセス/サーバー対応のためにはLibSQL/Tursoへのスケールアップを検討。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_18.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_19.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_20.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_21.jpg)

### 5. AIの組み込み方 (スライド 23)

* 大規模言語モデル(LLM)の進化は、あらゆる市場に影響を与え、既存のAI/MLスタックの再構築を促しています。
* 自前でのGPU投資やモデル開発は、研究機関以外では現実的ではありません。
* アプリケーション層でのAI活用（音声認識、画像処理、リアルタイム翻訳など）が主流となり、UI/UXデザインの重要性が一層高まります。
* LLMを「叩く」側になるか、LLMに「叩かれる」側（MCPなどを介して）になるかの選択。SSE, WebSockets, WebRTC, Optimistic JSON Parserなどの技術が重要になります。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_22.jpg)

### 6. 技術選定の思考プロセス (スライド 24-26)

* **JavaScript中心へ:** ブラウザでの動作が必須であるため、JS/TypeScriptが合理的な選択肢となります。
* **I/Oバウンド処理とリアルタイム性:** 外部API連携やLLMの応答待ちなど、現代のアプリケーションはI/Oバウンドな処理が多く、JSランタイムのイベントループ機構が適しています。
* **ステージング環境の役割変化:** 複雑な問題を再現しにくいシンプルなスタックでは、ステージング環境よりもPull Requestごとのプレビュー環境が重要になります。
* **テストの効率化:** UI/UXに関する「雰囲気」のテストは難しいものの、基本的なE2EテストはAIを活用して効率化できる可能性があります（テストファーストならぬ「Vibe Coding」）。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_23.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_24.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_25.jpg)

### 7. 提案する技術スタック詳細 (スライド 27-32)

* **Remix:** React Router v7ベースのフレームワーク。Next.jsよりシンプルで、HTML/JS/CSSの基本に忠実。
* **Drizzle ORM:** TypeScriptと相性の良いORM。SQLiteやLibSQL/Tursoに対応。ActiveRecord風の操作感も自作可能。
* **Tailwind CSS** とそのエコシステム (daisyUI, shadcn/ui, Magic UIなど)。
* **Render:** Git pushによる自動デプロイ。Node.jsサーバーが動作し、長時間のHTTPコネクション(SSE, WebSockets, WebRTC)に対応。プライベートネットワークでDB等とセキュアに接続可能。
* **Turso:** SQLiteをサーバーレスで提供するサービス。ローカルではSQLiteファイルで開発し、本番ではTursoでスケール。
* **Cloudflare R2:** 低コストなオブジェクトストレージ。AWS S3の代替。プリサインドURLによるブラウザからの直接アップロードにも対応。
* **Cloudflare Workers (検討):** V8 Isolateによる高速起動。ただし、2023年時点ではエコシステムが未成熟なため、本格採用は見送り。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_26.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_27.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_28.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_29.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_30.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_31.jpg)

### 8. 結論 (スライド 33-37)

* 生成AI時代の最適な開発スタイルや技術スタックは、まだ誰にも明確には分かっていません。
* 重要なのは、変化に柔軟に対応し、常に新しい技術や方法論を学び続ける姿勢です。

> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_32.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_33.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_34.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_35.jpg)
> [None](https://files.speakerdeck.com/presentations/db9b4d04e1c741a393f3bcb2a16a8091/slide_36.jpg)

---
<!-- 元のファイルにあったトランスクリプトやその他の情報は、必要に応じてこの下に保持または整理してください。 -->
<!-- 今回の指示では要約が主なので、元のトランスクリプト全体をそのまま残すか、要約と重複する部分を削除するかは判断が必要です。 -->
<!-- ここでは、要約とフロントマターの更新を主とし、元のトランスクリプト部分はコメントアウトしておきます。 -->
<!--
## Other Decks in Programming
// ... existing code ...
-->