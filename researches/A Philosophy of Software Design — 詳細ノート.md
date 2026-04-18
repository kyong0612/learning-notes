# A Philosophy of Software Design — 詳細ノート

**著者:** John Ousterhout（スタンフォード大学 計算機科学教授）
**版:** 2nd Edition（2021年7月発行） / 全22章
**本書の主題:** 「ソフトウェアシステムを設計する際、いかにして複雑性（complexity）を最小化するか」という一点に徹底的に焦点を当てた設計論。

> 注: 本ノートは Ousterhout のスタンフォード公式ページ、`aposd-vs-clean-code` リポジトリ、および複数のレビュー/サマリー記事から情報を突き合わせて作成したもので、一次情報の要約・引用を含む。章番号は 2nd Edition のものを使用している。

---

## 0. 本書の全体像

### 0.1 本書が扱う「たった一つのこと」

Ousterhout は本書の冒頭で複雑性をこう定義する:

> "Complexity is anything related to the structure of a software system that makes it hard to understand and modify the system."
> （複雑性とは、ソフトウェアシステムの構造に関わるもので、システムを理解し、変更することを困難にするすべてのもの。）

そして複雑性の原因を次の2つに還元する:

- **Dependencies（依存）**: ある箇所のコードを単独では理解・変更できず、別の箇所を同時に見なければならない状態。
- **Obscurities（不明瞭さ）**: 重要な情報が自明でなく、コードから読み取れない状態。

本書のほぼすべての章は、この2つを減らすための設計判断を論じたものと言える。

### 0.2 2nd Edition の新規/変更点（公式ページより）

- 新章 **Chapter 21: "Decide What Matters"** を追加（「何が重要かを決め、重要なものを中心に据え、重要でないものを見えにくくする」という上位原則）。
- **Chapter 6: General-Purpose Modules are Deeper** を大幅に再構成・増補（汎用性の重要性が書いた後さらに明確になったため）。
- 複数の章に **Clean Code（Robert C. Martin）との比較サブセクション** を追加。特にメソッドの長さとコメントの役割について意見が異なる。

### 0.3 本書の全章構成

| # | 章タイトル | 中核メッセージ |
|---|---|---|
| 1 | Introduction | 複雑性との戦いは漸進的で不可避。設計力は学べる。 |
| 2 | The Nature of Complexity | 複雑性の症状（change amplification / cognitive load / unknown unknowns）と原因（dependency / obscurity） |
| 3 | Working Code Isn't Enough | Tactical vs. Strategic programming。動けば良いでは資産が腐る |
| 4 | Modules Should Be Deep | 深いモジュール = シンプルな IF + 豊かな実装 |
| 5 | Information Hiding (and Leakage) | 設計判断を局所化する / temporal decomposition の罠 |
| 6 | General-Purpose Modules are Deeper | somewhat general-purpose を狙え |
| 7 | Different Layer, Different Abstraction | 各層で抽象を変える / pass-through methods の弊害 |
| 8 | Pull Complexity Downwards | 複雑性は呼び出し側ではなく実装側に吸収させる |
| 9 | Better Together Or Better Apart? | 分割と統合の判断基準 |
| 10 | Define Errors Out Of Existence | そもそも例外にしない API 設計 |
| 11 | Design It Twice | 最低2案を比較せよ |
| 12 | Why Write Comments? The Four Excuses | コメントを書かない言い訳を一つずつ論破 |
| 13 | Comments Should Describe Things That Aren't Obvious | コードを繰り返さず、抽象/意図を書く |
| 14 | Choosing Names | precise, unambiguous, intuitive |
| 15 | Write The Comments First | コメントを設計ツールとして使う |
| 16 | Modifying Existing Code | 変更時に必ず少しは設計を良くする |
| 17 | Consistency | 一貫性は強力な認知レバレッジ |
| 18 | Code Should Be Obvious | 読み手が "obvious" と言うか、がすべて |
| 19 | Software Trends | OOP/継承、Agile、TDD、Design Patterns、Getters/Setters への辛口評価 |
| 20 | Designing for Performance | 計測・クリティカルパス設計・特殊ケース排除 |
| 21 | Decide What Matters（新章） | 重要なものを中心に、重要でないものを見えにくく |
| 22 | Conclusion | 良き設計者は設計フェーズ＝楽しい時間を多く過ごせる |

巻末には **"Summary of Design Principles"** と **"Summary of Red Flags"** がまとめて収録されている。

---

## Chapter 1: Introduction

- ソフトウェア開発における最大のイネーブラは **複雑性の制御**。機能追加が容易で変更コストが低い設計を、プロジェクトのライフタイムを通じて維持することが目標。
- 設計は単発の工程ではなく **incremental**。毎回の変更機会こそが設計力を行使する機会。
- 本書の主張は「設計原則＋レッドフラグ＋具体例」でできており、厳密な定量論ではなく **判断のためのガイドライン集**。
- Ousterhout は「設計力は才能ではなくスキルであり学べる」という立場を取る。

