---
title: "panicと向き合うGo開発 - nilawayで探る見逃されるnil参照とその対策"
source: "https://speakerdeck.com/shohata/panictoxiang-kihe-ugokai-fa-nilawaydetan-rujian-tao-sarerunilcan-zhao-tosonodui-ce"
author:
  - "Shoki Hata"
published: 2025-09-28
created: 2025-09-30
description: |
  Go Conference 2025でのセッション資料。Goで頻出するnil参照によるpanicの仕組みとリスクを整理し、標準ツールの限界を踏まえてUber製静的解析ツールnilawayがnilフローをどのように追跡・検出するのかを解説する。偽陽性事例や運用時の工夫、参考文献も紹介。
tags:
  - go
  - nilaway
  - static-analysis
  - panic
  - go-conference
---

## セッション概要

- Go Conference 2025での登壇資料で、KanmuのソフトウェアエンジニアShoki Hata氏が作成。
- テーマはpanicの原因となるnil参照と、その検出に特化したUber製静的解析ツール`nilaway`の活用。
- 資料全体はpanic発生箇所の理解、既存解析手法の限界、nilawayの仕組みと活用法、導入時の注意点までを段階的に解説。
- 参考文献としてnilaway関連ブログ、Kyoto Goでの事例紹介、CVE-2020-29652、エイリアス問題の決定不能性論文を提示。

![タイトルスライド](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_0.jpg)

## 1. panicとnil参照の概要

- nil参照がGoランタイムのpanicを引き起こす典型条件を紹介し、ポインタ経由でnilにアクセスすると実行時にクラッシュすることを強調。
- panic発生時の挙動として、通常処理停止、遅延関数の実行、ログ出力後のクラッシュという流れを説明。
- panicを許容すると不正ポインタアクセスにつながり得るためセキュリティリスクがある点にも言及。
- panicが引き起こすビジネスリスクとしてサービス停止（DoS）事例を挙げ、CVE-2020-29652参照で深刻さを示す。
- nil参照はコンパイル時検出が困難であり、静的解析による予防の必要性が導入動機として述べられている。

![panic発生時の影響整理](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_13.jpg)

## 2. 従来の静的解析とその限界

- Go公式ツールチェインの`nilness`など既存静的解析ツールは関数スコープ内の典型的なnil参照を検出できるが、複雑な制御フローには弱いと説明。
- nil参照検出には代入から利用まで変数フローを追跡する必要があり、単純ルールでは不十分と指摘。
- G. Ramalingam (1994)の論文を引用し、エイリアス解析の決定不能性によりnil参照を完全に検出することは理論的に不可能と整理。
- 関数・パッケージを跨いでnilが伝播するケースや、`err != nil`前提が実装不備で崩れるケースなどが`nilness`の取りこぼしとして紹介される。

![nil参照検出の難しさ](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_18.jpg)

## 3. nilawayの概要と検出アプローチ

- `nilaway`はUberが開発中のスタンドアロン静的解析ツールで、条件分岐や関数・パッケージ境界を越えてnilの可能性を追跡できる点を強みとして紹介。
- プログラム中のnilの発生源（nillable制約）と禁止箇所（non-nil制約）をモデル化し、矛盾を2-SAT問題として解くことでより広範なnil参照を検出する仕組みを解説。
- nil値がどこから来てどこへ行くのかを可視化し、制約伝播を行う図解が提示されている。
- 開発中ツールであるため誤検知や非互換変更の可能性がある点も明示。

![nilawayの制約モデル](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_35.jpg)

## 4. 誤検知事例と具体例分析

- `net/http.Client.Do()`がステータスコード300台で`error`がnilのまま`resp.Body`がnilになる仕様をケーススタディとして取り上げ、nilawayが警告する挙動を説明。
- この事例を通じて、期待されるエラーハンドリングの前提が破れるとnilawayの検出が正当化される一方、仕様的に許容されるnilが警告される可能性（偽陽性）を示す。
- 誤検知が起きる背景として、ツール側が安全側に倒すことでnilチェックを促す意図があることを指摘。

![net/http Client.Doのケース](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_40.jpg)

## 5. nilaway導入・運用の指針

- 誤検知への対処として、コード側のリファクタリングによる明示的なnilチェックを推奨。
- 解析範囲を`-include-pkgs`フラグで絞り込む方法や、必要に応じて`nolint`ディレクティブを用いる選択肢を提示。
- ただし`nolint`による抑止は安易に行わず、外部パッケージの不備が原因ならPRを送るなどエコシステム改善に貢献する姿勢を提案。
- Uber Engineering Blogの「NilAway: Practical Nil Panic Detection for Go」など、さらなる知見を得るための資料を参照先として示す。

![運用時の工夫](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_41.jpg)

## 6. まとめと今後

- nil参照の静的解析は代入から利用まで追跡する特殊な課題であると総括。
- 関数・パッケージを跨ぐパターンのnil参照が実行時まで見逃されるリスクを再確認し、nilawayが大半のnil参照を防ぐ実践的な手段であると結論づける。
- それでも偽陽性は存在し、アノテーションやリファクタリングで付き合う姿勢が必要と強調。
- 今後もnilawayの成熟やコミュニティでの継続的な検証が重要であると示唆。

![まとめスライド](https://files.speakerdeck.com/presentations/db717a78ce144557a5d0e22613f3b300/slide_43.jpg)

## 参考資料リンク

- 「Goのnil panicを防ぐ静的解析ツール：nilaway」 - Zenn @sho-hata
- 「NilAway: Practical Nil Panic Detection for Go」 - Uber Engineering Blog
- 「NilAway による静的解析で『10 億ドル』を節約する #kyotogo / Kyoto Go 56th」 - @y_taka_23
- CVE-2020-29652
- G. Ramalingam. 1994. The undecidability of aliasing. ACM Trans. Program. Lang. Syst. 16(5):1467–1471. <https://doi.org/10.1145/186025.186041>
