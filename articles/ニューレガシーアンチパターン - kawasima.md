---
title: "ニューレガシーアンチパターン - kawasima"
source: "https://scrapbox.io/kawasima/%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%AC%E3%82%AC%E3%82%B7%E3%83%BC%E3%82%A2%E3%83%B3%E3%83%81%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3"
author:
  - kawasima
published:
created: 2025-11-12
description: |
  レガシーシステムを再構築しても期待していた開発スピードや品質の向上が得られない理由について、10個のアンチパターンを解説した記事。画面駆動設計、テーブル駆動設計、配線プログラミング、儀礼的レイヤリング、Contract-less Service、モデルオーバーローディング、仕様隠し、早期サイロ化、設計者・実装者の分離、仕様実装混在ドキュメントといった問題パターンと、それぞれのコンテキストと問題点を詳述している。
tags:
  - "clippings"
  - "アーキテクチャ"
  - "レガシー"
  - "アンチパターン"
  - "設計"
  - "ドメインモデリング"
---

# ニューレガシーアンチパターン

レガシーシステムを再構築しようとしても、期待していた開発スピードや品質の向上が得られないのはなぜか？そこに潜むアンチパターンを書き出した記事。

## 1. 画面駆動設計

画面を切り口にアプリケーションの設計を考える。これ単体ではアンチパターンではないが、以下のコンテキストで問題となる。

### コンテキスト

- 現行システムの画面操作に慣れたユーザが多い

### 問題

- 同じ扱いをすべきデータが複数の画面に分散していても、それに気づきにくい
- 表示条件に見えるものが実はビジネスルールの制約である
- 項目間の関係性や構造が見えにくい

## 2. テーブル駆動設計

データベースのテーブルを切り口にアプリケーションの設計を考える。これ単体ではアンチパターンではないが、以下のコンテキストで問題となる。

### コンテキスト

- 現行システムのデータベーススキーマが既に存在し、それを前提とした開発が求められる
- データベースの大幅な変更はリスクやコストが高いため避けられる傾向にある
- 既存のテーブル構造に多くの既存データが蓄積されており、移行が困難

### 問題

- 正規化されていれば関連に関しては構造化されるが、それでもEmbedded Valueになるようなものは、その構造が認識されにくくなる

## 3. 配線プログラミング

アプリケーション設計を画面項目とテーブル項目を結線する行為であると考える。

### コンテキスト

- 画面駆動設計とテーブル駆動設計が実践されている
- 先に具体的な項目まで落とし込んでしまうと、抽象的な構造やパターンを見出す思考が働かなくなり、項目間の本質的な関係性や制約が認識されにくくなる。結果として、業務ロジックが画面とテーブルの間を往復する配線コードに埋もれてしまう。

### 問題

- 同じ扱いをすべきデータや同じ振る舞いをしなければならないものが複数の画面やテーブルに分散して実装される
- ビジネスロジックが表現されず、バリデーションや条件分岐として散在する
- テストが困難になり、変更の影響範囲が把握できない

## 4. 儀礼的レイヤリング

扱うデータが変わるわけではないのに、レイヤーを分ける。

### コンテキスト

- レイヤー分割やアーキテクチャの導入が形式的に行われ、実質的な責務の分離や依存関係の整理が伴っていない
- 各レイヤーが本来果たすべき役割を理解せず、単に「Controller」「Service」「Repository」といった名前だけが存在する

### 問題

- レイヤーを分けることで関心の分離を試みているが、各レイヤーで扱うデータ構造が本質的に同じであり、単なるデータの受け渡しのためだけにレイヤーが存在している
- レイヤー間の変換コードが大量に発生し、保守コストが増大するが、それに見合う設計上のメリットが得られていない

## 5. Contract-less Service

Design by Contractの逆で、配線プログラミングにより「画面境界でバリデーションしているから」という理由で、それ以下のレイヤーのメソッドには本当は事前条件が存在するにもかかわらず、実装されない。結果としてそれらのメソッドが利用できる条件が暗黙的になり、再利用は難しくなる。

### コンテキスト

- 画面境界でバリデーションが行われており、それより下のレイヤーには不正な値が渡らないという前提がある
- 各メソッドやサービスの呼び出し側が「適切な値を渡す責任」を暗黙的に負っている状態