**実務適用のヒント:** コードレビューの評価軸に「後で変更しやすいか？」「読んで自明か？」を明示的に加えると、本書の他の章が効き始める。

---

## Chapter 2: The Nature of Complexity

### 複雑性の「症状」3つ

1. **Change amplification**（変更の増幅）
   - "a seemingly simple change requires code modifications in many different places"
   - 例: 色の定数が複数ファイルに散らばる / DB 接続を注入する仕組みが無いため、テスト容易化のためにシステム全体を書き直すケース。
2. **Cognitive load**（認知負荷）
   - タスクを完了するために開発者が知っておく必要がある情報量。
   - 例: ファイルを開いた関数と閉じる責務が呼び出し側に漏れている（責務が呼び出し側に漏れているほど認知負荷が上がる）。
3. **Unknown unknowns**
   - どのコードを変える必要があるか、どの情報を知っている必要があるかが **そもそも分からない** 状態。最も危険な症状。

### 複雑性の「原因」2つ

- **Dependencies**
  - "A dependency exists when a given piece of code cannot be understood and modified in isolation."
  - 依存は不可避だが、**数を減らし、残ったものは明示的かつ単純に** する。
- **Obscurity**
  - 重要情報が自明でない状態。命名、ドキュメント不足、非自明な不変条件などが温床。

### 重要な洞察

- 複雑性は **大事件では増えず、何百もの小さな判断** で少しずつ溜まる（incremental）。
- ゆえに **zero tolerance philosophy**（ほんの少しでも複雑性を増やす変更を許さない）が必要、という結論につながる。

---

## Chapter 3: Working Code Isn't Enough

### Tactical vs. Strategic Programming

- **Tactical programming**: 今動かすのが最優先。変更のしやすさを犠牲にする。
- **Strategic programming**: 動くコードは出発点であり、**long-term の構造** が最優先。
- "Working code isn't enough." — 動くだけでは設計債務を払っていない。

### Tactical Tornado（戦術の竜巻）

Ousterhout の造語。生産性が極端に高く見えるが、あとに残すのは **保守不可能な地雷原** であるタイプの開発者。短期の KPI には強いが、チーム全体の生産性を長期で奪う。

### Strategic の実践方法

- クラスを作るとき、**最初の案に飛びつかず、複数案を比較する**（11章と接続）。
- 既存コードの改善に **毎週10%〜20%** 程度の時間を投じる、というラフな指標。
- 「今は急いでるから後で」が最大の敵。**投資は "today" であって "tomorrow" ではない**。「この山を越えたらまた次の山が来る」。

### 実務適用

- PR テンプレートに「この変更で設計を少しでも改善したか？」という欄を足すだけでも文化が変わる。
- スプリント計画で「リファクタリングは明確に "機能開発" と等価の工数枠で確保する」。

---

## Chapter 4: Modules Should Be Deep

### 中核概念: **Deep Module**

> "A deep module is one in which the interface is small and the implementation is large."
>
> "Deep modules such as Unix I/O and garbage collectors provide powerful abstractions because they are easy to use, yet they hide significant implementation complexity."

- **Shallow module**: インタフェースが大きく実装が薄い。ラッパーしているだけ、呼び出し側が内部事情を知らねばならない、など。存在価値が薄く、複雑性を減らすどころか増やしてしまう。

### モジュール＝インタフェース＋実装

- "If a developer needs to know a particular piece of information in order to use a module, then that information is part of the module's interface."
- → つまり **インタフェース = 書かれた API + 書かれていない前提** の両方。

### 良い抽象

- 抽象は「単純化された現実のビュー」。どれを重要情報として残し、どれを隠すかの選択が抽象の本体。
- "The key to designing abstractions is to understand what is important, and to look for designs that minimize the amount of information that is important."

### Classitis（クラス病）

- 「Clean Code 流の "メソッドとクラスをとにかく細かく" を過剰適用すると、大量の **浅いクラス** が生まれ、全体の複雑性が増す」という現象。
- Ousterhout が特に名指しで批判している箇所で、Clean Code 対比の文脈でも引用される（後述）。

### 典型的 Deep Module 例

- Unix の `read` / `write`（5つの引数の裏で、デバイスドライバ、バッファキャッシュ、ファイルシステムが隠蔽されている）。
- GC（ユーザーは「malloc と参照を扱う」だけ、回収戦略は完全に隠蔽）。

### 実務適用

- **IF/実装の比** を意識する。「この public メソッドの列、実装より長くないか？」を自問。
- DTO がどんどん get/set を生やし始めたら classitis の黄色信号。

### Red Flags（4章由来）

- **Shallow Module**: 実装に比してインタフェースが厚い。
- **Information Leakage**: 隠すべき知識がインタフェースに漏れている（5章で詳述）。

---

## Chapter 5: Information Hiding (and Leakage)

### 定義

- **Information hiding**: 各モジュールが少数の設計決定を **自分の実装の中だけに** 閉じ込めること。
- **Information leakage**: 同じ設計決定を複数のモジュールが知ってしまっている（= 変更時に両方を同時に直さざるを得ない）状態。

