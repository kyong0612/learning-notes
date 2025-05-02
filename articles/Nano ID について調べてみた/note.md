# Nano ID について調べてみた

ref: <https://mryhryki.com/blog/memo/20240529-134635.html>

この記事は、JavaScriptライブラリである [Nano ID](https://github.com/ai/nanoid) について調査した結果をまとめたものです。

## Nano ID の特徴

### UUID とほぼ同等のランダム性

* Nano ID は、UUID v4 と比較してランダムビット数がわずかに多く（Nano ID: 126ビット、UUID v4: 122ビット）、衝突確率は同程度です。
* UUID v4 が36文字であるのに対し、Nano ID は21文字とより短い文字数で表現できます。

### URL Safe な文字種

* デフォルトでは `A-Za-z0-9_-` の文字種で構成されており、URLでの使用に適しています。
* 独自の文字種を指定してIDを生成することも可能です。

    ```javascript
    // https://github.com/ai/nanoid/blob/36b05dd67bad457638958acff10fba04f747840f/README.md#custom-alphabet-or-size
    import { customAlphabet } from 'nanoid'
    const nanoid = customAlphabet('1234567890abcdef', 10)
    model.id = nanoid() //=> "4f90d13a42"
    ```

### 実行速度について

* Nano ID の README によると、`crypto.randomUUID` と比較して実行速度は約 1/4 程度とされています。
  * `crypto.randomUUID`: 28,398,328 ops/sec
  * `nanoid`: 7,484,029 ops/sec
* しかし、筆者が独自に検証した結果 ([検証コード](https://gist.github.com/mryhryki/bf2c7b2e0e0998cea728ba879e5cf255)) では、`nanoid()` と `crypto.randomUUID()` の速度に大きな差は見られませんでした（Node.js v20.14.0 環境、100万回生成）。
  * `crypto.generateRandomUUID()`: 1408.667ms
  * `nanoid()`: 1425.956ms
  * (筆者は、標準出力への書き出しによる影響の可能性を指摘し、詳細な検証は行っていません)

## まとめ（重要な結論）

* Nano ID は、UUID v4 と同程度のランダム性を持ちながら、より短く URL Safe な文字列でIDを生成できる便利なライブラリです。
* 生成速度も実用上問題なく、カスタマイズ性も備えています。
* ID生成が必要な場面で、UUID v4 の代替として検討する価値があります。

---

**注意点:** 実行速度に関する筆者の検証結果は、README のベンチマークとは異なる結果を示しています。利用環境によっては速度差が出る可能性があるため、パフォーマンスが重要な場合は個別に検証することが推奨されます。
