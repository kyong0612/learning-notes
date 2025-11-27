---
title: "React Router 7: Nested Routes"
source: "https://www.robinwieruch.de/react-router-nested-routes/"
author:
  - "[[Robin Wieruch]]"
published: 2025-01-06
created: 2025-11-27
description: "React Router 7でNested Routes（入れ子ルート）を実装する方法を解説したチュートリアル。ページ全体を置き換えるのではなく、タブのようにURLに基づいて特定のビューのフラグメントを交換する方法、Outletコンポーネントの使用、動的なNested Routesの実装方法を学べる。"
tags:
  - react
  - react-router
  - routing
  - nested-routes
  - frontend
---

## 概要

React Router 7を使用してNested Routes（入れ子ルート）を実装する方法を解説したチュートリアル。Nested Routesは、URLに基づいてページ全体ではなく特定のビュー部分のみを交換できる強力な機能である。

**サンプルコード**: [GitHub Repository](https://github.com/rwieruch/examples/tree/main/react-router-nested-routes)

## Nested Routesとは

多くの人がReact Routerはページ間のルーティングのみと考えがちだが、実際には**現在のルートに基づいて特定のビューのフラグメントを交換する**こともできる。

### ユースケース例

- ユーザーページで複数のタブ（Profile、Account）を表示
- タブをクリックするとURLは変わるが、ページ全体ではなくタブのコンテンツのみが置き換わる

![nested routes react router](/static/6d39a0ec2530d6768d1461e5a067735e/2bef9/nested-routes-react-router.png)

## 基本的な実装

### Step 1: 基本構造

```tsx
import { Routes, Route, Link } from 'react-router';

const App = () => {
  return (
    <>
      <h1>React Router</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="user" element={<User />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};
```

- **Index Route**: `/` にマッチし、Homeコンポーネントを表示
- **No Match Route**: `*` で定義され、マッチしないルートのフォールバック

### Step 2: Nested Routeのナビゲーション追加

```tsx
const User = () => {
  return (
    <>
      <h1>User</h1>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="account">Account</Link>
      </nav>
    </>
  );
};
```

**ポイント**: 相対パス（`profile`、`account`）を使用することで、親ルート（`/user`）に自動的に追加される（例：`/user/profile`）。

### Step 3: Nested Routeの定義

```tsx
const App = () => {
  return (
    <>
      <h1>React Router</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="user" element={<User />}>
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};
```

RouteコンポーネントとLinkコンポーネントは1対1（実際には1対多）の関係でマッピングされる。

### Step 4: Outletコンポーネントの使用

**重要**: Nested Routeを表示するには`Outlet`コンポーネントが必須。

```tsx
import { Routes, Route, Link, Outlet } from 'react-router';

const User = () => {
  return (
    <>
      <h1>User</h1>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="account">Account</Link>
      </nav>
      <Outlet />
    </>
  );
};
```

`Outlet`コンポーネントは、親のRoutesコンポーネントのRouteコレクションから、マッチする子ルートとそのコンポーネントをレンダリングする。

![react router nested routes outlet](/static/d44bf2bc886e61bd01954641e1b589e3/2bef9/react-router-nested-routes-outlet.png)

### Step 5: Index RouteとNo Match Routeの追加

```tsx
const App = () => {
  return (
    <>
      <h1>React Router</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="user" element={<User />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};
```

**動作**:

- `/user` → Profileコンポーネント（Index Route）
- `/user/profile` → Profileコンポーネント
- `/user/account` → Accountコンポーネント
- `/user/settings` → NoMatchコンポーネント

## 動的Nested Routes

識別子に基づいて動的にルーティングする方法（例：`/users/1`でID=1のユーザーを表示）。

### Step 1: ユーザーリストの定義

```tsx
const App = () => {
  const users = [
    { id: '1', fullName: 'Robin Wieruch' },
    { id: '2', fullName: 'Sarah Finnley' },
  ];

  return (
    <>
      <h1>React Router</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="users" element={<Users users={users} />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};
```

### Step 2: Usersコンポーネント（リスト表示）

```tsx
type UsersProps = {
  users: {
    id: string;
    fullName: string;
  }[];
};

const Users = ({ users }: UsersProps) => {
  return (
    <>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={user.id}>{user.fullName}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
```

### Step 3: 動的ルートの定義

```tsx
const App = () => {
  const users = [...];

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="users" element={<Users users={users} />}>
        <Route path=":userId" element={<User />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};
```

**ポイント**: `:userId`のようにコロンを使用して動的ルートを定義。ID=1のユーザーは`/users/1`にマッチする。

### Step 4: Outletの追加とuseParamsの使用

```tsx
import { Routes, Route, Link, Outlet, useParams } from 'react-router';

const Users = ({ users }: UsersProps) => {
  return (
    <>
      <h2>Users</h2>
      <ul>...</ul>
      <Outlet />
    </>
  );
};

const User = () => {
  const { userId } = useParams();

  return (
    <>
      <h2>User: {userId}</h2>
      <Link to="/users">Back to Users</Link>
    </>
  );
};
```

`useParams` Hookを使用してURLから動的パラメータ（`:userId`）を取得できる。

## 重要なポイントまとめ

| 概念 | 説明 |
|------|------|
| **Nested Routes** | RouteコンポーネントをRouteコンポーネント内にネストして定義 |
| **Outlet** | 親コンポーネントで子ルートをレンダリングするために必須 |
| **相対パス** | Linkで親ルートを基準とした相対パスを使用可能 |
| **動的ルート** | `:param`構文で動的パラメータを定義 |
| **useParams** | URLから動的パラメータを取得するHook |
| **Index Route** | ルートが正確にマッチした時のデフォルトルート |
| **No Match Route** | `*`でマッチしないルートのフォールバック |

## 結論

Nested Routesを使用することで、ユーザーエクスペリエンスを大幅に向上させることができる。ユーザーはアプリケーションの非常に特定の部分にアクセスでき、それらをURLとして共有することも可能になる。

## 関連記事

- [React Router 7 Introduction](https://www.robinwieruch.de/react-router/)
- [React Router 7: Authentication](https://www.robinwieruch.de/react-router-authentication/)
- [React Router 7: Redirect](https://www.robinwieruch.de/react-router-redirect/)
- [Descendant Routes with React Router](https://www.robinwieruch.de/react-router-descendant-routes/)
