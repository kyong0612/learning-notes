---
title: "Remix 3 発表まとめ - React を捨て、Web標準で新しい世界へ"
source: "https://zenn.dev/coji/articles/remix3-introduction"
author:
  - "Coji Mizoguchi"
published: 2025-10-12
created: 2025-10-13
description: |
  2025年10月10日のRemix Jam 2025で発表されたRemix 3の詳細な解説記事。React Routerの生みの親であるRyan FlorenceとMichael Jacksonが、なぜReactから離れて独自のフレームワークを作ることにしたのか、その理由と新しいビジョンを語った歴史的な発表の内容をまとめている。セットアップスコープ、Remix Events、型安全なContext API、Signal による非同期管理など、Web標準ベースの新しいアプローチを詳細に解説。
tags:
  - "Remix"
  - "React"
  - "JavaScript"
  - "TypeScript"
  - "Web標準"
  - "フロントエンド"
  - "フレームワーク"
---

## 概要

2025年10月10日、カナダのトロントで開催された「Remix Jam 2025」で、React Routerの生みの親であるRyan FlorenceとMichael JacksonがRemix 3を発表しました。本記事は、1時間47分に及ぶセッション動画を詳しく解説した包括的なまとめです。

**重要な注意事項**

- この記事はセッション動画の音声をAIで文字起こしし、AIを活用して執筆されています
- コード例は実際の動作確認が行われていない可能性があります
- Remix 3は現在プロトタイプ段階で、APIや仕様は変更される可能性があります

---

## なぜRemix 3を作るのか

### React への感謝と決別

Michael JacksonとRyan Florenceは、Reactに対して深い敬意を持っていますが、ここ1〜2年でReactの方向性に違和感を感じるようになりました。

> 「僕らはもう、Reactがどこに向かっているのか分からなくなってきた」- Michael Jackson

彼らは10年以上React Routerをメンテナンスし、Shopifyのような大企業がそれに依存していますが、新たな道を選択することにしました。

### 現代のフロントエンド開発の複雑さ

Ryan は、フロントエンドエコシステムの複雑さについて率直に語ります：

> 「正直言って、全体像を把握できなくなってきた。フロントエンド開発者として、自分でも何が起きているのか分からない時がある」

彼らはこの状況を「山を登る」比喩で表現しています。現在の山（React）を下りて、よりシンプルな別の山（Web標準ベースのフレームワーク）に登り直すという決断です。

### Web プラットフォームの進化

Node.jsは16歳、Reactは12〜13歳になり、その間にWebプラットフォームは大きく進化しました：

- **ES Modules**: ブラウザでモジュールをロード可能
- **TypeScript**: 型による開発体験の向上
- **Service Workers**: バックエンド機能をブラウザで
- **Web Streams**: Node.jsにも標準ストリームが
- **Fetch API**: Node.jsでも使用可能
- **Web Crypto**: 暗号化機能が標準に

### AI時代のフレームワーク

AI時代のフレームワークに必要な要素：

- **安定したURL**: LLMがアクションを実行するため、URLは常に同じである必要
- **シンプルなコード**: AIが生成・理解しやすいコード
- **バンドラーへの依存を減らす**: ランタイムセマンティクスがバンドラーに依存しない

Reactの`use server`では、RPC関数のURLがビルドごとに変わってしまうため、AIがそれを利用することが困難です。

---

## Remix 3の核心アイデア

### セットアップスコープ (Setup Scope)

Remix 3の最も革新的な概念が**セットアップスコープ**です。

```typescript
function App(this: Remix.Handle) {
  // このスコープは1回だけ実行される（セットアップスコープ）
  let bpm = 60

  // レンダー関数を返す
  return () => (
    <button
      on={tempo((event) => {
        bpm = event.detail
        this.update()
      })}
    >
      BPM: {bpm}
    </button>
  )
}
```

**重要なポイント**：

1. セットアップコードは1回だけ実行される
2. 状態はJavaScriptのクロージャに保存される（Remixの特別な機能ではない）
3. 再レンダリングは`this.update()`を明示的に呼ぶ

