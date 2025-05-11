# Vibe Coding: The Future of Programming (2025-04-17 Early Release) 読んだ

ref: <https://ohbarye.hatenablog.jp/entry/2025/05/06/vibe-coding-book-early-release>

---

## 『Vibe Coding: The Future of Programming』 (Early Release版) の読書メモ

O'Reillyから出版予定の『Vibe Coding: The Future of Programming』のEarly Release版（2章）を読んだ感想。

**書籍リンク:**

* [Vibe Coding: The Future of Programming (O'Reilly)](https://www.oreilly.com/library/view/vibe-coding-the/9798341634749/)

**主な内容:**

* 書籍のタイトルは「Vibe Coding」だが、実際には「AI-assisted Coding」やAIを活用するエンジニアに必要なスキルに焦点が当てられている。
* 著者はGoogle ChromeのシニアエンジニアリングリーダーであるAddy Osmani氏。

### 70% Problem

* 現代のAIツールは基本的なコードの約70%（定型的なコード、浅いドメイン知識、簡単なバグ修正）を生成できるが、残りの30%（エッジケース、アーキテクチャ改善、保守性、深いドメイン知識）は依然として人間の介入が必要であるという問題。
* AIはプログラミングは得意だが、エンジニアリング（計画、コラボレーション、テスト、デプロイ、メンテナンスを含むワークフロー全体）は苦手である。
* AIは「偶発的な複雑さ」の処理には優れているが、「本質的な複雑さ」にはまだ対処できない。
* この問題の指摘は [addyo.substack.com の記事](https://addyo.substack.com/p/the-70-problem-hard-truths-about) でも言及されている。

### AI-assisted Coding の 3 類型

AIツールを使ったソフトウェア開発のスタイルを3つに分類。

1. **First Drafter:** AIが初期コードを生成し、開発者が改良・リファクタリング・テストを行う。
2. **Pair Programmer:** 開発者とAIが常に対話し、緊密なフィードバックループで協働する。
3. **Validator:** 開発者が最初のコードを書き、AIを使って検証・テスト・改善を行う。

筆者は主にFirst DrafterとしてAIを活用しているとのこと。

### AI-assisted Coding Golden Rules

AI支援コーディングにおける重要なルール（12個程度）。特に印象的なもの：

* **常に検証する:** AI生成コードを意図と照らし合わせて検証・テストする。
* **思考の拡張として活用する:** AIは思考を置き換えるのではなく、能力を拡張するツール。
* **すべてのコードをレビュー:** 人間が書いたコードもAIが書いたコードも同じ基準でレビューする。
* **理解できないコードの排除:** 機能と影響を完全に理解していないコードはマージしない。
* **効果的なプロンプトの共有:** 高品質な出力につながるプロンプトを文書化・共有する。

### レベル別アドバイス、成長戦略

シニア・ミドル・ジュニアエンジニアそれぞれに向けた実践的なアドバイス。特に興味深い点：

1. **AIデトックス:** 定期的にAIの支援なしでコーディングスキルを磨く。コアスキルを省略するとメタスキルが磨かれないため。
2. **ジュニア開発者のテスト記述:** AI時代において、ジュニア開発者がテストを書くことは、審美眼を養い、AIではできない付加価値を生み出す上で非常に重要。

### 総じて

* Early Release版の2章では、Vibe Codingそのものよりも、AI支援コーディングが主流となる世界でエンジニアに求められるスキルやその育成方法が中心テーマ。
* 技術革新が速いため、正式版リリース時には状況が変わっている可能性もあるが、普遍的なエンジニアリングスキルに焦点を当てているため、長く読まれる可能性のある書籍。

**関連情報・言及:**

* Simon Willison氏によるVibe Codingへの苦言: [Not "Vibe Coding"](https://simonwillison.net/2025/May/1/not-vibe-coding/)
* Andrej Karpathy氏によるVibe Codingの元々の提唱: [Karpathy氏のX投稿](https://x.com/karpathy/status/1886192184808149383)
* 関連論文: [Out of the Tar Pit](https://curtclifton.net/papers/MoseleyMarks06a.pdf)

---
