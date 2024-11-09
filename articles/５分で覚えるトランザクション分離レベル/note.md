# ５分で覚えるトランザクション分離レベル

ref: <https://zenn.dev/levtech/articles/67bedc33a4a87b>

![alt text](<assets/CleanShot 2024-11-09 at 18.13.24@2x.png>)

![alt text](<assets/CleanShot 2024-11-09 at 18.10.58@2x.png>)

## Read Uncommited

- コミット前のUPDATE/INSERT/DELETEが見える
  - dirty read
  - とあるトランザクションT1から、並行するトランザクションT2の、コミット前の更新/挿入/削除が見える

## Read Committed

- コミット後のUPDATEが見える
  - fuzzy read
  - とあるトランザクションT1から、並行するトランザクションT2の、コミット後の更新が見える

## Repeatable Read

- コミット後のINSERT/DELETEが見える
  - phantom read
  - とあるトランザクションT1から、並行するトランザクションT2の、コミット後の挿入/削除が見える
- 一度読み込んだ対象業がもう一度読み込んでも同じ結果を返すため、リピート可能と言っている
- MySQLのInnoDBではこの分離レベルがデフォルト
  - ネクストキーロックという仕組みでphantom readを防いでいる
