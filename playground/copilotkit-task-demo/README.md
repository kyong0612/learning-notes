# CopilotKitを使ったAIタスク管理アプリ

このアプリでは、CopilotKitを活用して自然言語でタスクの作成や管理ができます。主な機能と実装ポイントを解説します。

## 主な機能

1. **基本的なタスク管理**
   - タスクの追加、編集、削除、完了/未完了のトグル
   - 優先度（高、中、低）や期限の設定
   - 完了/未完了タスクの表示フィルタリング

2. **AIアシスタント連携**
   - チャットベースのAIアシスタントを統合
   - 自然言語でのタスク操作（例：「明日までに企画書を完成させるタスクを追加して」）
   - タスク検索や優先度でのフィルタリングをAIに依頼可能

## CopilotKit実装のポイント

### 1. CopilotKitの基本設定（layout.tsx）

```jsx
<CopilotKit apiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY || "YOUR_API_KEY_HERE"}>
  {children}
  <CopilotPopup
    defaultOpen={false}
    poweredByText="Powered by CopilotKit"
    tooltip="タスク管理AIアシスタント"
    placeholder="タスクについて質問したり、新しいタスクを追加したりできます..."
  />
</CopilotKit>
```

### 2. アプリケーションデータの共有（page.tsx）

```jsx
// CopilotKitにタスク一覧を共有
useCopilotReadable({
  description: "現在のタスク一覧。各タスクにはid, title, description, dueDate, priority, completed, createdAtの属性がある",
  value: tasks,
});
```

### 3. AIアクションの定義

```jsx
// タスク追加アクション
useCopilotAction({
  name: "addNewTask",
  description: "新しいタスクを追加する",
  parameters: [
    { name: "title", type: "string", description: "タスクのタイトル", required: true },
    // 他のパラメータ...
  ],
  handler: ({ title, description, dueDate, priority }) => {
    // タスク追加の実装
    const newTask = addTask({...});
    return { success: true, taskId: newTask.id, message: `"${title}"というタスクを追加しました` };
  }
});
```

## セットアップ方法

1. Next.jsプロジェクトを作成
2. 必要なパッケージをインストール
3. `.env.local`ファイルにCopilotKitのAPIキーを設定
4. 適切なフォルダ構造に各ファイルを配置
5. `pnpm run dev`でアプリを起動

## AIアシスタントの使い方

アプリケーションの右下に表示されるCopilotKitアイコンをクリックしてAIアシスタントを開き、以下のような指示を試してみてください：

- 「明日までに企画書を提出するタスクを追加して」
- 「高優先度のタスクを一覧表示して」
- 「○○というタスクを完了にして」
- 「次の週までの締め切りがあるタスクは？」

## このデモでのCopilotKitの活用ポイント

1. **データコンテキスト共有**: アプリのタスクデータをAIと共有
2. **アクション定義**: 自然言語からタスク操作アクションへの変換
3. **UI統合**: シンプルなポップアップUIでアプリに自然に統合
4. **ユーザー支援**: 複雑なUIの操作をAIに依頼することで、ユーザーの負担を軽減
  