### 情報隠蔽の2つのメリット

1. インタフェースが単純になる（利用者が覚えるべきことが減る）。
2. 変更容易性が上がる（隠された情報に変更が生じても、そのモジュールの中だけで完結する）。

### Temporal Decomposition の罠

- 「実行順序」に沿ってコードを分割するとやりがち。
  - 例: `ReadFile → ModifyContents → WriteFile` のように手順でクラス/関数を分けると、**ファイル形式の知識** が3か所に漏れる。
- Ousterhout: "When designing modules, focus on the knowledge that's needed to perform each task, not the order in which tasks occur."

### Information Leakage の実例として挙げられるもの

- 2 つのクラスが同じ magic number / 同じ file format / 同じ protocol を知っている。
- 一方が他方の内部データ構造を直接さわる。
- Configuration parameter を利用者に押し付けている（「良い値」をユーザーが決められないのに選ばせるのは leakage）。

### Red Flag: "Temporal Decomposition"

- 一見きれいだが、変更時に広範囲に影響が波及しがち。

### 実務適用

- 2つ以上のモジュールに同じ知識が現れたら、**それを1つに寄せる** か、**1つのモジュールに畳み込む** かを検討する。
- 設定値は「自動で決められないか？」を最初に問う。

---

## Chapter 6: General-Purpose Modules are Deeper（2nd Edition で大幅加筆）

### 「somewhat general-purpose」が最適

- 完全に汎用にしようとすると YAGNI に陥るが、目の前のユースケースだけを満たす特化 API を作ると、次のユースケースで破綻する。
- 合言葉: **"Somewhat general-purpose"** — 「今の1ユースケースを満たすが、他のユースケースも無理なく呼べる形」。

### 決め方のセルフ質問（Ousterhout の有名な問い）

1. What is the simplest interface that will cover all my current needs?
2. In how many situations will this method be used?
3. Is this API easy to use for my current needs?

### 事例: GUI のテキストエディタ

- Backspace キーの実装で「直前の1文字を消す」専用 API を作ると、カット機能を作るときに別 API が要る。
- 代わりに `delete(range)` を1つ持っておけば、Backspace もカットも同じ基本 API で組み立てられる。**インタフェースは狭く、汎用的に**。

### 汎用モジュール ≒ 深いモジュール

- 内側の複雑性を吸収し、外側は小さく整う。

### 実務適用

- 「ユーザーストーリーと 1:1 に API を生やしていないか？」をコードレビューで問う。
- ただし純粋な「いつ使うか分からない万能関数」は依然アンチパターン。汎用性は **実ユースケースに裏打ちされた** ときだけ価値がある。

---

## Chapter 7: Different Layer, Different Abstraction

### 各層は異なる抽象を提供せよ

- 隣接するレイヤーが同じ抽象を繰り返しているなら、そのレイヤーは存在価値が薄い。
- **File system** の例: Unix で言えば、 `syscall ↔ VFS ↔ specific FS ↔ block device` のように、各層が違う語彙（inode, block, file handle …）を提供している。

### Pass-Through Methods（レッドフラグ）

> "A pass-through method is one that does nothing except pass its arguments to another method, usually with the same API as the pass-through method."

- 責務分割が曖昧な兆候。ラッパーは **抽象を変えている** ときだけ価値がある。
- **Pass-Through Variables** も同様に悪。呼び出しチェインを貫通する「引数のバケツリレー」は依存を隠れた形で増やす。

### Decorator パターンの注意

- デコレータは薄く書きやすいが、**意味ある抽象の変化を与えていない** なら、単なる shallow module。多用すると層だけ増えてコードが「ラザニア化」する。

### 代替案

- Pass-through が必要になったら:
  - 呼び出し元が直接呼べるように経路を短くする。
  - 共有オブジェクトを context として明示的に持ち回る。
  - そもそも層を統合する。

### Clean Code との対比ポイント

- Clean Code は「小さなメソッドに細分化」を推奨するが、Ousterhout はそれが pass-through 的になりやすい点を問題視する（本章 + 対比サブセクション）。

---

## Chapter 8: Pull Complexity Downwards

### 黄金律

> "It's more important for a module to have a simple interface than a simple implementation."

- つまり、どうしても存在する複雑性は、**呼び出し側** ではなく **モジュールの内部** に吸収させる。
- 全体の読者数でいえば、ライブラリ利用者のほうが実装者より圧倒的に多い。呼び出し側を楽にする方が「読まれるコード」全体が減る。

### Configuration parameter の戒め

> "You should avoid configuration parameters as much as possible. Before exporting a configuration parameter, ask yourself: will users (or higher-level modules) be able to determine a better value than we can determine here?"

- パラメータが必要に見えても、**ライブラリ側で自動判断できないか** を最初に検討する（例: バッファサイズを負荷に応じて自己調整）。

### TCP 再送タイムアウトの例

