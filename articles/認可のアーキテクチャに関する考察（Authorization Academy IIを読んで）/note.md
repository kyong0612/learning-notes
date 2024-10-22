# 認可のアーキテクチャに関する考察（Authorization Academy IIを読んで）

ref: <https://zenn.dev/she_techblog/articles/6eff1f28d107be>

## いきなりまとめ

- 認可の対象が「誰」なのかは、認証にIdPを使う
- 認可はアプリケーションに閉じた方がシンプル(専門の認可サービスを作るより)
- 認可ロジックはアプリケーションロジックとは分離する
  - 分離できていないとバグりやすくなるし、スケールしにくい
- 認可に必要なデータは、そのサービス内(アプリのデータと同じDB)で持つ方がシンプル(強大なサービスになるまでは)
  - 複数のサービスを作っている場合は、各サービスに認可のエンドポイントを持たせて認可を以上できると良い
  - 集約型の認可サービス(Authorization as a Service)にすると、認可に必要なデータの扱いが極めて複雑になっていく

## 認可はどこでどのように適用できるか?

- 認可三大要素
  - 「誰が」リクエストしているか(actor)
  - 「何を」しようとしているのか(action)
  - 「何に」しようとしているのか(resource)

## 認可のインターフェイス

- 大事なフェーズ
  - Enforcement(認可の適用)
  - Decision(認可の判断)
![alt text](<assets/CleanShot 2024-10-22 at 18.17.02@2x.png>)

### 例

- 以下のコードの場合、if文の結果(認可の判断)によって「処理を継続するか」「returnするか」ということが適用(Enforce)されている

```ts
if (!user.isAdmin) return; // ここが認可ロジック

runAdminProcess();
```

> 「isAdmin だから許可」というのが認可の判断（Decision）です。この、認可の判断（Decision）と認可の適用（Enforcement）の間にインターフェイスを設けることができます。

```ts
if (!authorizer.isAllowed(user, "write", resource)) return;

runAdminProcess();
```

## Decision(認可の判断)と実装方法

- Decisionを下すために必要なものは以下の二つ
  - Authorization Data（認可データ）
    - アクセスコントロール用のデータ（e.g. AliceはAcme Organizationのメンバー）
  - Authorization Logic（認可ロジック）
    - あるactorが、あるresourceに対してactionを実行できるかどうかのルール（e.g. Organizationのメンバーであれば、Repositoryの参照が可能）

- 実装アプローチは大きく3つ
  - Decentralized Authorization（分散型）
    - ![alt text](<assets/CleanShot 2024-10-22 at 18.22.22@2x.png>)
    - メリット
      - 一番簡単に実装できるし、そのおかげでDXも良い
      - データがアプリ内から簡易にアクセスできる
      - サービスの数が少ない時は有効
    - デメリット
      - サービスの数が多くなった時にスケールしづらくなっていく
  - Centralized Authorization（集約型）
    - ![alt text](<assets/CleanShot 2024-10-22 at 18.24.04@2x.png>)
      - メリット
        - 一カ所で認可のルール(Policy)を集約できる
        - 複数のサービスが同じデータをつかっtえDecisionしてもらえる
      - デメリット
        - 認可データの置き場所が難しい
          - 各サービス内においておく場合、冗長性が減るがサービス間の結合度が上がってしまう
          - 認可サービスに同期する場合、同期のコストが高い(信頼性も)
  - Hybrid Authorization（ハイブリッド型）
    - ![alt text](<assets/CleanShot 2024-10-22 at 18.26.17@2x.png>)
      - メリット
        - DecentralizedとCentralizedの中間でバランスがとりやすい
      - デメリット
        - 通信料が多くなるのでパフォーマスが問題になりやすい
        - Decisionのインターフェイスをある程度サービス間で一貫性を持たせる必要がある（そうしないと使い勝手が悪い）
