# 「最高のチューニング」をしないために

ref: <https://speakerdeck.com/fujiwara3/hack-at-delta-24-dot-10>

- サイトが落ちる原因
  - アプリケーションサーバでメモリが足りていない
    - ピーク時不足 -> swap in/outが多発
  - MySQLでfilesortするクエリが大量に発生
    - disk IO多発
  - nginxでコネクション数が足りなくて詰まる
- 同時は「diskにアクセスしたら負け」
  - CPU 2~4コア
  - メモリ 4~8GB
  - ストレージ SATA HDD シングル or RAID-1
  - 今から見るとストレージがとにかく遅い
  - なぜ負けてしまうのか
    - application serverでmemoryが足りなくなるとswapが発生して遅い
      - swap out = メモリに乗り切らない分をdiskに書き出す
      - swap in = diskから読んでメモリに戻す
      - diskが遅いため、ほとんどの処理時間をswap処理に費やしてしまう
    - MySQLのfilesortが発生すると遅い
      - クエリ結果がメモリに乗り切らない場合、ファイルに書いてからソート
      - diskが遅いため、ほとんどの処理時間をfilesort処理に費やしてしまう
- お金だけで解決しているといつか行き詰まる
- 負荷試験をしよう
