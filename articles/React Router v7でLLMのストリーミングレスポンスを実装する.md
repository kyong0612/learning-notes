---
title: "React Router v7でLLMのストリーミングレスポンスを実装する"
source: "https://kaminashi-developer.hatenablog.jp/entry/react-router-v7-llm-streaming"
author:
  - "澤木"
  - "[[カミナシ (id:kaminashi-developer)]]"
published: 2025-12-09
created: 2025-12-10
description: "React Router v7でReadableStream APIを使用してLLMのストリーミングレスポンスを実装する方法を解説。Resource Routesを活用し、AWS BedrockモデルのAPIを呼び出してチャンク毎にデータを逐次表示する実装パターンを紹介。"
tags:
  - "React Router"
  - "LLM"
  - "ストリーミング"
  - "ReadableStream"
  - "AWS Bedrock"
  - "フロントエンド"
  - "生成AI"
---

## 概要

LLMは生成処理に時間がかかるため、全てのデータ生成を待ってから表示するとユーザー体験が悪化する。この記事では、React Router v7でReadableStream APIを直接使用してストリーミング処理を実装する方法を解説している。

## React Router v7のストリーミング機能の制限

React Router v7には[ストリーミング機能](https://reactrouter.com/how-to/suspense)が存在するが、以下の制限がある：

- **loader関数**から未解決のPromiseを返すことで遅延読み込みが可能
- **Suspense**でPromiseの解決を待つことができる
- ただし**Promise単位**での遅延読み込みであり、**チャンク単位でのデータ逐次受け取りには対応していない**

## 実装方針

### 問題点

標準的な方法（pageにactionを実装してFormからsubmit）では、`useActionData`で取得するデータがReact Router側で**JSONとしてパースされてしまう**ため、ReadableStreamをそのまま扱えない。

```typescript
export const action = async ({ request }: LoaderFunctionArgs) => {
    // ReadableStreamを返す
    return new Response(new ReadableStream({ ... }));
};

export default function Page() {
    const actionData = useActionData(); // JSONとしてパースされてしまう
    // ReadableStreamを扱えないためストリーミング表示ができない
}
```

### 解決策

**Resource Routes**でactionを実装し、クライアント側では**fetch API**で直接呼び出す形で実装する。

- Resource RoutesはUIコンポーネントを持たないルート
- ストリーミングレスポンスを返すAPIエンドポイントとして利用可能

## actionの実装（サーバー側）

BedrockモデルのAPIを呼び出してReadableStreamとしてレスポンスを返す例：

```typescript
import {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { LoaderFunctionArgs } from "react-router";

export const action = async ({ request }: LoaderFunctionArgs) => {
    const formData = await request.formData();
    const prompt = formData.get("prompt");

    const client = new BedrockRuntimeClient({
        region: "ap-northeast-1",
    });
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
    };
    const command = new InvokeModelWithResponseStreamCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: "apac.anthropic.claude-sonnet-4-20250514-v1:0",
    });
    const apiResponse = await client.send(command);

    // ReadableStreamとしてレスポンスを返す
    return new Response(
        new ReadableStream({
            async start(controller) {
                // AsyncIterableをReadableStreamに変換
                for await (const item of apiResponse?.body ?? []) {
                    const chunk = JSON.parse(new TextDecoder().decode(item.chunk?.bytes));
                    // 生成内容のテキストのみ取り出す
                    if (chunk.type === "content_block_delta") {
                        const text = chunk.delta.text;
                        controller.enqueue(text);
                    }
                }
                controller.close();
            },
        }),
    );
};
```

**ポイント**:

- BedrockモデルのストリーミングレスポンスはAsyncIterableとして返される
- これをReadableStreamに変換して返却
- チャンク毎のJSONからテキスト部分のみを抽出

## クライアント側の実装

```typescript
import { useCallback, useState } from "react";

export const useReadableStream = () => {
    const [message, setMessage] = useState("");

    const submit = useCallback((formData: FormData) => {
        fetch("/invoke-model", {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                if (!response.ok || !response.body) {
                    return;
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    // チャンクの読み取り
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    // チャンクのデコードとstateの更新
                    const chunk = decoder.decode(value, { stream: true });
                    setMessage((prev) => prev + chunk);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, []);

    return { submit, message };
};

function Sample() {
    const { submit, message } = useReadableStream();

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    submit(formData);
                }}
            >
                <textarea name="prompt" />
                <button type="submit">Submit</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
```

**ポイント**:

- `response.body.getReader()`でReadableStreamからreaderを取得
- `reader.read()`でストリーム終了までチャンクを逐次読み取り
- `setMessage`でテキストを順次追加してUI上で逐次表示

## JSON形式データを扱う場合

構造化されたデータを返したい場合は、**JSON Lines**（改行区切りJSON）を使用する。

### サーバー側の変更点

```typescript
// 各チャンクごとに改行を追加して返却
controller.enqueue(encoder.encode(`${json}\n`));
```

### クライアント側の変更点

```typescript
export const useReadableStream = () => {
    const [data, setData] = useState<any[]>([]);
    const buffer = useRef("");

    const submit = useCallback((formData: FormData) => {
        fetch("/invoke-model", { method: "POST", body: formData })
            .then(async (response) => {
                if (!response.ok || !response.body) return;
                buffer.current = "";
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        // ストリーム終了時に残ったバッファを処理
                        if (buffer.current.trim() !== "") {
                            try {
                                const json = JSON.parse(buffer.current);
                                setData((prev) => [...prev, json]);
                            } catch (e) {
                                console.log("JSON parse error:", e);
                            }
                        }
                        break;
                    }

                    // チャンクをバッファに保持
                    const chunk = decoder.decode(value, { stream: true });
                    buffer.current += chunk;

                    // 改行で分割して最終行のみをバッファに残す
                    const lines = buffer.current.split("\n");
                    buffer.current = lines.pop() || "";

                    // 各行をJSONとしてパース
                    for (const line of lines) {
                        if (line.trim() === "") continue;
                        try {
                            const json = JSON.parse(line);
                            setData((prev) => [...prev, json]);
                        } catch (e) {
                            console.error("JSON parse error:", e);
                        }
                    }
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    return { submit, data };
};
```

**ポイント**:

- チャンクをバッファで保持しながら改行で分割
- 改行区切りでJSONをパースして処理

## まとめ

| 観点 | 内容 |
|------|------|
| **課題** | `useActionData`がJSONパースするためReadableStreamを直接扱えない |
| **解決策** | Resource Routes + fetch APIで直接呼び出し |
| **アーキテクチャ** | React Router v7の標準から大きく外れずに実装可能 |
| **応用** | 大きなファイルのダウンロード進捗表示、リアルタイムデータ表示など |

## 参考リンク

- [React Router v7 ストリーミング機能（Suspense）](https://reactrouter.com/how-to/suspense)
- [React Router v7 Resource Routes](https://reactrouter.com/how-to/resource-routes)