### 問題

- メソッドが正しく動作するための前提条件(事前条件)が明示されておらず、コードを読んでも何が期待されているのか分かりづらい
- 元々設計された経路以外からの呼び出しが難しく再利用性が低い

## 6. モデルオーバーローディング

入力と出力に同じ型を使う。業務的に同じ型である正当な理由はなく、型の数をできるだけ少なくしたい目的であると考えられる。したがって、入力専用・出力専用の項目が多く含まれる。

### コンテキスト

- 「型を増やすとメンテナンスが大変になる」という誤った認識が開発チームに浸透している
- 各メソッドやAPIが異なる目的で呼ばれるにも関わらず、同じデータ構造を使い回すことで「統一感」を出そうとしている

### 問題

- 入力時には必要ない項目や出力時には必要ない項目が混在し、どの項目が必須でどの項目が任意なのかが不明瞭になる
- メソッドごとに実際に使用される項目が異なるため、呼び出し側は「このメソッドにはどの項目を設定すべきか」を毎回コードやドキュメントを読んで確認する必要がある
- 型システムによる安全性が機能せず、実行時エラーのリスクが高まる(nullチェックが至る所に必要になる)

### コード例

```java
public class OrderDto {
    private String couponCode;
    private String paymentMethod;
    private Long orderId;
    private Long customerId;
    private String deliveryAddress;
    private List<OrderLineDto> orderLines;
    private String trackingNumber;
    private Integer orderStatus;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private LocalDateTime orderedAt;
    private LocalDateTime shippedAt;
    private String orderStatusName;
}

public class OrderService {
    public OrderDto createOrder(OrderDto order) {
        if (order.getCouponCode() != null) {
            // クーポン適用処理
        }
        order.setOrderStatus(1);
        order.setTotalAmount(calculateTotal(order));
        order.setOrderedAt(LocalDateTime.now());
        order.setOrderStatusName("確定");
        orderRepository.save(order);
        return order;
    }

    public OrderDto updateDeliveryAddress(OrderDto order) {
        if (order.getOrderStatus() != null && order.getOrderStatus() >= 2) {
            throw new BusinessException("発送済みのため変更できません");
        }
        OrderDto existing = orderRepository.findById(order.getOrderId());
        existing.setDeliveryAddress(order.getDeliveryAddress());
        return orderRepository.save(existing);
    }

    public OrderDto shipOrder(OrderDto order) {
        OrderDto existing = orderRepository.findById(order.getOrderId());
        if (existing.getOrderStatus() != 1) {
            throw new BusinessException("確定済み注文のみ発送できます");
        }
        existing.setTrackingNumber(order.getTrackingNumber());
        existing.setOrderStatus(2);
        existing.setShippedAt(LocalDateTime.now());
        existing.setOrderStatusName("発送済");
        return orderRepository.save(existing);
    }

    public OrderDto completeDelivery(OrderDto order) {
        // 入力: orderIdのみ使用だが、全項目が存在
        OrderDto existing = orderRepository.findById(order.getOrderId());
        existing.setOrderStatus(3);
        existing.setOrderStatusName("配達完了");
        return orderRepository.save(existing);
    }
}
```

## 7. 仕様隠し

実装の中に業務上の意味の区別が隠される(フラグや区分の組合せで意味が作られる)。見かけ上はカプセル化に見える。

### コンテキスト

- 業務ルールや制約がフラグや区分コードの組み合わせによって暗黙的に表現され、その意味がコードから直接読み取れない状態
- 例えば「ステータスが2かつ区分が'A'の場合は特別扱い」といった条件分岐が散在し、その組み合わせが持つ業務上の意味(例:「キャンセル可能な確定済み注文」)が明示的に型やメソッドとして表現されていない

### 問題

- ビジネスロジックの意図が隠蔽され、コードレビューや保守時に「なぜこの条件なのか」が理解できない
- 同じ意味を持つ条件判定が複数箇所に重複し、一箇所を変更しても他の箇所の修正漏れが発生しやすい
- 新たな状態や区分の追加時に、既存のすべての条件分岐を洗い出して影響を確認する必要があり、変更コストが非常に高い

### コード例

