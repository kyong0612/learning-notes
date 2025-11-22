---
title: "なぜ React 哲学を守らないといけないのか？"
source: "https://zenn.dev/kkeeth/articles/why-learning-react-philosophy"
author:
  - "Kiyohito KEETH Kuwahara"
published: 2025-11-19
created: 2025-11-22
description: |
  React哲学を守ることの重要性について説明した記事。Strict ModeやConcurrent Featuresで問題が発生するコード例と、コンポーネントを純粋に保つことの重要性を解説。Reactの将来の変更に耐えうる堅牢で予測可能なUIを構築するための方法を学ぶ。
tags:
  - "React"
  - "哲学"
  - "思想"
  - "純関数"
  - "clippings"
---

## 概要

React哲学を守ることは、単に「ルールだから」という形式的なものではなく、Reactというライブラリの恩恵を最大限に受け、将来の進化にも耐えうる堅牢で予測可能なUIを構築するための最も合理的な方法です。

## React哲学を守る理由

React哲学に従っていないコードは、Reactの将来の変更（破壊的変更も含む）で互換性を失い、アプリケーションで利用しているReactのバージョンアップにより壊れる可能性があります。

React哲学を守ることで、アプリケーションを以下のようにすることができます：

- **予測可能**で、**バグりにくく**
- **将来のReactの進化に乗り遅れない**
- **変更に耐えうる**

Reactは、UIを「宣言的」に（つまり「どうやるか」ではなく「どうあるべきか」を）記述するためのライブラリです。この根本に従うことで、コードはシンプルで理解しやすくなります。React哲学はこの宣言的なUI構築を支えるための「ルール」や「お作法」と言ってもよく、だからこそ守るべきです。

## 具体的にバージョンアップで壊れる危険性のあるコード例

### ① Strict Modeで問題発生

典型的なのが、**クリーンアップ関数を持たない`useEffect`**です。

#### ①-1 問題のあるコード例

```typescript
type User = {
  id: string;
  name: string;
};

type UserProfileProps = {
  userId: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // APIを呼び出してカウンターを増やす副作用
    fetch(`/api/users/${userId}/increment-view-count`, { method: 'POST' });

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

このコードは一見問題なく見えますが、`Strict Mode`ではReactが意図的に`useEffect`を2回実行するため、ページビューが2回カウントされてしまいます。開発環境だけの問題と思われるかもしれませんが、これが将来productionでも実行されるようになれば、閲覧回数の数字が期待値とは異なる結果になってしまいます。

さらに[`Activity`](https://ja.react.dev/reference/react/Activity)という機能を使っているときも、この問題は発生する可能性があります。

**Activityとは？**
ユーザーの目に見えない（CSSの`display: none`）裏側で、UIをあらかじめレンダリングしておく機能です。例えばタブを切り替えたときに、次の画面が一瞬で表示されるような体験を実現します。

この機能が有効になると、Reactはパフォーマンス向上のために**コンポーネントを画面に表示する前に裏でレンダリング（= Effectを再作成）し、その後、不要と判断すればEffectを破棄（= クリーンアップを実行）し、再度表示する（= 再度Effectを作成）**といった挙動をします。

先ほどの`UserProfile`コンポーネントがこの機能で使われると、**ユーザーが一度も見ていないのに、裏のレンダリングだけでページビューが記録されてしまう**、という可能性があります。

#### ①-2 正しいコード

`useEffect`には、その処理を「打ち消す」ためのクリーンアップ関数を常に意識します。

```typescript
type User = {
  id: string;
  name: string;
};