- アプリケーションに「再送タイムアウトは何秒？」を聞くのは無理筋。TCP は内部で RTT を計測し、動的に推定する（= 複雑性をモジュール内に押し下げた好例）。

### 実務適用

- 「この引数、呼び出し側は本当に決められるか？」を都度問う。
- 決められない値を問い合わせる API は、**不可知を呼び出し側に押し付ける** 設計負債。

---

## Chapter 9: Better Together Or Better Apart?

### 「くっつけるべき」指標

- 情報を共有している（同じ知識を使う）。
- くっつけるとインタフェースが単純化される。
- 重複を排除できる。
- 独立に使うことがほぼ無い。

### 「分けるべき」指標

- 汎用的なコードと専用ロジックが混ざっている（汎用部分だけ再利用したい）。
- 片方だけ単独で意味のあるテストが書ける。
- 完全に独立した責務が同居している。

### Red Flag: **Conjoined Methods**

> "If you make a split of this form and then find yourself flipping back and forth between the parent and child to understand how they work together, that is a red flag ('Conjoined Methods') indicating that the split was probably a bad idea."

### goto の是認

- 本章でやや物議を醸す箇所として、**Ousterhout はネストされたブロックからの早期脱出には `goto` を使ってよい** と明言する（複雑にならない範囲で）。Linux カーネルのクリーンアップ処理で `goto cleanup:` を使う実務と整合する立場。

### Clean Code との対比（重要）

- Clean Code: 「関数は2〜4行」「Extract Till You Drop」。
- Ousterhout: それをやりすぎると **conjoined methods** が量産され、行ったり来たり読まないと挙動が分からなくなる。**適切な凝集は分割より大事**。

### 実務適用

- 「extract してみたが、親と子を交互に見ないと処理が追えない」なら差し戻す判断をする。

---

## Chapter 10: Define Errors Out Of Existence

### 中核主張

> "Exception handling is one of the worst sources of complexity in software systems."

- したがって **例外ハンドラを書くより、そもそも例外が発生し得ない API に設計し直す** 方が良い。

### 4つの戦術

1. **Define errors out of existence**（そもそもエラーにしない）
   - 例: **ファイル削除**: 「存在しないものを削除」は成功扱いでよい（冪等）。
   - 例: **Java `substring`**: 範囲外 index は `IndexOutOfBoundsException` を投げる。Python のスライスのようにクランプしたほうが全体の複雑性は下がる。
2. **Mask exceptions（例外を下層で握る）**
   - 下層で対処して、上層に見せない。例: TCP が再送でパケットロスを隠蔽する。
   - これは「複雑性を押し下げる」（8章）と整合する。
3. **Exception aggregation（例外の集約）**
   - 多くの例外を **1か所** で処理する。Web サーバが個別リクエストハンドラの例外をディスパッチャで一括回収する、など。
4. **Just crash**
   - 回復不能・超まれなエラー（例: OOM）は、頑張らず診断情報を出して落とす。回復コードのバグの方が多い。

### 取りすぎ注意

- すべての例外を隠すべきではない。**ユーザーが本当に判断すべきエラー** は残す。
- 「Define errors out of existence」は **意味論の変更を伴う** ので慎重に。

### Red Flag: **Overexposure**

- 内部エラーが API に漏れ出ている。

### Clean Code との一致点

- Martin も「例外を例外的事態だけに使え」と述べる点では共通。違いは「それ以外の通常フローの書き方」。

---

## Chapter 11: Design It Twice

### 主張

- どのクラス/モジュールについても、**最低2種類の根本的に異なる設計案** を並べて比較する。
- "The initial design experiments will probably result in a significantly better design, which will more than pay for the time spent designing it twice."
- 比較プロセスそのものが、**「良い設計を見抜く目」を育てる**。

### 実務的な運用

- 10分でも良いので、案A と 案B をホワイトボードに書いて長所短所をリストアップしてから着手する。
- 片方が「どう見てもダメ」に見えることはそれ自体が学習の成果。

### 対比

- Clean Code は「書きながら refactor」を重視。
- Ousterhout は「書き始める前に2案を比較」を重視。補完的に見ることができる。

---

## Chapter 12: Why Write Comments? The Four Excuses

### コメントを書かない4つの言い訳を論破

1. **"Good code is self-documenting."**
   - コードは what/how を表せても、**why / intent / invariant** を表せない。
2. **"I don't have time to write comments."**
   - 書かないコストは、後から読む人の時間として **利子つきで** 支払われる。
3. **"Comments get out of date."**
   - 近くに置き、レビューで一緒に更新する。下の章で運用ルールを提示。
4. **"All the comments I've seen are worthless."**
   - それは書き方が悪いだけ。まず自分から良いコメントを書け。

### コメントの目的

- "The overall idea behind comments is to capture information that was in the mind of the designer but couldn't be represented in the code."
- 良いコメントは **コードを読まずに済むための近道** になる。

### Clean Code との最大の論点

