---
title: "複雑なフォームを継続的に開発していくための技術選定・設計・実装 #tskaigi / #tskaigi2025"
source: "https://speakerdeck.com/izumin5210/number-tskaigi2025"
author:
  - "Masayuki Izumi (@izumin5210)"
published: 2025-05-23
created: 2025-05-27
description: |
  複雑なフォーム開発における技術選定と設計アプローチについて、LayerXのMasayuki Izumi氏によるTSKaigi 2025での発表。React Hook FormやZodから始まり、MobXやjotaiを使った高度な状態管理まで、フォームの複雑性に対する段階的な解決策を解説。
tags:
  - TypeScript
  - React
  - フォーム
  - 状態管理
  - MobX
  - jotai
  - Zod
  - 技術選定
  - アーキテクチャ
  - TSKaigi
---

# 複雑なフォームを継続的に開発していくための技術選定・設計・実装

## 発表概要

本資料は、LayerXのMasayuki Izumi氏（@izumin5210）がTSKaigi 2025で行った、複雑なフォーム開発における技術選定と設計に関する発表です。

## 発表者について

- **所属**: LayerX バクラク事業部 Platform Engineering部 Enableチーム
- **役職**: Staff Software Engineer
- **実績**: ISUCON14 4位
- **好きな関数**: cva

## フォームの複雑性とその課題

### なぜフォームは難しいのか

フォーム開発は表面的には単純に見えますが、実際のプロダクトでは以下のような要因で複雑になります：

- **フィールド数の増加**: 多数の入力項目の管理
- **画面数の増加**: ウィザード形式やマルチステップフォーム
- **補完機能**: 自動入力や候補表示
- **フィールドのバリエーション**: 動的な項目変更
- **ビジネスルールの複雑性**: 裏側の複雑な制約やペインの隠蔽

### プログラミング的な複雑性

フォームは本質的にプログラミングを複雑にする要素を多く含んでいます：

1. **入力処理**: ユーザーからの多様な入力
2. **状態構築**: 入力に基づく状態の構築
3. **同期・非同期操作**: APIコールや計算処理
4. **出力生成**: 最終的な結果の生成

## 段階的な解決アプローチ

### 1. 最も単純な実装（useState）

```javascript
// 基本的なuseStateの使用
const [name, setName] = useState('')
const [email, setEmail] = useState('')
```

**問題点**:

- フィールド増加に伴うuseStateの増大
- 1フィールドの更新で全体再描画
- バリデーション処理の困難

### 2. フォームライブラリの導入（React Hook Form）

```javascript
// React Hook Formの使用例
const { register, handleSubmit } = useForm()
```

**利点**:

- 基礎的な面倒事の吸収
- 効率的な再描画制御
- バリデーション実行と制御

**限界**:

- UIとロジックの混在
- バリデーション記述の見通しの悪さ

### 3. バリデーションスキーマの追加（Zod）

```javascript
// Zodスキーマの定義例
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})
```

**利点**:

- 値の構造と制約の宣言的記述
- UIからの独立したロジック管理
- 自然なモデリングの促進

**限界**:

- 「形状」と「制約」のみに留まる
- 計算やロジックの組み込みの困難

## 高度な状態管理への移行

### 問題の発展例：ECサイトのカート

1. **基本**: 商品と数量から合計金額を計算
2. **拡張1**: 合計金額に制限を追加
3. **拡張2**: 小計の計算を追加
4. **拡張3**: ドル決済時のレート取得（非同期処理）

### React Hook Form + Zodの限界

以下のような兆候が現れたら要注意：

- `watch`や`setValue`の多用
- `useEffect`との組み合わせ
- 手続き的な状態更新によるバグリスク
- 重要な書き込みロジックの無視

## 解決策1: MobX

### MobXの特徴

- **オブジェクト指向**: 普通のクラスライクな記述
- **暗黙的依存追跡**: ランタイムでの自動追跡
- **効率的更新**: getterが読んだ値の変更を自動検知

```javascript
// MobXを使った例（概念的）
class CartModel {
  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}
```

### MobXの適用場面

- オブジェクト指向的なモデルがフィットする場合
- データの依存関係が比較的単純な場合

## 解決策2: jotai

### jotaiの特徴

- **atom単位**: 細分化された状態管理
- **明示的依存**: `get(anAtom)`による依存の明示
- **非同期対応**: 非同期処理の自然な統合

```javascript
// jotaiを使った例
const totalAtom = atom((get) => {
  const items = get(itemsAtom)
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
```

### jotaiの利点

- 複雑な依存関係への対応
- 非同期処理の統合
- React Suspenseとの自然な連携
- テストの容易性

## 設計の重要ポイント

### ① モデルは「形状」だけでなく、ロジック・振る舞いも含める

- Zodの「形状」「制約」を超えた概念の導入
- ドメイン上重要な概念への命名
- 重要性の明確化

### ② フォームにおけるモデルをUIから分離する

- 価値の高いロジックの独立
- テスト容易性の向上
- レビュー時の注意点の明確化
- AI開発時の効率向上

### ③ なるべく状態ではなく、値として扱う

- 状態の複雑性回避
- Derived Value（派生値）としての扱い
- 計算ロジックの単純化

## 技術選定の考え方

### 問題に応じた適切な選択

- **ウィザード形式**: XState（状態遷移）
- **Undo機能**: Redux/Zustand
- **単純なフィールド増加**: Zodでの形状モデリング
- **データ依存の複雑性**: MobX/jotai

### 「フォーム」にこだわりすぎない

- 表面的要素に囚われない思考
- 本質的な問題の特定
- 例：「相関バリデーションの困難」→「データ依存関係のモデリング不足」

## 継続的開発のための実践

### 早期発見のためのコード設計

**気づくスピード**: 型 > Lint > Unit Test > ... > エンドユーザ

#### 早く壊れる型の例

1. **Exhaustiveness checking**: `foo satisfies never`の活用
2. **明示的パラメータ**: optionalの回避、nullの明示的な渡し
3. **返り値型の明示**: 推論に頼らない型指定

### 限界サインの早期発見

- 機能開発時間の増加
- バグの増加傾向
- React Hook Formでの`watch`/`setValue`の多用

### 段階的アプローチの重要性

- 最初から100点を目指さない
- React Hook Form + Zodからの開始
- PMF前のプロトタイプでの柔軟性
- 限界サインへの早期対応

## 技術の組み合わせ

複数技術の併用も可能：

- **Zod**: 宣言的なバリデーション記述
- **jotai**: 依存関係を持つフィールドの管理
- **Derived Value**: Zodバリデーション結果の活用

## まとめ

### フォームの本質的困難

1. **UI関連の難しさ**: フォームライブラリで解決可能
2. **プロダクト由来の複雑さ**: 適切なモデリングと技術選定で対応

### 成功のための要素

- **問題領域に適したモデリング**
- **適切な技術選定**
- **段階的な進化**
- **限界サインの早期発見**

特にデータの依存が複雑な場合、Derived Valueをうまく扱えるMobXやjotaiが有効であり、最初から最適解を求めるのではなく、限界を迎えるサインに早めに気付けるような設計が重要です。

## 関連リソース

- React公式: [useEffectは不要かも](https://ja.react.dev/learn/you-might-not-need-an-effect)
- Zenn記事: [詳解：フロントエンドの状態とリアクティブ](https://zenn.dev/layerx/articles/22dd45dc69a57c)
- Zenn記事: [Jotai v2を使いこなすための"async sometimes"パターン](https://zenn.dev/uhyo/articles/jotai-v2-async-sometimes)
