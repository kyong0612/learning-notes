---
title: "Railsの仕組みを理解してモデルを上手に育てる - モデルを見つける、モデルを分割する良いタイミング -"
source: "https://speakerdeck.com/igaiga/kaigionrails2024"
author:
  - "[[五十嵐邦明 (igaiga)]]"
published: 2024-10-24
created: 2025-12-19
description: |
  Kaigi on Rails 2024での発表。Railsアプリでのモデル設計について、イベント型モデルの発見方法、POROの活用、Service層を避けるべき理由を解説。また、バリデーションの分岐タイミングでのモデル分割とフォームオブジェクトの実装方法を詳しく説明する。
tags:
  - "Rails"
  - "モデル設計"
  - "フォームオブジェクト"
  - "バリデーション"
  - "ActiveModel"
  - "PORO"
  - "リファクタリング"
---

## 概要

この講演は、Railsアプリ開発で長期的に使える知識を提供することを目標としている。

### 対象者

- Railsアプリでの機能実装に慣れてきた後、メンテナンスしやすいコードを書く技術を身につけたい人
- Rails歴1年〜数年程度

### 習得できるスキル

- モデルを上手に見つけられる
- モデル分割の良いタイミング（バリデーションの分岐）に対応できる
- フォームオブジェクトを実装できる
- これらの妥当性を説明できる

---

## 前編: モデルの見つけ方

### モデルを探す方法の基礎

テーブル設計の基本ステップ（ファミレスメニューの例）：

1. **メインとなるテーブル名を名詞で出す**
   - メニューは「注文するための道具」→ `orders`（注文）をメインテーブルに

2. **「誰が・何が」を考える**
   - 「誰が注文するか」→ `customers`（顧客）テーブル

3. **「誰を・何を」を考える**
   - 「何を注文するか」→ `items`（商品）テーブル

---

### イベント型モデル

**定義**: 行為を記録するモデル

**見分け方**: 名詞であるモデル名に「〜する」をつけると行為になるもの

**例**:

- `Order`（注文）→ 注文する
- `Shipment`（出荷）→ 出荷する
- `Payment`（支払い）→ 支払いする

#### 入荷処理での具体例

**仕様**:

- 在庫（Stockモデル）を増やす
- 支払った代金を銀行口座（BankAccountモデル）から減らす

**問題**: StockモデルとBankAccountモデルしかない場合、どちらに入荷処理を書くか迷う

**解決策**: イベント型モデル `Arrival`（入荷）モデルを作成

- `received`メソッドで「在庫を増やす」「代金を銀行口座から減らす」処理をまとめる

#### メリット

- 責務が適切なモデルに処理を書ける
- 複数モデルにまたがる処理の実装場所問題を解消
- Rails wayに乗った設計方法
- 迷いづらく説明も簡単

---

### PORO（Plain Old Ruby Object）

**定義**: 何も継承していないただのクラス（ActiveRecordを継承せず、テーブルとも結びつかない）

#### POROが有効な場面

- 責務がしっくりくるモデルが作れないとき
- テーブルに保存しなくても良いモデルぽいオブジェクト
  - 別アプリのAPIから取得したオブジェクト
  - 集計結果のオブジェクト
  - Redis/sessionに一時保存するオブジェクト

**置き場所**: `app/models`以下（ビジネスロジック置き場としてモデルの仲間）

#### POROのルール作り

**理想**: 機能の実装方法をチームメンバー全員に問うたとき、全員が同じ実装方法を答える状態

**推奨ルール**: 「クラス名には返すオブジェクトの名前を名詞でつける」

**例**: ECサービスのカート

- `Cart`クラスを作成（Cartオブジェクトを返す）
- 将来データ記録が必要になったら、POROからモデルへ変更可能

---

### Service層を入れるのはできるだけやめてほしい

#### Railsの特徴: 層分割を減らした密結合な設計

**モデルが担当する仕事**:

- ORマッパー
- バリデーション
- コールバック
- フォームオブジェクト
- ビジネスロジック置き場