- Martin: "Comments are always failures." コードをきれいにすれば要らない。
- Ousterhout: コメントは **失敗ではなく設計のツール**。インタフェースとメンバ変数は常に文書化すべき。
- → これは `aposd-vs-clean-code` 議論での主要争点の一つ。

---

## Chapter 13: Comments Should Describe Things that Aren't Obvious from the Code

### 基本ルール

- **コードを言い換えるだけのコメントは価値ゼロ（むしろ害）**。
- 価値あるコメントは2方向ある:
  - **Lower-level（詳細化）**: 変数の意味、単位、範囲、不変条件など、コードよりも **精密** に述べる。
    - 例: `// invariant: start <= end, both inclusive, UTF-16 code units`
  - **Higher-level（抽象化）**: 「結局このコードは何をしているのか」を1〜2行で抽象化する。
    - "What is the simplest thing you can say that explains everything in the code?"

### コメントのカテゴリ

- **Interface comments**（パブリック API の契約: 入出力、副作用、例外、事前/事後条件）
- **Data structure member comments**（各フィールドの意味と不変条件）
- **Implementation comments**（what/why。how はコードが語る）
- **Cross-module design notes**（1モジュールに閉じない設計判断は `designNotes.md` に書き、コードからリンク）

### Red Flags

- **Vague Name**（あいまいな名前）
- **Hard to Describe**: そもそもコメントに書けない → 抽象が悪い。
- **Non-obvious Code**: コードを読んでも意図が分からない。

### 実務適用

- コードレビューで **「そのコメントはコードの翻訳か、付加価値があるか？」** を問う観点を持つ。

---

## Chapter 14: Choosing Names

### 良い名前の3要件

> "Great names are precise, unambiguous, and intuitive."

- **Precise**: ほかに解釈の余地がない。`getCount()` より `getActiveUserCount()`。
- **Unambiguous**: 同じ概念は同じ語、違う概念は違う語。
- **Intuitive**: 初見でほぼ意味が取れる。

### 良い名前は設計の鏡

- 「うまく名前がつけられない = 抽象が悪い」。
- 名前をつける行為を、**抽象の妥当性検査** として使う。

### 一貫性

- 同じ概念は常に同じ語で（後述の Consistency と接続）。
- 匈牙利記法のような型情報をプレフィクスに入れる時代ではない（IDE が解決）。

### Red Flags

- **Hard to Pick Name**
- **Generic Name**（`data`, `info`, `manager`, `helper`, `util` …）

---

## Chapter 15: Write The Comments First（コメントを先に書く）

### アイデア

- 実装より先に、クラスのインタフェースとメソッドのコメントを書く。
- → 実装が終わる頃には一緒に文書が完成しており、**抽象が先に固まる**ので、実装も破綻しない。

### メリット

- 遅延コメントを溜めない。
- コメントがそのまま設計レビューの材料になる。
- 「長いコメントを書かないと説明できない」ことは抽象が悪い証拠（= 早期に検知できる）。
- "Writing the comments first will mean that the abstractions will be more stable before you start writing code."

### 批判への反論

- 「時間がない」 → 既に説明したように、長期的には節約になる。
- 「コメントが進化に追いつかない」 → 同じ PR で更新する運用にすれば維持可能（16章）。

---

## Chapter 16: Modifying Existing Code

### 基本方針

- **どんな変更も、設計を少しでも良くしてから PR に出す**。
- "If you're not making the design better, you are probably making it worse."

### コメントの維持運用

- コメントはコードの **近く** に置く（遠いほど腐る）。
- 遠くに置くほど、**抽象度を上げて書く**（頻繁な小変更で古くならないように）。
- コミットメッセージに価値ある背景情報を書くだけでは不十分 —— **コードの近くにも書く**。さもないと後日「なぜこうなっているか」を知らない人が機械的にもとに戻してバグを再生する。
- PR の diff に **コメントの変更も含まれているか** をレビューで必ず見る。

### Stay Strategic

- 機能追加を納期優先で終わらせた瞬間、複雑性の借金は積まれていく。**毎回の変更で少しだけ払う** 態度が長期的に効く。

---

## Chapter 17: Consistency

### 主張

- 一貫性 = **認知レバレッジ**。
  - "Consistency creates cognitive leverage: once you have learned how something is done in one place, you can use that knowledge to immediately understand other places that use the same approach."

### 一貫性の対象

- **命名規則**、**コーディングスタイル**、**インタフェースの形**、**繰り返し使われる設計パターン**、**不変条件**。

### 一貫性 vs. ローカル最適

> "The value of consistency over inconsistency is almost always greater than the value of one approach over another."

- 2つの方式が甲乙つけがたいなら、**先例に合わせる** のが基本。ローカルな美学より、全体の一貫性を優先する。

### 維持の方法

- 規約を明示文書にする。
- Linter/Formatter で自動化できるものは自動化する。
- コードレビューで「既存のやり方と違うけど、理由はあるか？」を問う。

---

## Chapter 18: Code Should Be Obvious