> 「ボタンはどうやってBPMが変わったことを知るの？**知らない**。それがRemix 3の素晴らしいところ。これはただのJavaScriptスコープ。君が`update()`を呼んだ時だけ、レンダー関数を再実行する」- Ryan Florence

### Remix Events: イベントを第一級市民に

Remix 3では、**イベントをコンポーネントと同じレベルの抽象化**として扱います。

#### `click`イベントの複雑さ

`click`イベントは実際には以下の複数の操作を統合したものです：

- マウスダウン + マウスアップ（同じ要素上）
- キーボードのSpaceダウン + Spaceアップ（Escapeなし）
- キーボードのEnterダウン（即座にクリック + リピート）
- タッチスタート + タッチアップ（スワイプなし）

#### カスタムインタラクションの作成

Remix Eventsを使うと、独自のインタラクションを作成できます：

```typescript
import { createInteraction, events } from "@remix-run/events"
import { pressDown } from "@remix-run/events/press"

export const tempo = createInteraction<HTMLElement, number>(
  "rmx:tempo",
  ({ target, dispatch }) => {
    let taps: number[] = []
    let resetTimer: number = 0

    function handleTap() {
      clearTimeout(resetTimer)
      taps.push(Date.now())
      taps = taps.filter((tap) => Date.now() - tap < 4000)
      
      if (taps.length >= 4) {
        let intervals = [];
        for (let i = 1; i < taps.length; i++) {
          intervals.push(taps[i] - taps[i - 1])
        }
        let bpm = intervals.map(
          (interval) => 60000 / interval
        )
        let avgTempo = Math.round(
          bpm.reduce((sum, value) => sum + value, 0) / bpm.length
        )
        dispatch({ detail: avgTempo })
      }

      resetTimer = window.setTimeout(() => {
        taps = []
      }, 4000)
    }

    return events(target, [pressDown(handleTap)])
  }
)
```

> 「コンポーネントが要素に対する抽象化であるように、カスタムインタラクションはイベントに対する抽象化だ」- Ryan Florence

### Context API: 再レンダリングを引き起こさない

Remix 3のContext APIは、Reactとは根本的に異なります。

```typescript
function App(this: Remix.Handle<Drummer>) {
  const drummer = new Drummer(120)
  // コンテキストをセット（再レンダリングは発生しない）
  this.context.set(drummer)

  return () => (
    <Layout>
      <DrumControls />
    </Layout>
  )
}

function DrumControls(this: Remix.Handle) {
  // コンテキストを型安全に取得
  let drummer = this.context.get(App)
  // drummerの変更を購読
  events(drummer, [Drummer.change(() => this.update())])

  return () => (
    <ControlGroup>
      <Button on={dom.pointerdown(() => drummer.play())}>
        PLAY
      </Button>
      <Button on={dom.pointerdown(() => drummer.stop())}>
        STOP
      </Button>
    </ControlGroup>
  )
}
```

**重要なポイント**：

1. `context.set()`は再レンダリングを引き起こさない
2. `context.get(Component)`でプロバイダーを直接参照（"Go to Definition"が効く！）
3. 型安全: プロバイダーコンポーネントの型から自動推論

### Signal: 非同期処理の管理

Remix 3には重要な原則があります：

> 「関数を渡したら、signalを返す」

イベントハンドラーには自動的に`signal`が渡されます（`AbortController`のsignal）：

```typescript
<select
  id="state"
  on={dom.change(async (event, signal) => {
    fetchState = "loading"
    this.update()

    const response = await fetch(
      `/api/cities?state=${event.target.value}`,
      { signal } // signalをfetchに渡す
    )
    cities = await response.json()
    if (signal.aborted) return // 古いリクエストは自動的に中断される

    fetchState = "loaded"
    this.update()
  })}
>
```

ユーザーが連続してセレクトボックスを変更すると：

1. 古いハンドラーのsignalがabortされる
2. `fetch()`が自動的にキャンセルされる
3. `signal.aborted`チェックで古い処理をスキップ

