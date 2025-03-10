# 「良いコードとは何か」で消耗するのはもうやめよう

ref: <https://developersblog.dmm.com/entry/2024/11/01/110000#%E6%8F%90%E6%A1%881-%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E5%93%81%E8%B3%AA%E7%89%B9%E6%80%A7%E3%81%AE%E8%A6%B3%E7%82%B9%E3%81%A7%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E8%89%AF%E3%81%97%E6%82%AA%E3%81%97%E3%82%92%E5%88%A4%E6%96%AD%E3%81%97%E3%82%88%E3%81%86>

- 議論1: 何をもって良いコードなのか
  - 提案1: ソフトウェア品質特性の観点でコードの良し悪しを判断する
    - ![alt text](<assets/CleanShot 2024-11-03 at 17.52.24@2x.png>)
- 議論2: 良いコードはどうやったら書けるのか
  - 提案2: 原理原則や設計ノウハウを踏まえた議論をしよう
    - カプセル化とは、データとそのデータを操作するロジックをひとまとめにすること
    - 関心の分離とは、それぞれの関心でモジュールを独立させ、他の関心と分離する考え方
    - 永続化ロジックやプレゼンテーションロジックを別の技術レイヤに隔離し、純粋度を高める。 UIの再利用性設計にはコンポーネント指向UIがある。 セキュリティ設計では、エスケープやCSRFトークンといった手法がある。
- 議論3: 綺麗なコード(良いコード) vs 動くコード
  - サービスの成長度合いと設計戦略の観点を持とう
    - ![alt text](<assets/CleanShot 2024-11-03 at 18.02.07@2x.png>)
    - > 事業への貢献が実証されていて、積み重なった技術的負債と膨れ上がった設計の乱雑さを刷新する必要があるシステムこそ、ドメイン駆動設計で取り組む価値がもっとも高いのです。(『ドメイン駆動設計をはじめよう ―ソフトウェアの実装と事業戦略を結びつける実践技法』p.235より引用)
- 補足：どの品質特性を追いかけるべきかは状況によって異なる
  - 再利用性
    - アプリケーション開発では再利用性を追いかけるべきでばない
      - ショッピングサイトやSNS、ゲームといったアプリケーションは、 それぞれのドメイン（事業活動）に特化したロジックになるので、 汎用的なロジックはほとんど生じない
  - パフォーマンス vs 可読性
    - に優れたコードを書こうとすると、 どうしても人間の読めないコードに近づいていき、可読性が低下してしまう。
    - まずはパフォーマンス要件をおさえましょう。
      - その上で、パフォーマンス上どこがボトルネックになっているかを計測しましょう。
      - ボトルネックになっているロジックを、 関心の分離にしたがって別モジュール（クラスや構造体）に分離しましょう。
      - 分離したモジュール内でパフォーマンス最適化しましょう。
