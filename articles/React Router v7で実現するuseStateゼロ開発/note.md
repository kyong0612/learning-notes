# React Router v7で実現するuseStateゼロ開発

ref: <https://zenn.dev/immedio/articles/1dedd5c1b9ee82>

## はじめに

年末にReact Router v7がリリースされました！
これによりWebフレームワークであるRemixと、ルーティングライブラリであるReact Routerが統合され、1つのプロジェクトとなりました。

## 純関数とは

純関数とは、隠れた入力や出力を持たない関数のことです。

### 純関数の例

```typescript
function add(a: number, b: number) {
  return a + b;
}
```

### 純関数でない例（隠れた入力）

```typescript
let i = 0;
function getUser(id: number) {
  i++;
  return i;
}
```

また、以下のようなケースも純関数ではありません。

```typescript
function getUser(id: number) {
  return userRepository.getUser(id);
}

function reserveMeeting() {
  slackService.notify("Meeting reserved");
}
```

純関数はプログラミング全般において推奨される考え方であり、テスタビリティの向上や予測可能性の向上につながります。

## フロントエンド開発の複雑性と副作用

フロントエンド開発では、非同期での状態変更やユーザー操作による変化が多く、それに伴う副作用の管理が課題となります。

さらに、状態のキャッシュやレンダリングの最適化などの影響で、常に最新の状態がレンダリングされるわけではありません。

### 状態管理の必要性の再考

多くのWebサービスでは、バックエンドから渡ってきたデータを表示し、フォームで更新するだけです。そのため、副作用を扱う必要が本当にあるのかを見直すことも重要です。

## 完全純粋コンポーネント開発の実践

React Router v7では、ほぼ純関数のみでアプリケーションを構築することが可能です。

### ルートコンポーネントと `loader` 関数

```typescript
export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),
  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),
] satisfies RouteConfig;
```

`loader` 関数から取得したデータを `props` 経由でコンポーネントに渡すことで、副作用のないコンポーネントを実現できます。

### `action` 関数

データの追加・削除・更新処理は `action` 関数を利用できます。

```typescript
export async function loader() {
  return await fakeDb.getUser();
}
export default function UserProfile({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{loaderData.name}</h1>
      <p>{loaderData.description}</p>
    </div>
  );
}
```

### パスパラメータやクエリパラメータによる状態の管理

ページネーションなどの状態管理は `useState` ではなく、クエリパラメータで表現できます。

```typescript
export function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  return { users: await fetchUsers(page) };
}
```

### `Nested Routes` によるページ分割

React Routerの `Nested Routes` を利用することで、ページの構造を整理し、複雑性を軽減できます。

```typescript
export default function UserPage() {
  return (
    <>
      <nav>
        <Link to="/user/profile">Profile</Link>
        <Link to="/user/account">Account</Link>
      </nav>
      <Outlet />
    </>
  );
}
```

### モーダルの `Route-based` 管理

`Nested Routes` を活用すれば、モーダルの開閉状態も `useState` なしで管理可能です。

```typescript
export default function UsersPage() {
  return (
    <>
      <Button asChild>
        <Link to="/users/new">New User</Link>
      </Button>
      <Outlet />
    </>
  );
}
```

## ルートコンポーネントのテスト

純関数ベースのコンポーネントは、テストが容易になります。

```typescript
export const Default = Template.bind({});
Default.args = {
  loaderData: {
    users: [userFactory()],
    page: 1,
  },
};
```

## まとめ

React Router v7を活用することで、副作用を抑えた純関数ベースの開発が可能になります。

- `loader` や `action` でデータを取得・更新
- クエリパラメータで状態管理
- `Nested Routes` を活用したコンポーネント分割
- `useState` を極力減らす

このアプローチを適用すれば、アプリケーションの品質向上が期待できます！