これにより、**レースコンディションを手動で、しかしシンプルに解決**できます。

---

## 実際のデモから学ぶ

### デモ1: カウンターからテンポタッパーへ

#### ステップ1: プレーンJSでカウンター

まずは、プレーンなJavaScriptでシンプルなカウンターを作ります：

```javascript
let button = document.createElement("button")
let count = 0

button.addEventListener("click", () => {
  count++
  update()
})

function update() {
  button.textContent = `Count: ${count}`
}

update()
document.body.appendChild(button)
```

#### テンポタッパーへの進化

クリックの速さ（BPM）を測定するテンポタッパーに変更：

タップの間隔を計算して平均BPMを算出するロジック：

1. 直近4秒間のタップを配列に保存
2. タップ間の間隔（ミリ秒）を計算
3. 各間隔からBPMを計算（60000 / interval）
4. すべてのBPMを平均して表示

#### ステップ2: Remix Eventsでイベントを抽象化

カスタムインタラクション`tempo`を作成し、タップ計算ロジックをカプセル化します。

**重要なポイント**：

- 状態とイベントをカプセル化
- 型安全: `createInteraction<HTMLElement, number>`で型を定義
- 再利用可能
- 合成可能: `pressDown`は内部で`pointerdown`と`keydown`を統合

#### ステップ3: Remix 3のコンポーネント化

```typescript
function App(this: Remix.Handle) {
  let bpm = 60

  return () => (
    <button
      on={tempo((event) => {
        bpm = event.detail
        this.update()
      })}
    >
      BPM: {bpm}
    </button>
  )
}
```

**セットアップスコープの特徴**：

- 1回だけ実行される
- 状態はJavaScriptのクロージャに保存
- `this.update()`で明示的に再レンダリング

### デモ2: ドラムマシン

完全なドラムマシンアプリを構築。主な機能：

- Play/Stopボタン
- テンポ調整（BPM）
- ビジュアライザー（音量表示）
- キーボードショートカット（Space: 再生/停止、Arrow Up/Down: テンポ変更）

```typescript
function App(this: RemixHandle) {
  const drummer = new Drummer()

  return function render() {
    return (
      <div
        on:window={[
          [space, () => drummer.toggle()],
          [arrowUp, () => drummer.bpm += 5],
          [arrowDown, () => drummer.bpm -= 5],
        ]}
      >
        <DrumMachine />
      </div>
    )
  }
}
```

### デモ3: フォームと非同期処理

州を選択すると、その州の都市リストをfetchする典型的なUI：

```typescript
function CitySelector(this: RemixHandle) {
  let state = "idle"
  let cities = []

  return function render() {
    return (
      <form>
        <select
          on:change={async (event, signal) => {
            state = "loading"
            this.update()

            const response = await fetch(
              `/api/cities?state=${event.target.value}`,
              { signal }
            )

            if (signal.aborted) return

            cities = await response.json()
            state = "loaded"
            this.update()
          }}
        >
          <option>Alabama</option>
          <option>Alaska</option>
        </select>

        <select disabled={state === "loading"}>
          {cities.map(city => (
            <option>{city}</option>
          ))}
        </select>
      </form>
    )
  }
}
```

> 「イベントから考え始める。それが僕のやり方。ユーザーが最初のセレクトボックスを変更した → ローディング状態にする → データを取得 → ロード完了。これが一番自然な考え方だと思わない？」- Ryan Florence

### デモ4: コンポーネントライブラリ

Remix 3と並行して**コンポーネントライブラリ**も開発中。

#### ネストされたドロップダウンメニュー

実装されている機能：

- **ホバーインテント**: マウスが境界を横切っても意図を理解して消えない
- **3階層のネスト**: サブメニューのサブメニューまで対応
- **キーボードナビゲーション**: 完全なアクセシビリティ対応
- **イベント駆動**: Remix Eventsを活用

#### Popover APIとの統合

Web標準の**Popover API**をRemix Eventsと組み合わせて使用：

```typescript
function CustomSelect(this: Remix.Handle) {
  return () => (
    <button popover="auto">
      <div popover>
        <ListBox />
      </div>
    </button>
  )
}
```