### 「明らかさ」は読み手が決める

- "If someone reading your code says it's not obvious, then it's not obvious, no matter how clear it may seem to you."
- → コードレビューが **唯一の客観的テスト**。

### 明らかさを上げる要素

- 良い命名、一貫性、適切な空白、コメント、簡潔な制御フロー。

### 明らかさを下げやすい構造

- **Event-driven**（制御フローが追えない）
- **Generic containers** に異種のデータを詰める
- **宣言と割り当てで型が違う**（Java の `Map<String, Object>` で何でも入れる、等）
- 非局所的な副作用

### 実務適用

- PR レビューで「読んで分かりにくかった」というフィードバックは、**読み手のスキル不足ではなく設計の問題として扱う** のが本章の立場。

---

## Chapter 19: Software Trends

### 19.1 OOP と継承

- クラス階層で実装継承を多用するほど複雑性が高くなる（親子の密結合）。
- **Composition over inheritance** を原則とし、本当に is-a 関係がある場合のみ継承。
- インタフェース継承（= 純粋な契約）はむしろ抽象の本質と親和的。

### 19.2 Agile

- 反復的に作ること自体は良い。ただし **「機能に集中しすぎる」** と戦術的プログラミングに傾く危険がある。抽象をスプリント内に含める訓練が必要。

### 19.3 Test-Driven Development（TDD）

- Ousterhout の批判:
  - "It focuses attention on getting specific features working, rather than finding the best design."
  - TDD は「この1機能を通すための最小コード」を誘発し、全体設計を犠牲にしがち。
- 認める用途: **バグ修正時**。再現する unit test を先に書く。
- なお Ousterhout 自身、後に「TDD の定義を誤解していた」部分を認め、改訂予定と発表している（`aposd-vs-clean-code` 議論）。ただし主張の核（抽象設計を先に決めたい）は維持。

### 19.4 Design Patterns

- "More patterns ≠ better design." パターンは語彙であって、設計そのものではない。
- 本当に必要でないのに GoF パターンを先に当てはめると、**不要な間接化** が増える。

### 19.5 Getters / Setters

- 公開するほど **情報隠蔽が破綻** する。まずフィールドを公開しない方向を試す。Java/C# 文化的に自動生成しがちだが、思考停止の罠。

---

## Chapter 20: Designing for Performance

### 基本姿勢

- まず **awareness**: どの操作が本質的に高コストか（ディスク、ネットワーク、ロック、キャッシュミス、システムコール…）を体で覚える。
- 最適化前後で **必ず計測**。効かない最適化はシンプルでない限りロールバック。

### クリティカルパス設計

- 最も頻繁に通るパスを **最短・最少の分岐** で書く。
- 特殊ケースを減らす工夫をする（ここでも 9章「better together」と接続）。

### 実例

- 本書では **RAMCloud Buffers** を題材に、冗長な再確保を避ける設計を解説。
- 複雑なコードは本質的に遅い: "Complicated code tends to be slow because it does extraneous or redundant work." — つまり **設計の単純化 ≒ 性能改善** であることが多い。

### 実務適用

- プロファイラで上位関数だけに集中し、そこを deep module 化して改良の余地を作る。

---

## Chapter 21: Decide What Matters（2nd Edition 新章）

### 主題

- 良い設計とは、**何が重要で何がそうでないかを決め、重要なものを中心に据え、重要でないものを見えにくくする** こと。

### 4つの下位トピック

- **21.1 How to decide what matters**
- **21.2 Minimize what matters**: 重要なものの数を減らせば、覚える量も減る。
- **21.3 How to emphasize things that matter**:
  - 重要なものを **インタフェース文書・名前・よく呼ばれるメソッドの引数** 等、目に入る場所に置く。
  - 重要な概念は **繰り返し現れる**（語彙として定着させる）。
  - 「システムの心臓部」に置き、周囲がそれを中心に形作られるようにする。
- **21.4 Mistakes**（よくある失敗）
  - 重要なものを **増やしすぎる**（混乱を招き認知負荷を上げる）。
  - 重要なものを **見落とす**（必要な情報が隠れたり、同じ機能を再実装される）。
- **21.5 Thinking more broadly**
  - 設計の原則は文章にも応用できる: 先頭で主要概念を提示し、それを軸に構造化する。
  - Ousterhout 自身の言葉: "Focusing on what is important is also a great life philosophy."

### 実務適用

- ドメインモデルを作るとき、「中心となる語彙3つ」を決めて、全レイヤーの API がその語彙で説明できるかを確かめる。
- README の最初の段落を、「この人は一番大事なものを中心に据えているか？」の基準で見るとリーダビリティが跳ね上がる。

---

## Chapter 22: Conclusion

- 設計がうまくなると、 **設計に費やせる時間が増える** —— これは楽しい時間。
- 設計が下手なままだと、**難解で脆いコードの中のバグ追跡** に時間を溶かす。
- 本書の価値は「複雑性との戦い」を開発者の恒久的な態度として定着させることにある。

