# Cline VS Code 拡張機能におけるコンテキストウィンドウの管理

ref: <https://claude.ai/share/f3bfbccc-76e7-4692-971a-bf23a515c411>

## コアコンテキスト管理コンポーネント

Cline VS Code 拡張機能は、以下の主要コンポーネントを通じて構造化されたアプローチでコンテキストウィンドウを管理しています：

1. **ContextManagerクラス**：`src/core/context-management/ContextManager.ts`に位置する、コンテキストウィンドウ管理の主要コンポーネント。

2. **エラー検出**：`context-error-handling.ts`における特殊なエラー検出機能は、異なるAIプロバイダーからのコンテキストウィンドウエラーを識別します。

3. **Clineコアとの統合**：メインの`Cline.ts`ファイルは、APIリクエストとエラー処理メカニズムにコンテキスト管理を統合しています。

## コンテキストウィンドウ管理戦略

### 先行的なモニタリングと切り捨て

ContextManagerはコンテキストウィンドウのオーバーフローを防ぐための洗練されたアプローチを使用しています：

```typescript
// 前回のAPIリクエストがコンテキストウィンドウの制限に近づいているかチェック
c
    // 制限に非常に近い場合、より積極的な切り捨てを使用
    const keep = totalTokens / 2 > maxAllowedSize ? "quarter" : "half"
    
    conversationHistoryDeletedRange = this.getNextTruncationRange(
        apiConversationHistory,
        conversationHistoryDeletedRange,
        keep,
    )
}
```

ref: <https://github.com/cline/cline/blob/a9617a1acb076a070f3add5a02f6d442c7c741c8/src/core/context-management/ContextManager.ts#L42-L57>

### モデル固有の処理

システムは使用されているAIモデルに基づいて異なるコンテキストウィンドウサイズに適応します：

```typescript
let contextWindow = api.getModel().info.contextWindow || 128_000
// deepseekモデルの特別なケース
if (api instanceof OpenAiHandler && api.getModel().id.toLowerCase().includes("deepseek")) {
    contextWindow = 64_000
}

// 異なるコンテキストウィンドウサイズに対する異なるバッファサイズ
switch (contextWindow) {
    case 64_000: // deepseekモデル
        maxAllowedSize = contextWindow - 27_000
        break
    case 128_000: // ほとんどのモデル
        maxAllowedSize = contextWindow - 30_000
        break
    case 200_000: // claudeモデル
        maxAllowedSize = contextWindow - 40_000
        break
    default:
        maxAllowedSize = Math.max(contextWindow - 40_000, contextWindow * 0.8)
}
```

### 構造を保持する切り捨て

切り捨てロジックはユーザーとアシスタントのメッセージ構造を維持することで会話の流れを保ちます：

```typescript
// 削除される最後のメッセージがユーザーメッセージであることを確認
// これによりユーザー-アシスタント-ユーザー-アシスタントの構造が保たれる
if (apiMessages[rangeEndIndex].role !== "user") {
    rangeEndIndex -= 1
}
```

### エラーリカバリー

システムは異なるプロバイダーからのコンテキストウィンドウエラーを検出して回復できます：

```typescript
// OpenRouterの場合
export function checkIsOpenRouterContextWindowError(error: any): boolean {
    return error.code === 400 && error.message?.includes("context length")
}

// Anthropicの場合
export function checkIsAnthropicContextWindowError(response: any): boolean {
    return (
        response?.error?.error?.type === "invalid_request_error" &&
        response?.error?.error?.message?.includes("prompt is too long")
    )
}
```

エラーが発生した場合、システムは自動回復を試みます：

```typescript
if (isAnthropic && isAnthropicContextWindowError && !this.didAutomaticallyRetryFailedApiRequest) {
    this.conversationHistoryDeletedRange = this.contextManager.getNextTruncationRange(
        this.apiConversationHistory,
        this.conversationHistoryDeletedRange,
        "quarter", // より積極的な切り捨てを強制
    )
    await this.saveClineMessages()
    this.didAutomaticallyRetryFailedApiRequest = true
}
```

## 状態の永続化

コンテキストウィンドウの切り捨て状態はセッション間で維持されます：

```typescript
// 削除範囲をタスク履歴と共に保存
await this.providerRef.deref()?.updateTaskHistory({
    // その他のプロパティ...
    conversationHistoryDeletedRange: this.conversationHistoryDeletedRange,
})
```

## このアプローチの主な利点

1. **スマートな保存**：初期タスク説明メッセージと最近の対話を保持しながら、会話の中間部分を削除することでタスクコンテキストを維持します。

2. **モデル適応性**：異なるモデル能力（64k、128k、200kトークン）に基づいてコンテキストウィンドウ管理を調整します。

3. **エラー耐性**：プロバイダー固有のエラー検出と自動再試行メカニズム。

4. **構造保持**：ユーザーとアシスタントの対話パターンを交互に維持します。

5. **ユーザーエクスペリエンス**：可能な限り透過的にコンテキストの制限を処理し、必要な場合のみユーザーを関与させます。

この実装は、技術的制約とユーザーエクスペリエンスのバランスを取りながら、異なるAIモデルとエラーシナリオに適応するコンテキストウィンドウ管理への洗練されたアプローチを示しています。