#### 密結合設計のメリット

- 1カ所に書いたコードが複数の役割を担当
- コード量、クラス数、ファイル数を減らせる
- 高い生産性
- 登場人物を減らすことで全体把握が容易

#### 密結合設計の弱点（受け入れている）

- 複数役割を持つコードが役割ごとに分岐するとしんどい
- 変更時の影響範囲が増える

#### Service層の問題点

1. **実装場所の迷い**: ビジネスロジックをモデルとServiceオブジェクトのどちらに書くか迷う
2. **メソッド共有の困難**: 単一publicメソッド（call等）設計が多く、privateメソッドを他で使えない
3. **認識のバラつき**: チーム内で理解がバラバラになりがち、「私の考える最強のService対決」になる

#### 代替案

- イベント型モデルを丁寧に探す
- POROのようなシンプルな考え方から始め、チームでルールを育てる

---

## 後編: モデルを分割する良いタイミング

### 「太っている」の判断基準

**NGな判断**: コード行数（減らすために分割すると失敗することが多い）

**推奨する判断**:
> 「そのまま書き続けるとしんどくなるとき」かつ「そのタイミングで良い分割方法があるとき」

### モデル分割の良いタイミング

**バリデーションを条件分岐したくなったとき**

- `validates`メソッドに`if: :condition?`を書きたくなったとき

#### 理由: RailsのバリデーションはDB用と入力用を共有している

**モデルのバリデーションの二重の役割**:

1. **DB用**: データベースに保存するデータの整合性を保つ
2. **フォーム用**: ユーザー入力の検証

**アプリ開発初期**: この共有はうまく働く（分割するとメリットが得られない）

**アプリ成長後**: DB用と異なるフォーム用バリデーションが出てくると共有がしんどくなる

**解決策**: フォームオブジェクトを作成してバリデーションを書くクラスを分離

---

## フォームオブジェクトの作り方

### 使用するモジュール

#### ActiveModel::Attributes

型を持つattributesを簡単に定義できる

```ruby
class FooFormObject
  include ActiveModel::Attributes
  attribute :name, :string
  attribute :email, :string
  attribute :terms_of_service, :boolean
end
```

#### ActiveModel::Model

モデルのように振る舞う機能各種を使えるようになる

- バリデーションの設定と実行
- form_withとのやりとり
- newメソッドでattributesと一緒に初期化

```ruby
class FooFormObject
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  attribute :email, :string
  attribute :terms_of_service, :boolean

  validates :name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :terms_of_service, acceptance: { allow_nil: false }
end
```

> **Note**: Rails 7.0以降では`ActiveModel::API`も使用可能
>
> - `ActiveModel::Model` = `ActiveModel::API` + `ActiveModel::Access`
> - `ActiveModel::Access`には`slice`と`values_at`メソッドがある

---

### フォームオブジェクト実装手順

#### Step 1: 基礎工事

```ruby
# app/forms/user_name_form.rb
class UserNameForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string

  # 全ひらがな必須のバリデーション
  validates :name, format: { with: /\A\p{Hiragana}+\z/ }, presence: true
end
```

#### Step 2: Userモデルをフォームオブジェクトへ渡す

```ruby
class UserNameForm
  # ...略...
  attr_accessor :user

  # フォームオブジェクトからモデルへattributesをセット
  def transfer_attributes
    user.name = name
  end
end
```

#### Step 3: saveメソッドの実装

```ruby
def save(...)  # ... は全引数を引き渡す記法
  transfer_attributes
  if valid?  # フォームオブジェクトのバリデーション実行
    user.save(...)  # モデルのsaveメソッドへ委譲
  else
    false  # valid?失敗時にnilが返るのを防ぐ
  end
end
```

#### Step 4: initializeメソッドの実装

```ruby
def initialize(model: nil, **attrs)
  attrs.symbolize_keys!  # StringとSymbolの両対応
  if model
    @user = model
    attrs = {name: @user.name}.merge(attrs)  # attrsがあれば優先
  end
  super(**attrs)
end
```

