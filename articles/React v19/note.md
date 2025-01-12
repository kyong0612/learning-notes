# React v19

ref: <https://react.dev/blog/2024/12/05/react-19>

以下は、Markdown形式でまとめたReact v19の新機能と改善点の説明です。コピペしてご利用いただけます。

React v19 の新機能と改善点

## 1. Actions 機能

目的: 非同期処理（例: フォーム送信やデータ更新）を簡単に管理。

これまで、非同期処理を扱う場合、手動でペンディング状態やエラーを管理し、ユーザーに適切なフィードバックを返す必要がありました。しかし、React v19では、新しい「Actions」機能でこれを簡素化しています。

例: フォームで名前を更新するコードの変化

- 従来: 状態管理を手動で行う必要がありました。

```tsx
function UpdateName() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name); // サーバーにリクエストを送信
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

- React v19: useTransitionを使うことでペンディング状態が自動管理されます。

```tsx
function UpdateName() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    });
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

## 2. 楽観的更新を簡単にする useOptimistic

目的: 非同期処理中に即時フィードバックを表示。

例えば、名前を変更する場合、リクエスト完了を待たずに、ユーザーが入力した名前をすぐに表示する「楽観的更新」が可能です。

例: 楽観的更新の実装

```tsx
function ChangeName({ currentName, onUpdateName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async (formData) => {
    const newName = formData.get("name");
    setOptimisticName(newName); // 即座に名前を更新
    const updatedName = await updateName(newName); // サーバーで更新処理
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <input type="text" name="name" disabled={currentName !== optimisticName} />
    </form>
  );
}
```

新しいAPIと機能改善

## 3. use API

目的: 非同期データの読み込みを簡素化。

React v19では、新しいuse APIを使うと、Promiseをレンダリング中に読み込むことができます。

例: コメントデータを取得して表示

```tsx
import { use } from 'react';

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise); // Promise解決後にデータ取得
  return comments.map(comment => <p key={comment.id}>{comment.text}</p>);
}
```

## 4. <form> での自動処理

目的: フォーム送信とその状態管理を簡素化。

新しい<form>のactionプロパティに関数を渡すだけで、データ送信後の状態管理が自動化されます。

パフォーマンスと開発効率の向上

## 5. スタイルシートの優先順位設定

目的: スタイルシートの読み込み順序を管理して、描画のタイミングを最適化。

React v19では、<link>要素にprecedence属性を追加することで、スタイルシートの読み込み順序を調整できます。

例: 優先順位の設定

```tsx
<link rel="stylesheet" href="foo.css" precedence="default" />
<link rel="stylesheet" href="bar.css" precedence="high" />
```

## 6. ドキュメントメタデータのサポート

目的: <title>や<meta>タグをReactコンポーネント内で簡単に管理。

Reactコンポーネントの中でメタデータを定義し、それをHTMLの<head>タグに自動で適用できます。

```tsx
function BlogPost({ title, keywords }) {
  return (
    <>
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
    </>
  );
}
```

## その他の改善点

1. refの改善: プロパティとして使用可能になり、クリーンアップ処理も簡単に。
2. エラーログの改善: 開発者向けにエラーメッセージがより詳細で直感的に。
3. サーバーコンポーネント: サーバーでレンダリングすることで、クライアント側の負荷を軽減。

React v19 の特徴的なポイント

- 非同期処理の負担を軽減し、コードを簡潔に。
- 開発者体験の向上を重視したエラーログや改善点。
- パフォーマンスの最適化に重点を置いた新機能。
