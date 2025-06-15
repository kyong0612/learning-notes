---
title: "nuqs の Debounce 機能による URL パラメータ最適化"
source: "https://zenn.dev/tsuboi/articles/ae1d907c72d6e3"
author:
  - "Tsuboi"
published: 2024-06-12
created: 2025-01-15
description: |
  nuqs v2.5.0で導入されたDebounce機能について詳しく解説。検索フォームやフィルター機能で発生するURL更新のパフォーマンス問題を解決する方法を、実装例とベストプラクティスと共に紹介。limitUrlUpdatesオプションの使い方からReact TransitionsやThrottleとの使い分けまで包括的にカバー。
tags:
  - "nuqs"
  - "React"
  - "Next.js"
  - "TypeScript"
  - "debounce"
  - "URL state management"
  - "performance optimization"
---
24

5[tech](https://zenn.dev/tech-or-idea)

## はじめに 🚀

検索フォームやフィルター機能を実装する際、ユーザーの入力を URL パラメータに反映させることは、状態の永続化や共有可能な URL の生成において重要です。しかし、キー入力のたびに URL を更新すると、パフォーマンス問題を引き起こす可能性があります。また、 `history: 'push'` オプションを使用している場合は履歴の肥大化も発生します。

**nuqs v2.5.0** で導入された Debounce 機能は、この問題に対する解決策を提供します。本機能は [PR #900](https://github.com/47ng/nuqs/pull/900) で実装され、 `limitUrlUpdates` オプションとして提供されています。これにより、開発者は URL 更新のタイミングを細かく制御できるようになりました。

また筆者は過去に nuqs に関する記事を書いています。そちらもあわせてご覧ください。

## 1\. Debounce と Throttle の基本概念 ⏱️

Debounce と Throttle は開発者がよく混同する概念ですが、それぞれ異なる効果を持つため、適切に使い分けることが重要です。

以下の記事を参考にして、Debounce と Throttle の違いを理解しましょう。

### Debounce

**Debounce** は、連続したイベントが発生した際に、 **最後のイベントから一定時間経過後に 1 回だけ処理を実行する** 仕組みです。

作者の Kettanaito 氏は、Debounce を「過負荷のウェイター（overloaded waiter）」に例えています：注文を続けている間、ウェイターはあなたの要求を無視し、注文が止まってから少し時間をおいて最後の注文だけを処理します。

```typescript
// Debounceの動作イメージ
// キー入力: H -> E -> L -> L -> O
//
// イベント発生:   H  E  L  L  O  （5回発生）
// 処理実行:                    O  （最後の1回のみ実行）
//                           ↑
//                      500ms後に実行
//
// 継続的に入力がある場合:
// キー入力: H -> E -> L -> L -> O -> W -> O -> R -> L -> D
// 処理実行:                                           D
//                                                 ↑
//                                            最後から500ms後
```

### Throttle

**Throttle** は、一定時間内に **最大 1 回だけ処理を実行する** 仕組みです。

Kettanaito 氏は、Throttle を「バネ仕掛けのボールマシン」に例えています：ボールを投げた後、バネが元に戻るまでの時間が必要で、その間は新しいボールを投げることができません。

```typescript
// Throttleの動作イメージ
// 連続クリック: ● ● ● ● ● ● ● ● ● ●
//
// イベント発生: ● ● ● ● ● ● ● ● ● ● （10回発生）
// 処理実行:     ●     ●     ●     ● （一定間隔で実行）
//              └─500ms─┴─500ms─┴─500ms─┘
//
// タイムライン表示:
// 0ms    100ms  200ms  300ms  400ms  500ms  600ms  700ms  800ms
// │      │      │      │      │      │      │      │      │
// ●●●●●  ●●●    ●●     ●      ●●●    ●●     ●●●    ●      ●
// ↓                            ↓                            ↓
// 実行                         実行                         実行
```

## 2\. nuqs の Debounce 機能の仕組み 🛠️

Debounce 機能は、 `limitUrlUpdates` オプションを通じて実現されています。この機能により、開発者は URL 更新のタイミングを細かく制御できるようになります。

## 2-1. なぜ URL パラメータに Debounce が必要なのか

実際のアプリケーションで発生する問題を具体的に見てみましょう。検索フォームの実装では頻繁な URL 更新が問題になります：

```tsx
// ❌ Debounce なしの問題のある実装
function SearchPage() {
  const [query] = useQueryState('q');

  // ユーザーが "hello world" と入力すると...
  // URL: /?q=h → /?q=he → /?q=hel → ... → /?q=hello%20world
  // 各キーストロークで URL が更新される！

  return (
    <div>
      <input
        value={query || ''}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* 各キーストロークでAPIリクエストが発生 */}
      <SearchResults query={query} />
    </div>
  );
}
```

この実装では以下の深刻な問題が発生します：

1. **API レート制限への抵触**: 秒間数十回のリクエストが発生
2. **ブラウザのパフォーマンス低下**: URL 更新処理による CPU 負荷
3. **ネットワーク帯域の無駄遣い**: 不要なリクエストによるトラフィック増加
4. **履歴管理の複雑化**: `history: 'push'` を使用している場合、大量の履歴エントリが作成される（そのため検索入力にはデフォルトの `history: 'replace'` を使用すべき）

### Throttle では解決できない理由

Kettanaito 氏の記事でも触れられているように、Throttle は「一貫した更新」が必要な場合に適していますが、検索入力では最終的な値のみが重要です：

```typescript
// ❌ Throttle を使った場合の問題
// ユーザーが "hello world" と素早く入力
//
// Throttle(200ms)の場合:
// 0ms: "hel" → URL更新
// 200ms: "hello w" → URL更新
// 400ms: "hello world" → URL更新
//
// 中間状態の "hel" や "hello w" での検索は不要！
```

## 2-2. nuqs の Debounce/Throttle ソリューション

nuqs v2.5.0 では、 `limitUrlUpdates` オプションと `debounce` / `throttle` 関数を組み合わせることで、簡単に debounce を実装できます：

```tsx
import { debounce } from 'nuqs';

// ✅ Debounce ありの実装
const SearchForm: React.FC = () => {
  const [search, setSearch] = useQueryState('q', {
    limitUrlUpdates: debounce(500), // 500ms の debounce
  });

  return (
    <input
      value={search || ''}
      onChange={(e) => setSearch(e.target.value)}
      placeholder='検索...'
    />
  );
};

// ✅ より柔軟な実装（条件付きdebounce）
const AdvancedSearchForm: React.FC = () => {
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      shallow: false
    })
  );

  return (
    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value, {
          // 空文字列の場合は即座に更新、それ以外は500msのdebounce
          limitUrlUpdates: e.target.value === '' ? undefined : debounce(500),
        })
      }
      placeholder='検索...'
    />
  );
};

// ✅ Throttle の実装例
import { throttle } from 'nuqs';

const SliderComponent: React.FC = () => {
  const [value, setValue] = useQueryState('slider', {
    limitUrlUpdates: throttle(100), // 100msごとに最大1回更新
  });

  return (
    <input
      type="range"
      value={value || 0}
      onChange={(e) => setValue(e.target.value)}
      min={0}
      max={100}
    />
  );
};
```

### 内部的な動作メカニズム

nuqs の Debounce/Throttle は、内部的にキューシステムを使用しています。その動作メカニズムを詳しく見てみます。

#### 核心となる最適化技術

**1\. AbortController による Promise キャンセル制御**

従来の `setTimeout` + `clearTimeout` パターンではなく、 `AbortController` を使用してキャンセル可能なタイマーを実現しています：

```typescript
// timeout 関数の実装
const timeout = (ms: number, signal?: AbortSignal) => {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};

class DebouncedQueue {
  private controller = new AbortController();

  push(value: T) {
    // 前回のタイマーをキャンセル
    this.controller.abort();
    this.controller = new AbortController();

    // AbortSignal を使ってキャンセル可能なタイマーを作成
    timeout(delay, this.controller.signal)
      .then(() => this.execute())
      .catch((error) => {
        // AbortError は正常なキャンセルなので無視
        if (error.name !== 'AbortError') throw error;
      });
  }
}
```

**利点：**

- **確実なキャンセル**: Promise ベースでキャンセルが確実に行われる
- **メモリリーク防止**: コンポーネントのアンマウント時に確実にクリーンアップ
- **デバッグ容易性**: AbortError により中断理由が明確

**2\. Deferred パターンによる Promise 制御**

`Promise.withResolvers()` の代わりに、 `createDeferred()` という独自実装を使用してPromiseの外部制御を実現しています：

```typescript
// Promise の resolve/reject を外部から制御可能にする
function createDeferred<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
}

class DebouncedQueue {
  push(value: T): Promise<T> {
    const deferred = createDeferred<T>();
    this.promise = deferred.promise;
    this.resolve = deferred.resolve;

    // 遅延実行後にPromiseを解決
    timeout(delay, this.controller.signal)
      .then(() => {
        this.callback(value);
        this.resolve(value); // 外部からresolve
      });

    return this.promise; // 呼び出し元はawaitできる
  }
}
```

**3\. パラメータ名ごとの独立したキュー管理**

`DebounceController` により、各パラメータ名（key）に対して独立したキューを管理します：

```typescript
class DebounceController {
  // 各パラメータ名（key）に対して独立したキューを持つ
  private readonly queues = new Map<Key, DebouncedQueue<Value>>();

  getOrCreateQueue<T>(key: string, callback: (value: T) => void, delay: number) {
    const queue = this.queues.get(key) ?? new DebouncedQueue(callback, delay);
    this.queues.set(key, queue);
    return queue;
  }
}
```

#### 実現される最適化

この設計により、以下の最適化が実現されています：

1. **最新値の保持** ：複数の更新が発生した場合、最新の値のみを処理
2. **UI の応答性維持** ：入力フィールドは即座に更新され、URL更新のみが制御される
3. **確実なクリーンアップ** ：AbortController によるメモリリーク防止
4. **独立したキュー管理** ：各 URL パラメータが独立して debounce 制御される
5. **型安全性**: TypeScript の型推論により実行時エラーを防止

## 3\. nuqs の Debounce を活用した実装パターンと活用例 🛠️

`limitUrlUpdates` オプションにより、さまざまなユースケースに対応できるようになりました。ここでは、実際のアプリケーションでよく見られるパターンを紹介します。

## 3-1. 検索フォームでの実装

### 手動 debounce の問題点

```tsx
export function SearchInput({ className }: Props) {
  const [{ search }, setSearchParams] = useQueryState(
    'search',
    parseAsString.withOptions({
      clearOnDefault: true,
      history: 'replace',
    })
  );
  const [inputValue, setInputValue] = useState(search);

  // debounce 関数を使用した検索処理
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        void setSearchParams({ search: value });
      }, 500),
    [setSearchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // 即座に UI を更新
    debouncedSearch(value); // debounce された URL 更新
  };

  return (
    <>
      <input
        type="search"
        placeholder="検索ワード"
        value={inputValue || ''}
        onChange={handleSearch}
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => {
            setInputValue('');
            debouncedSearch('');
          }}
        >

        </button>
      )}
    </>
  );
}
```

手動 debounce の実装

```typescript
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    // 既存のタイマーをクリア（重要！）
    clearTimeout(timeoutId);

    // 新しいタイマーを設定
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// 使用例：検索ボックス
const handleSearch = debounce((query: string) => {
  console.log('検索実行:', query);
  // APIリクエストなど
}, 500);

// ユーザーが "hello" と入力:
// h -> handleSearch('h') // タイマー設定
// e -> handleSearch('he') // 前のタイマーをクリア、新しいタイマー設定
// l -> handleSearch('hel') // 前のタイマーをクリア、新しいタイマー設定
// l -> handleSearch('hell') // 前のタイマーをクリア、新しいタイマー設定
// o -> handleSearch('hello') // 前のタイマーをクリア、新しいタイマー設定
// ...500ms経過...
// → '検索実行: hello' （最終的に1回だけ実行）
```

この実装には以下の問題がありました：

1. **状態の二重管理**: `search` と `inputValue` を別々に管理する必要がある
2. **タイマー管理の複雑さ**: `useRef` でタイマーを管理し、クリーンアップを意識する必要がある
3. **コード量の増大**: debounce ロジックのために多くのボイラープレートコードが必要
4. **メモリリークの可能性**: コンポーネントのアンマウント時にタイマーが残る可能性

またコード内だと他に、コンポーネントのアンマウント時のクリーンアップ処理が必要として、debounce 関数内の timeout をクリアする必要がありますが、一般的な debounce 実装ではこのアクセスが困難だったりと問題があります。

### nuqs の Debounce 機能を活用

先程の手動 debounce の実装を nuqs の Debounce 機能を活用して実装してみます。

```tsx
import { useQueryState, parseAsString, debounce } from 'nuqs';

export function SearchInput({ className }: Props) {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withOptions({
      clearOnDefault: true, // デフォルト値の場合はURLから削除
      history: 'replace', // 履歴を置き換え
      limitUrlUpdates: debounce(500) // 500ms の debounce
    })
  );

  return (
    <>
      <input
        type="search"
        placeholder="検索ワード"
        value={search || ''}
        onChange={(e) =>
          setSearch(e.target.value || null)
        }
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch(null)}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </>
  );
}
```

これにより、手動の debounce ロジックが不要になりコード量が削減され、 `inputValue` の別管理が不要で状態管理が簡素化され、nuqs の型システムを活用することで型安全性が向上することです。

## 3-2. 複数フィルターでの最適化

複数のフィルター条件を扱う場合、それぞれに適切な debounce 時間を設定できます：

```tsx
import { useQueryStates, parseAsString, parseAsInteger, debounce } from 'nuqs';

export const filterParsers = {
  search: parseAsString,
  category: parseAsString,
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  sortBy: parseAsString,
};

export function ProductFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'push',
    clearOnDefault: true, // デフォルト値の場合はURLから削除
  });

  return (
    <div className='filters-container'>
      {/* 検索入力 - 500ms debounce */}
      <input
        type='search'
        value={filters.search || ''}
        onChange={(e) =>
          setFilters(
            { search: e.target.value || null },
            { limitUrlUpdates: debounce(500) }
          )
        }
        placeholder='商品を検索...'
      />

      {/* カテゴリ選択 - 即座に反映 */}
      <select
        value={filters.category || ''}
        onChange={(e) => setFilters({ category: e.target.value || null })}
      >
        <option value=''>すべてのカテゴリ</option>
        <option value='categoryA'>カテゴリA</option>
        <option value='categoryB'>カテゴリB</option>
      </select>

      {/* 価格範囲 - 1000ms debounce */}
      <div className='price-range'>
        <input
          type='number'
          value={filters.minPrice || ''}
          onChange={(e) =>
            setFilters(
              { minPrice: e.target.value ? parseInt(e.target.value) : null },
              { limitUrlUpdates: debounce(1000) }
            )
          }
          placeholder='最低価格'
        />
        <span>〜</span>
        <input
          type='number'
          value={filters.maxPrice || ''}
          onChange={(e) =>
            setFilters(
              { maxPrice: e.target.value ? parseInt(e.target.value) : null },
              { limitUrlUpdates: debounce(1000) }
            )
          }
          placeholder='最高価格'
        />
      </div>
    </div>
  );
}
```

## 4\. 最適化テクニックとベストプラクティス 🎯

## 4-1. DebounceとThrottleの使用指針

### 実践的な判断基準

- **「最後の状態だけが重要」ならDebounce** （検索、バリデーション、リサイズ完了後の処理）
- **「継続的なフィードバックが必要」ならThrottle** （スクロール、マウス移動、リアルタイム更新）
- **「単純なUI状態変更」なら適用不要** （チェックボックス、基本的なトグル）

### 用途別推奨

| 推奨手法 | 遅延時間 | 用途 | 効果・理由 |
| --- | --- | --- | --- |
| Debounce | 200-300ms | **検索・オートコンプリート** | • API呼び出しを最大90%削減   • タイピング完了を待つ |
| Throttle | 100-250ms | **価格フィルター・スライダー** | • リアルタイムフィードバック   • パフォーマンスのバランス |
| Debounce | 400-500ms | **リアルタイムバリデーション** | • 入力中のエラー表示を防止   • ユーザー体験向上 |
| 通常不要 | 100-200ms（必要時） | **チェックボックス・トグル** | • 単純なUI変更   • 即座の反応が期待される |
| Throttle | 200ms推奨 | **無限スクロール** | • 一定間隔でスクロール位置をチェック   • 過度な処理防止 |
| Debounce | 200-450ms | **ウィンドウリサイズ** | • レイアウト再計算は完了後に一度だけ   • パフォーマンス向上 |
| Throttle | 16ms/100ms | **スクロールイベント** | • 滑らかなアニメーション   • 適度な応答性 |
| Throttle | 16-50ms | **マウス移動・ホバー** | • 滑らかな追従   • 過度なイベント発火防止 |

### 参考資料

- [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle) - 視覚的な理解に最適
- [The Doherty Threshold](https://lawsofux.com/doherty-threshold/) - 応答時間とユーザー体験の関係
- [Human-Computer Interaction Guidelines](https://www.nngroup.com/articles/response-times-3-important-limits/) - Nielsen Norman Groupによる応答時間の研究
- [Web Performance Best Practices](https://web.dev/performance/) - Google Web.devのパフォーマンス指針

## 4-2. Transitions との統合

`shallow: false` と組み合わせることで、React の `useTransition` フックを使用して、サーバーが URL の更新でサーバーコンポーネントを再レンダリングしている間のローディング状態を取得できます：

```tsx
'use client';

import { useTransition } from 'react';
import { useQueryState, parseAsString } from 'nuqs';

function ClientComponent({ data }) {
  // 1. useTransition フックを提供
  const [isLoading, startTransition] = useTransition();
  const [query, setQuery] = useQueryState(
    'query',
    // 2. startTransition をオプションとして渡し、shallow を false にすることで、サーバーに通知することができるようになる
    parseAsString().withOptions({ startTransition, shallow: false })
  );
  // 3. \`isLoading\` はサーバーが再レンダリング中にtrueになる

  // ローディング状態の表示
  if (isLoading) return <div>Loading...</div>;

  // 通常のレンダリング
  return <div>...</div>;
}
```

### debounce と startTransition の組み合わせ

debounce と startTransition を同時に使用することも可能です：

```tsx
const [isPending, startTransition] = useTransition();
const [query, setQuery] = useQueryState(
  'query',
  parseAsString().withOptions({
    startTransition,
    shallow: false
  })
);

const handleSearch = (value: string) => {
  setQuery(value, {
    limitUrlUpdates: debounce(500)
  });
};

<>
  <input
    value={localValue}
    onChange={(e) => handleSearch(e.target.value)}
    className={clsx(
      'search-input',
      isPending && 'border-blue-300 bg-blue-50'
    )}
  />

  {isPending && (
    <div className="text-sm text-blue-600 mt-1">
      検索中...
    </div>
  )}
</>
```

## 4-3. 履歴管理の最適化戦略

デフォルトでは、状態更新は現在の履歴エントリを **置き換え** （ `history: 'replace'` ）ます。これは `git squash` のようなもので、すべての状態変更が単一の履歴エントリにマージされます。

各状態変更で新しい履歴エントリを **追加** （ `history: 'push'` ）することもできます：

```tsx
export function useOptimizedSearch() {
  // パターン1: 置き換え型（履歴を増やさない）
  const [instantSearch, setInstantSearch] = useQueryState('instant', {
    limitUrlUpdates: debounce(300),
    history: 'replace', // 履歴を置き換え
    shallow: false,
    scroll: false, // スクロール位置を維持
  });

  // パターン2: 追加型（重要な検索は履歴に残す）
  const [importantSearch, setImportantSearch] = useQueryState('important', {
    limitUrlUpdates: debounce(1000),
    history: 'push', // 履歴に追加
    shallow: false,
    scroll: true, // ページトップにスクロール
  });

  // パターン3: 条件付き履歴（検索実行時のみ履歴に追加）
  const executeSearch = (query: string) => {
    if (query.length >= 3) {
      // 3文字以上の場合のみ履歴に追加
      setImportantSearch(query);
    } else {
      setInstantSearch(query);
    }
  };

  return { instantSearch, importantSearch, executeSearch };
}
```

⚠️ **注意**: ブラウザの戻るボタンを乱用すると、UX が損なわれる可能性があります。 `history: 'push'` は、タブやモーダルなどのナビゲーション的な体験に寄与するパラメータのみに使用することを推奨します。

## まとめ 📌

本記事では、nuqs v2.5.0 で導入された Debounce 機能について解説しました。

nuqs の Debounce 機能は、特に `limitUrlUpdates` オプションによって、これらの問題を効果的に解決します。 `debounce()` や `throttle()` 関数を使った制御により、URL 更新のタイミングを細かく制御できるようになりました。

以上です！

24

5