type UserProfileProps = {
  userId: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 副作用のない読み取り専用操作
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then((data: User) => {
        if (!cancelled) {
          setUser(data);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // カウントアップは別のユーザーアクション時に実行
  const handleViewCount = () => {
    fetch(`/api/users/${userId}/increment-view-count`, { method: 'POST' });
  };

  return (
    <div onClick={handleViewCount}>
      {user?.name}
    </div>
  );
}
```

このように、Reactの`useEffect`を正しく使うには、「一度きりの処理」をどう実現するかではなく、**「何度実行されても最終的な結果が正しくなるように処理を設計する」**という考え方が重要です。

### ② React Concurrent Featuresで問題発生

#### ②-1 問題のあるコード例

```typescript
let globalCounter = 0;

type Item = {
  id: string;
  name: string;
  processed: boolean;
};

type ImpureComponentProps = {
  items: Item[];
};

const ImpureComponent = ({ items }: ImpureComponentProps) => {
  // レンダリング中にグローバル変数を変更
  globalCounter++;

  // 外部の状態を直接変更
  items.forEach(item => {
    item.processed = true;
  });

  return (
    <div>
      <p>Rendered {globalCounter} times</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

このコードでは、React 18のConcurrent Renderingでレンダリングが中断・再開される際に、純粋なコンポーネントではないため予期しない動作を引き起こします。また、グローバル変数の値が予測不能になります。さらに、propsを直接変更することで、親コンポーネントに予期しない影響を与えてしまいます。

#### ②-2 正しいコード

```typescript
type Item = {
  id: string;
  name: string;
  processed?: boolean;
};

type PureComponentProps = {
  items: Item[];
};

const PureComponent = ({ items }: PureComponentProps) => {
  // 元の配列を変更せずに新しい配列を作成（純粋な計算）
  const processedItems = items.map(item => ({
    ...item,
    processed: true
  }));

  // レンダリング回数の表示が必要な場合は、親コンポーネントで管理する
  return (
    <div>
      <ul>
        {processedItems.map(item => (
          <li key={item.id}>
            {item.name} {item.processed ? '✓' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## React哲学を守る = コンポーネントを「純粋」に保つ

React哲学の核となる考え方は、**[コンポーネントを純粋に保つ](https://ja.react.dev/learn/keeping-components-pure)**ことです。ドキュメント内で使われている言葉をお借りすると、[純関数 (pure function)](https://wikipedia.org/wiki/Pure_function)のように保つということです。

ドキュメントでは、コンポーネントの純粋性について以下のように述べられています：

- **コンポーネントは自分の仕事に集中する**。レンダー前に存在していたオブジェクトや変数を書き換えない。
- **入力が同じなら出力も同じ**。同じ入力に対しては、常に同じJSXを返すようにする。
- レンダーはいつでも起こる可能性があるため、コンポーネントは相互の呼び出し順に依存してはいけない
- コンポーネントがレンダーに使用する入力値を書き換えない。これにはprops、state、コンテクストが含まれる。画面を更新するためには既存のオブジェクトを書き換えるのではなく、代わりに[stateをセットする](https://ja.react.dev/learn/state-a-components-memory)。
- コンポーネントのロジックはできるだけコンポーネントが返すJSXの中で表現する。何かを「変える」必要がある場合、通常はイベントハンドラで行う。最終手段として`useEffect`を使用する

一言で言えば、特殊なこと・テクニカルなことをせず**React哲学に忠実にコードを書きましょう**と解釈できます。つまり、哲学に従えばコンポーネントの純粋性は担保できます。

### よくある「純関数になっていない」例

#### 例1: レンダリング中に外部の変数を変更している

```typescript
// BAD：レンダリング中に外部の変数を変更している
let renderCount = 0;

type CounterProps = {
  count: number;
};

const Counter = ({ count }: CounterProps) => {
  renderCount++; // レンダリング中にコンポーネント外の変数を変更
  return <div>Count: {count}, Rendered: {renderCount} times</div>;
}
```

#### 例2: propsを直接変更している

```typescript
// BAD：propsを直接変更している
type Todo = {
  id: string;
  title: string;
  priority: number;
};

type TodoListProps = {
  todos: Todo[];
};

const TodoList = ({ todos }: TodoListProps) => {
  todos.sort((a, b) => a.priority - b.priority); // propsを直接変更
  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  );
}
```

#### 例3: レンダリング中にAPIを呼び出している

```typescript
// BAD：レンダリング中にAPIを呼び出している
type User = {
  name: string;
};

type UserProfileProps = {
  userId: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  // 型エラー：Promise<any> を User 型に代入できない
  const user: User = fetch(`/api/users/${userId}`).then(r => r.json()); // レンダリング中に副作用
  return <div>{user?.name}</div>;
}
```

### 純粋性の重要性

Reactの公式ドキュメントの冒頭には、以下のように書かれています：

> Reactはこのような概念に基づいて設計されています。**Reactは、あなたが書くすべてのコンポーネントが純関数であると仮定しています**。つまり、あなたが書くReactコンポーネントは、与えられた入力が同じであれば、常に同じJSXを返す必要があります。

純関数で書くことが前提なのです。

また、コンポーネントを「状態からUIへの変換器」として捉えると、UIの状態管理がシンプルになり、バグの予測や再現が容易になります。逆に言えば、純粋性を破ったコンポーネントは「いつ、何が起こるか分からない」不確定な動作をする可能性があり、Reactが提供する最適化の恩恵も受けられなくなってしまいます。

## まとめ

React哲学を守ることは、単に「ルールだから」という形式的なものではなく、Reactというライブラリの恩恵を最大限に受け、将来の進化にも耐えうる堅牢で予測可能なUIを構築するための最も合理的な方法です。

純関数を書くことには訓練が必要ですが、それによりReactパラダイムの威力が発揮されます。コンポーネントを純粋に保つことで、予測可能でバグりにくく、将来のReactの進化に乗り遅れない、そして変更に耐えうるアプリケーションを構築できます。

## 参考資料

- [React公式ドキュメント: コンポーネントを純粋に保つ](https://ja.react.dev/learn/keeping-components-pure)
- [uhyoさんの記事: Reactコンポーネントが「純粋である」とはどういうことか？　丁寧な解説](https://zenn.dev/uhyo/articles/react-pure-components)