#### Step 5: コントローラの変更

**StrongParameters**:

```ruby
def name_params
  params.require(:user_name_form).permit(:name)
end
```

**new & createアクション**:

```ruby
def new
  @user_name_form = UserNameForm.new(model: User.new)
end

def create
  @user_name_form = UserNameForm.new(model: User.new, **name_params)
  if @user_name_form.save
    redirect_to user_url(@user_name_form.user), notice: "User was successfully created."
  else
    render :new, status: :unprocessable_entity
  end
end
```

#### Step 6: form_withでフォームオブジェクトを使う

```ruby
# app/forms/user_name_form.rb
def form_with_options
  if user.persisted?  # update用
    {
      url: Rails.application.routes.url_helpers.name_path(user),
      method: :patch
    }
  else  # create用
    {
      url: Rails.application.routes.url_helpers.names_path,
      method: :post
    }
  end
end
```

```erb
<%# app/views/names/_form.html.erb %>
<%= form_with(model: user_name_form, **user_name_form.form_with_options) do |form| %>
```

---

### フォームオブジェクト最終形

```ruby
class UserNameForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  validates :name, format: { with: /\A\p{Hiragana}+\z/ }, presence: true

  attr_accessor :user

  def initialize(model: nil, **attrs)
    attrs.symbolize_keys!
    if model
      @user = model
      attrs = {name: @user.name}.merge(attrs)
    end
    super(**attrs)
  end

  def save(...)
    transfer_attributes
    if valid?
      user.save(...)
    else
      false
    end
  end

  def form_with_options
    if user.persisted?
      { url: Rails.application.routes.url_helpers.name_path(user), method: :patch }
    else
      { url: Rails.application.routes.url_helpers.names_path, method: :post }
    end
  end

  private

  def transfer_attributes
    user.name = name
  end
end
```

**サンプルコード**: <https://github.com/igaiga/rails_form_object_sample_app>

---

## まとめ

### モデルの見つけ方

- イベント型モデルを丁寧に探す
- POROをルールを持って活用
- Service層は極力避ける

### モデル分割のタイミング

- バリデーションを条件分岐したくなったとき
- フォームオブジェクトでフォーム用バリデーションを分離

### 設計の変化

- 時間経過とともに良い設計は変わる
- アプリ開発初期はモデルでDB用/フォーム用バリデーションを共有
- 成長して共有がしんどくなったら分割

---

## 参考資料

- 諸橋さん「Simplicity on Rails -- RDB, REST and Ruby」
  - <https://speakerdeck.com/moro/simplicity-on-rails-rdb-rest-and-ruby>
- yasaichiさん、t-wadaさん podcast「texta.fm」
  - <https://open.spotify.com/show/2BdZHve9cIU6c8OFyz7LeB>
- yasaichiさん「Ruby on Railsの正体と向き合い方」
  - <https://speakerdeck.com/yasaichi/what-is-ruby-on-rails-and-how-to-deal-with-it>
- 「パーフェクト Ruby on Rails 増補改訂版」
  - <https://gihyo.jp/book/2020/978-4-297-11462-6>
- 「Railsの練習帳」
  - DBモデリング基礎講座: <https://zenn.dev/igaiga/books/rails-practice-note/viewer/rails_db_modeling_workshop>
  - フォームオブジェクト: <https://zenn.dev/igaiga/books/rails-practice-note/viewer/ar_form_object>
- YAAF Gem（フォームオブジェクトの別実装）
  - <https://github.com/rootstrap/yaaf>

---

## 著者について

**五十嵐邦明（igaiga）**

- ガーネットテック373株式会社 代表取締役
- フリーランスのRailsエンジニア
- プログラミングスクール「フィヨルドブートキャンプ」顧問

### 著書

- ゼロからわかる Ruby超入門
- Railsの教科書
- パーフェクトRuby on Rails［増補改訂版］
- RubyとRailsの学習ガイド
- Railsの練習帳