#### イベントのバブリング

Remixのカスタムイベントは、通常のDOMイベントと同様に**バブリング**します：

```typescript
function FormWithListBox(this: Remix.Handle) {
  return () => (
    <form
      on={[
        ListBox.change((event) => {
          console.log("ListBox changed:", event.detail)
          this.update()
        })
      ]}
    >
      <ListBox options={["Apple", "Banana", "Orange"]} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

#### Web Componentsとの互換性

セッションのクライマックスで、Ryanは**Web Components**との互換性を実演：

> 「僕らのイベントシステム全体は、ただのカスタムイベントなんだ。通常のDOMを通してバブリングする。だから、Web Componentsを含む世界の他のすべてと、すぐに互換性がある」- Ryan Florence

**この設計の意義**：

1. 既存システムへの段階的導入
2. フレームワーク間の相互運用
3. AIエージェントへの埋め込み
4. 標準への準拠

---

## Remix 3の設計思想

### 抽象化は最小限に

> 「抽象化は、本当に必要だと感じるまで導入しない。イベントには型安全性と合成のために必要だった。でも、他の部分は？」- Ryan Florence

Remix 3のコンポーネントは、特別な状態管理ライブラリを使いません：

```typescript
let bpm = 60 // ただの変数
this.update() // 更新も明示的
```

### Web標準を最大限活用

- `EventTarget`と`CustomEvent`
- `AbortController`と`signal`
- `PointerEvent`でマウス・タッチ・ペンを統一
- DOM APIをそのまま利用

### TypeScriptファーストの開発体験

> 「Remix 1と2ではTypeScriptはサイドクエストみたいなものだった。でも今は、TypeScriptが開発体験の中心だ」- Michael Jackson

すべてのAPIが型安全に設計されています：

- イベントのdetail型
- Contextの型推論
- コンポーネントのprops型

### LLMで生成しやすいコード

Remix 3のコードは：

- シンプルで予測可能
- 特殊な規則が少ない
- Web標準に基づいている

そのため、LLMが理解・生成しやすくなっています。

---

## React Routerは継続される

重要なポイント：

- **React Routerは継続されます**
- Shopifyなど多くの企業がReact Routerに依存
- RemixチームがReact Router V7を開発中
- Remix 3は別の選択肢として提供

> 「React Routerはどこにも行かない。それだけは明確にしておきたい」- Ryan Florence

---

## 現在のステータス

- **プロトタイプ段階**
- ブログ投稿の3ヶ月後に開発開始
- 個別パッケージとして公開中（`@remix/events`、`@remix/ui`など）
- 最終的には統合されたフレームワークとして提供予定
- **コンポーネントライブラリも開発中**

---

## まとめ

Remix 3は、フロントエンド開発の複雑さに対するアンチテーゼです。

### 主要な特徴

1. **Setup Scope**: JavaScriptのクロージャを活用した状態管理
2. **Remix Events**: イベントを第一級市民として扱う
3. **明示的な再レンダリング**: `this.update()`で制御
4. **型安全なContext API**: 再レンダリングを引き起こさない
5. **Signalによる非同期管理**: レースコンディションをシンプルに解決
6. **Web標準ベース**: バンドラーへの依存を最小化
7. **TypeScriptファースト**: すべてのAPIが型安全
8. **AIフレンドリー**: LLMが理解・生成しやすいコード

### Ryanと Michaelのメッセージ

> 「3ヶ月間、日の光を見ていない。でも、これはワクワクする。僕らは正しい山を見つけたと思う」- Ryan Florence

Remix 3は、Web開発の未来を再定義しようとしています。シンプルさ、Web標準、型安全性、そしてAIとの親和性。これらすべてを兼ね備えた新しいフレームワークの登場を、期待して待ちましょう。

---

## 参考リンク

- [Remix公式サイト](https://remix.run/)
- [React Router](https://reactrouter.com/)
- [Remix Jam 2025セッション動画](https://www.youtube.com/watch?v=xt_iEOn2a6Y)