---

## 付録A: Summary of Design Principles（主要な設計原則、頻出順）

1. Complexity is incremental: you have to sweat the small stuff.
2. Working code isn't enough.
3. Make continuous small investments to improve system design.
4. Modules should be deep.
5. Interfaces should be designed to make the most common usage as simple as possible.
6. It's more important for a module to have a simple interface than a simple implementation.
7. General-purpose modules are deeper.
8. Separate general-purpose and special-purpose code.
9. Different layers should have different abstractions.
10. Pull complexity downward.
11. Define errors (and special cases) out of existence.
12. Design it twice.
13. Comments should describe things that are not obvious from the code.
14. Software should be designed for ease of reading, not ease of writing.
15. The increments of software development should be abstractions, not features.
16. Separate what matters from what doesn't matter and emphasize the things that matter.
   （※2nd Edition 新章の論点）

---

## 付録B: Summary of Red Flags（代表的なレッドフラグ）

| Red Flag | 意味 |
|---|---|
| Shallow Module | 実装に比してインタフェースが大きい |
| Information Leakage | 同じ設計決定が複数モジュールに現れる |
| Temporal Decomposition | 実行順序でモジュールを切っている |
| Overexposure | 内部実装/例外が不必要に外に露出 |
| Pass-Through Method | 引数をほぼそのまま転送するだけ |
| Pass-Through Variable | 変数を経路上のすべての関数に引き回し |
| Repetition | 同じコード/アイデアが複数箇所に |
| Special-General Mixture | 汎用コードと特殊ケースの混在 |
| Conjoined Methods | 分けた2関数が密結合で行き来必須 |
| Comment Repeats Code | コメントがコードを言い換えているだけ |
| Implementation Documentation Contaminates Interface | 実装の話が IF 文書に混入 |
| Vague Name | 意味がぼやけた名前 |
| Hard to Pick Name | そもそも名付けられない（抽象が悪い） |
| Hard to Describe | コメントに書けない（抽象が悪い） |
| Non-Obvious Code | 読んでも意図が取れない |

> これらを見つけたら **立ち止まって代替設計を探す** のが Ousterhout 流の運用。

---

## 付録C: Clean Code（Robert C. Martin）との対比

### C.1 背景

- 2024年9月〜2025年2月にかけて、Ousterhout と Martin 本人が GitHub（`johnousterhout/aposd-vs-clean-code`）上で、Clean Code のいくつかの章を具体例として議論を交わした。3つの争点が中心。

### C.2 争点① メソッドの長さ

| | Clean Code（Martin） | APoSD（Ousterhout） |
|---|---|---|
| 基本姿勢 | 「関数は小さく、小さくしたらさらに小さく」「Extract Till You Drop」 | インタフェースと実装の **比** が大事 |
| 典型的な推奨 | 2〜4行、単一責務 | 内側は必要十分な長さで良い。過度な分割は shallow module と pass-through を量産する |
| リスク | Over-decomposition, conjoined methods, ラザニアコード | 大き過ぎる関数は依然として悪 |
| 合意点 | 「意味の塊」で切る、再利用・テストしやすく | 同左 |

Ousterhout の代表的な反論要点:
- 小さな関数が **互いに密結合**（conjoined）になり、読み解きに行き来が増えるなら、抽出はむしろ複雑性を増やしている。
- 「**何行か**」ではなく「**読み手が1つの抽象として理解できるか**」で判断すべき。

### C.3 争点② コメント

| | Clean Code | APoSD |
|---|---|---|
| コメント観 | "Comments are always failures." 必要悪 | 設計のツールであり必需品 |
| 推奨 | きれいな命名と構造で不要化、必要なら TODO/法的/API ドキュメントに限定 | IF と member 変数は常に文書化。higher/lower level の両方が必要 |
| 書くタイミング | 最後に最小限 | **最初に書く**（Chapter 15） |

Ousterhout の主張の核:
- 命名と構造で表現できない情報（why、不変条件、失敗ケース、使い方、歴史的背景）が現実には多い。
- コメントが古びるのは書き方と運用の問題で、**コメント自体が悪ではない**。

### C.4 争点③ TDD

| | Clean Code | APoSD |
|---|---|---|
| TDD観 | 強く推奨。red-green-refactor が設計を良くする | 特定機能を通すコードに目線が偏り、抽象の設計が弱くなりやすい |
| 代替/補足 | TDD そのものを設計手法とする | ユニットテストは全面的に推奨。ただし「少し大きめの単位」で書き、先に抽象を考える |

- Ousterhout は本書の初版で TDD の定義を誤解していた部分を公に認め、次版で訂正すると述べた。だが TDD を「機能駆動でコードを伸ばす手法」として使うと設計が最適化されないという中心主張は維持。

### C.5 付随的な相違