```java
public class Order {
    private UUID orderId;
    private List<OrderLine> orderMeisai;
    private String deliveryAddress;
    private String trackingNo;
    private boolean kakuninFlag;
    private boolean cancelFlag;
    private boolean hakkouFlag;
    private boolean premiumFlg;
    private LocalDateTime createDate;
    private LocalDateTime kakuninDate;
    private LocalDateTime shipDate;
    private LocalDateTime haitatsuDate;

    public void addShohin(Product shohin, int suryo) {
        if (!kakuninFlag && !cancelFlag) {
            orderMeisai.add(new OrderLine(shohin, suryo));
        } else {
            throw new IllegalStateException("商品を追加できません");
        }
    }

    public void kakutei(String address) {
        if (!kakuninFlag && !cancelFlag && orderMeisai.size() > 0) {
            this.kakuninFlag = true;
            this.kakuninDate = LocalDateTime.now();
            this.deliveryAddress = address;
        }
    }

    public void doCancel() {
        Duration keika = Duration.between(createDate, LocalDateTime.now());
        boolean canCancelFlg = !hakkouFlag && haitatsuDate == null &&
                ((premiumFlg && keika.toHours() < 48) ||
                 (!premiumFlg && keika.toHours() < 24));
        if (canCancelFlg) {
            this.cancelFlag = true;
        } else {
            throw new IllegalStateException("キャンセルできません");
        }
    }

    public void doShip(String tracking) {
        if (kakuninFlag && !cancelFlag && !hakkouFlag) {
            this.hakkouFlag = true;
            this.shipDate = LocalDateTime.now();
            this.trackingNo = tracking;
        }
    }
}
```

## 8. 早期サイロ化

画面駆動設計を採用し設計の早い段階から画面ごとに担当者を割り当て個々に設計させる。

### コンテキスト

- 仕様から設計までをリードできるエンジニアがいない
- 開発規模が大きく、山積み要因計画上、プロジェクトの早い段階で設計者を多く調達することになっている
- 各担当者は自分の画面の要件を満たすことに集中する

### 問題

- 共通の業務ロジックやドメインモデルを抽出する前に個別実装が進むため、似たようなロジックが各画面に重複して実装される
- 画面間でのデータモデルや処理の一貫性が失われ、後から共通化しようとしても困難になる
- 各担当者が独自の判断で設計するため、品質のばらつきが大きくなる

## 9. 設計者・実装者の分離

設計者が仕様を文書化し、実装者がその文書に基づいてコードを書くという分業体制を敷く

### コンテキスト

- プロジェクトの規模が大きく、特に実装フェーズを別の組織に発注する必要があると判断している
- 設計者は上流工程の経験豊富なシニアエンジニアやアーキテクト、実装者はジュニアエンジニアやオフショアチームという役割分担が前提とされている
- 実装スキルを持ち合わせていないシステムエンジニアが大量にいる

### 問題

- 設計者ドキュメントに細かく書けば書くほど後続工程の品質が上がると思い込んでしまう

## 10. 仕様実装混在ドキュメント

設計書が本来記述すべき「何を実現するのか」(What)や「なぜそれが必要なのか」(Why)という本質的な要求や業務ルールではなく、「どのように実装するか」(How)という技術的な実装手順を詳細に記述してしまう

### コンテキスト

- 設計書が「顧客が商品を購入できる」という要求ではなく、「OrderServiceのcreateOrderメソッドを呼び出し、OrderDtoに顧客IDと商品IDを設定して渡す」といった実装手順を記述している
- 業務ルールや制約条件はハッキリとは書かれず、具体的なクラス名やメソッド名、アルゴリズム、SQLなどが詳細に書かれる

### 問題

- 実装技術が変わると設計書全体を書き直す必要があり、ドキュメントの保守コストが極めて高い
- 実装者が設計の意図を理解できず、仕様の誤りがあっても指摘されない
- 記載された手順を機械的に実装するだけになり、性能問題などがあっても実装者は指摘しない

## まとめ

これらのアンチパターンは、レガシーシステムの再構築において、表面的には「モダンな技術」や「良い設計パターン」を採用しているように見えても、本質的な問題（ドメインモデルの欠如、ビジネスロジックの散在、責務の不明確さなど）が解決されていないために発生する。真の改善のためには、これらのアンチパターンを認識し、ドメインモデリングや適切なアーキテクチャ設計に基づいた再設計が必要である。
