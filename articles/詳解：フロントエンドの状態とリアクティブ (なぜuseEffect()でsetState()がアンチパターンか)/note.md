# 詳解：フロントエンドの状態とリアクティブ (なぜuseEffect()でsetState()がアンチパターンか)

ref: <https://zenn.dev/layerx/articles/22dd45dc69a57c>

## 背景

- フロントエンド開発では、状態管理が重要である一方、バグの温床になりやすい。
- ReactやVueなどのフレームワークは「リアクティブ」な設計を導入し、この課題に対応してきた。

## 主張

計算される状態 (Derived State) を式で表現する重要性

- 状態間の依存関係を宣言的に表現することが重要。
- 手動での状態更新を減らすことで、コードの安全性と保守性を向上。

## なぜuseEffect()やwatch()で状態更新がアンチパターンなのか

useEffect()やwatch()を用いた状態更新は以下の問題がある：

- 状態の同期が難しくなり、バグが発生しやすい。
- 条件や中身をすべて確認しないと正しい値を保証できない。

### React の例

```tsx
// Not good: React
const [users, setUsers] = useState([]);
const { data, isLoaded } = useUsers();

useEffect(() => {
    setUsers(data.map(...));
}, [isLoaded]);
```

### Vue の例

```tsx
// Not good: Vue
const users = ref([]);
const { data, isLoaded } = useUsers();

watch(isLoaded, () => {
    users.value = data.map(...);
});
```

## 良い実装の例

### React の例

```tsx
// Better: React
const { data, isLoaded } = useUsers();
const users = useMemo(() => data.map(...), [isLoaded]);
```

### Vue の例

```tsx
// Better: Vue
const { data, isLoaded } = useUsers();
const users = computed(() => data.map(...));
```

## リアクティブな設計の利点

- 状態の同期やタイミングを意識せず、正しい値を保証できる。
- 冪等性（何度実行しても同じ結果が得られる）を確保。

### 具体例

- フォーム入力と状態管理

悪い例

手続き的に実装すると、以下のように複雑になる：

```tsx
let bodyField = document.querySelector("#bodyField");
let scheduleCheckbox = document.querySelector("#scheduleCheckbox");
let dateField = document.querySelector("#dateField");
let submitButton = document.querySelector("#submitButton");

function updateSubmitDisabled() {
    submitButton.disabled = bodyField.value.length === 0 ||
        (scheduleCheckbox.checked && dateField.value.length === 0);
}

bodyField.addEventListener("input", updateSubmitDisabled);
scheduleCheckbox.addEventListener("change", updateSubmitDisabled);
dateField.addEventListener("input", updateSubmitDisabled);
```

良い例

リアクティブ設計を取り入れる：

```tsx
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

const bodyFieldValue = /*Observable for body field */;
const scheduleCheckboxChecked = /* Observable for checkbox */;
const dateFieldValue = /* Observable for date field*/;

const disabled = combineLatest([bodyFieldValue, scheduleCheckboxChecked, dateFieldValue]).pipe(
    map(([body, schedule, date]) =>
        body.length === 0 || (schedule && date.length === 0)
    )
);

disabled.subscribe(value => {
    submitButton.disabled = value;
});
```

## ReactとVueのアプローチ

React のアプローチ

1. コンポーネント関数を純粋関数として設計。
2. useState()やuseEffect()で状態を参照する際、依存関係を明示。
3. Virtual DOMを使用して、DOM操作を冪等に。

### React の実装例

```tsx
function ArticleForm() {
    const [body, setBody] = useState("");
    const [scheduled, setScheduled] = useState(false);
    const [date, setDate] = useState("");

    const disabled = body.length === 0 || (scheduled && date.length === 0);

    return (
        <form>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} />
            <input type="checkbox" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button disabled={disabled}>Submit</button>
        </form>
    );
}
```

Vue のアプローチ

1. Refやcomputedを活用してリアクティブ性を提供。
2. 再計算をライブラリが自動管理する。

Vue の実装例

```tsx
import { ref, computed } from "vue";

export default {
    setup() {
        const body = ref("");
        const scheduled = ref(false);
        const date = ref("");

        const disabled = computed(() => body.value.length === 0 || 
            (scheduled.value && date.value.length === 0)
        );

        return { body, scheduled, date, disabled };
    }
};
```

## ベストプラクティス

1. 計算される値は状態ではなく式で表現する。
   - 状態間の依存関係をコード内で明確に記述する。
2. 手続き的な更新を避ける。
   - 外部からのデータやURLもリアクティブに扱う。
3. 必要な場合を除きuseState()を避ける。
   - 例えば、初期値設定のみに状態が必要な場合のみ使用。

## まとめ

- フロントエンド開発では、状態間の依存関係を明示し、手続き的な状態更新を避けることが重要。
- リアクティブ設計は、フロントエンド開発における「シートベルト」として機能し、安全性と保守性を向上させる。
