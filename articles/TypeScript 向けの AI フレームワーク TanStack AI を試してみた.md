---
title: "TypeScript 向けの AI フレームワーク TanStack AI を試してみた"
source: "https://azukiazusa.dev/blog/try-tanstack-ai/"
author:
  - "azukiazusa1"
published: 2025-12-07
created: 2025-12-09
description: "TanStack AI は TanStack チームが開発する TypeScript 向けの軽量な AI フレームワークです。LLM プロバイダーのインターフェイスを抽象化し、ツール呼び出しやチャット機能を提供します。この記事では TanStack AI の概要と基本的な使い方を紹介します。"
tags:
  - "AI"
  - "TypeScript"
  - "TanStack AI"
  - "LLM"
  - "AI Agent"
---

## 概要

TanStack AI は、TanStack チームが開発する TypeScript/JavaScript 向けの軽量な AI フレームワーク。OpenAI、Anthropic、Gemini など複数の LLM プロバイダーのインターフェースを抽象化し、統一された API でチャット機能やツール呼び出しを実現できる。

### 背景: 既存フレームワークの位置づけ

| フレームワーク | 言語 | 特徴 |
|--------------|------|------|
| AI SDK | TypeScript | シンプルな抽象化、Mastra や VoltAgent の基盤 |
| LangChain | Python | シンプルな抽象化、LangGraph の基盤 |
| **TanStack AI** | TypeScript | 軽量、ツール定義と実装の分離が特徴 |

---

## TanStack AI の基本的な使い方

### インストール

```bash
npm install @tanstack/ai @tanstack/ai-anthropic
```

- `@tanstack/ai`: コアパッケージ（チャット、ツール呼び出し機能）
- `@tanstack/ai-anthropic`: Anthropic（Claude）用アダプター
- 他に `@tanstack/ai-openai`、`@tanstack/ai-gemini` などのアダプターも提供

### 環境変数の設定

```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

### 基本的なチャット呼び出し

```typescript
import { chat } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";

const stream = chat({
  adapter: anthropic(),
  messages: [{ role: "user", content: "こんにちは" }],
  model: "claude-haiku-4-5",
});

for await (const chunk of stream) {
  switch (chunk.type) {
    case "content":
      process.stdout.write(chunk.delta);
      break;
    case "done":
      console.log("Response completed. Finish reason:" + chunk.finishReason);
      break;
    case "error":
      console.error("Error:", chunk.error);
      break;
  }
}
```

**ポイント:**

- `chat` 関数は非同期イテレータを返し、ストリーミングレスポンスを受信
- `chunk.type` で `content`、`done`、`error`、`tool_call`、`tool_result` などのイベントを識別

---

## ツールの呼び出し

### TanStack AI のツールの特徴

1. **サーバーとクライアントの両方で動作可能**
2. **ツールの定義と実装が分離** - 同じ定義をサーバー/クライアントで共有可能
3. **Zod による型安全なスキーマ**

### ツールの定義と実装

```typescript
import { chat, toolDefinition } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";
import { z } from "zod";

// ツール定義
const weatherToolDef = toolDefinition({
  name: "getWeather",
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for."),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("The current temperature in Celsius."),
    condition: z.string().describe("A brief description of the weather condition."),
  }),
});

// サーバーサイド実装
const getWeatherServer = weatherToolDef.server(async ({ location }) => {
  return {
    temperature: 22,
    condition: `Sunny in ${location}`,
  };
});

// chat 関数で使用
const stream = chat({
  adapter: anthropic(),
  messages: [{ role: "user", content: "東京の天気を教えてください。" }],
  model: "claude-haiku-4-5",
  tools: [getWeatherServer], // 実装済みツールを渡すと自動呼び出し
});
```

### ツール実行の承認機能

危険な操作（コード実行、シェルコマンド等）の前にユーザー承認を求める場合:

```typescript
const weatherToolDef = toolDefinition({
  name: "getWeather",
  // ... 他のオプション
  needsApproval: true, // これを追加
});
```

`needsApproval: true` を設定すると、ツール呼び出し前に `approval-requested` チャンクが送信される。

---

## Next.js での実装例

### 必要パッケージ

```bash
npx create-next-app@latest tanstack-ai-chatbot
cd tanstack-ai-chatbot
npm install @tanstack/ai @tanstack/ai-anthropic @tanstack/ai-react zod
```

### API エンドポイント (`app/api/chat/route.ts`)

```typescript
import { chat, toolDefinition, toStreamResponse } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";
import z from "zod";

// ツール定義・実装（省略）

export async function POST(request: Request) {
  const { messages, conversationId } = await request.json();

  const stream = chat({
    adapter: anthropic(),
    messages,
    model: "claude-haiku-4-5",
    conversationId,
    tools: [getWeatherServer],
  });

  // HTTP ストリームレスポンスに変換
  return toStreamResponse(stream);
}
```

**ポイント:** `toStreamResponse` 関数でストリーミングレスポンスを HTTP レスポンスに変換

### クライアントサイド (`app/Chat.tsx`)

```typescript
"use client";
import { useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, reload, stop } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  // messages 配列の各メッセージを parts で処理
  // part.type: "thinking" | "tool-call" | "tool-result" | "text"
  
  return (
    // UI 実装
  );
}
```

**`useChat` フックの機能:**

- `messages`: メッセージ配列
- `sendMessage`: メッセージ送信
- `isLoading`: ローディング状態
- `reload`: 直前のメッセージに対する応答を再生成
- `stop`: 現在の応答を停止

**メッセージの構造:**
各メッセージの `parts` 配列には以下の `type` がある:

- `thinking`: AI の思考プロセス
- `tool-call`: ツール呼び出し（name, input を含む）
- `tool-result`: ツール実行結果
- `text`: 通常のテキストレスポンス

---

## まとめ

| 機能 | 実装方法 |
|------|---------|
| チャット送信 | `chat()` 関数 + アダプター |
| ストリーミング | `for await...of` ループ |
| ツール定義 | `toolDefinition()` + `.server()` / `.client()` |
| HTTP レスポンス変換 | `toStreamResponse()` |
| React クライアント | `useChat` フック + `fetchServerSentEvents()` |
| ユーザー承認 | `needsApproval: true` オプション |

### 主な利点

- **LLM プロバイダーの抽象化**: アダプターを差し替えるだけでモデル変更可能
- **ツール定義と実装の分離**: サーバー/クライアントでの再利用が容易
- **型安全**: Zod によるスキーマ定義
- **軽量**: 最小限の機能でシンプル

---

## 参考リンク

- [TanStack/ai - GitHub](https://github.com/TanStack/ai)
- [TanStack AI - 公式ドキュメント](https://tanstack.com/ai/latest/docs/getting-started/overview)