- **インヘリタンス/ポリモーフィズム**: Martin は OOP/継承をより積極活用、Ousterhout は composition 中心で使用範囲を制限。
- **抽象化の粒度**: Martin は「Extract Till You Drop」、Ousterhout は「深いモジュールを育てる」。
- **共通点（意外と多い）**: 命名の重要性、共有知識の最小化、二重化の回避、モジュール境界の明確化、ユニットテストの価値。

### C.6 現場での受け止め方

- コミュニティでは「Clean Code を新人時代に信じ、数年後に APoSD で視点が変わる」という旅を語る人が多い。
- 実務的な落としどころの一例:
  - まず **命名・一貫性・責務分離** は Clean Code 流で鍛える。
  - そのうえで **抽象の深さ・情報隠蔽・依存の最小化** は APoSD の語彙で設計判断を下す。
  - **メソッド長** は「行数」ではなく「1つの抽象として把握可能か」で判断する。

---

## 付録D: 実務への落とし込み（日本語現場でのチェックリスト）

### D.1 コードレビューで使う質問集

- このモジュールは **深い** か？（IF の行数 < 実装の行数、の感覚）
- 呼び出し側は不要な前提を知らされていないか？（information leakage）
- 同じ設計決定が **2 箇所以上** に現れていないか？
- このクラス/関数に **良い名前** が付けられているか？難しければ抽象が悪い。
- コメントはコードを繰り返しておらず、**意図 / 不変条件 / why** を書いているか？
- 変更が **設計を悪くしていない** か？少しでも良くしているか？
- 2 つ以上の設計案を並べて比較したか？
- 分けた2関数は conjoined になっていないか？
- Pass-through method/variable を増やしていないか？
- 例外はアプリ層が判断すべきものだけ露出しているか？
- 既存の流儀と一貫しているか？ローカル最適より **一貫性優先** か？

### D.2 チームに導入するためのロードマップ（例）

1. 共通語彙の確立: "deep module / shallow module / information leakage / obscurity / conjoined methods / pass-through / strategic vs. tactical" をチームの日常語にする。
2. PR テンプレに「設計上の改善点（あれば）」「Red Flag がないか」欄を追加。
3. 週次または隔週で **Design It Twice** セッション（30〜45分）を設け、新規クラスの設計案を2つ並べて選ぶ。
4. Comment-first の PoC を1プロジェクトで試す（IF とメンバ変数のコメントを実装前にレビュー）。
5. `designNotes.md` をリポジトリに置き、cross-module の設計判断をそこに寄せる。

### D.3 よくある日本語現場特有のアンチパターン

- **Getter/Setter の自動生成を無条件で許す**（Lombok 等）→ 情報隠蔽の機会損失。
- **"Util" / "Common" / "Helper" クラスへの寄せ集め** → shallow module の温床。
- **Temporal decomposition**: 帳票出力を `ReadData → Format → OutputFile` のようなクラス分割で済ませる → format 変更が3箇所波及。
- **"設定ファイル至上主義"**: 内部で決められるはずの値を片っ端から config に出す → obscurity と leakage の増加。
- **Clean Code 流「2〜4行関数」を機械的適用** → conjoined methods 量産、レビューで迷子に。

---

## 付録E: この一冊で一番覚えておく3つ

1. **"Modules should be deep."** — 小さなインタフェースで大きな仕事を隠す。浅いラッパーは害。
2. **"Pull complexity downwards."** — 複雑性はモジュールの内側に吸収させて、呼び出し側を楽にする。
3. **"Comments are a design tool."** — コメントが書けないならその抽象は悪い。書く → より良い抽象へ、を往復する。

---

## 参考ソース

- John Ousterhout, スタンフォード公式ページ「Software Design Book」（2nd Edition の変更点の公式説明） https://web.stanford.edu/~ouster/cgi-bin/aposd.php
- `johnousterhout/aposd-vs-clean-code`（Ousterhout × Martin 本人同士の議論） https://github.com/johnousterhout/aposd-vs-clean-code
- Sebastien Glavoie, "Reading notes: A Philosophy of Software Design, 2nd Edition" https://www.sglavoie.com/posts/2025/03/30/book-summary-philosophy-software-design-2nd-edition/
- The Pragmatic Engineer: "A Philosophy of Software Design: My Take (and a Book Review)" https://blog.pragmaticengineer.com/a-philosophy-of-software-design-review/
- thedeployguy: "A Philosophy of Software Design - Summary Part 2 (CP10 → End)" https://thedeployguy.com/2019-06-16-a-philosophy-of-software-design-summary-part-2-cp10-end/
- Gergely Orosz, "The Philosophy of Software Design – with John Ousterhout" https://newsletter.pragmaticengineer.com/p/the-philosophy-of-software-design
- alysivji notes: https://github.com/alysivji/notes/blob/main/software-engineering/philosophy_of_software_design.md
- Yingang 中国語サイト上の1st Edition 訳抜粋（章構成確認用） https://yingang.github.io/aposd-zh/en/ch03.html
- Tryingthings blog: "APoSD vs Clean Code, a debate" https://tryingthings.wordpress.com/2025/02/25/aposd-vs-clean-code-a-debate/