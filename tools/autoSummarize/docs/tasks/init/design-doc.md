# 自動記事要約システム設計書

## システムアーキテクチャ

### 全体構成
```
┌─────────────────────┐
│  Mastra Workflow    │
│  (Entry Point)      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Git Diff Step      │
│  (新規ファイル検出) │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  File Parser Step   │
│  (ソースURL解析)    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Tool Selector Step │
│  (ツール選択)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Summary Step       │
│  (要約生成)         │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Approval Step      │
│  (ユーザー承認)     │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Update File Step   │
│  (ファイル更新)     │
└─────────────────────┘
```

## コンポーネント設計

### 1. Workflow定義
```typescript
// src/mastra/workflows/auto-summarize-workflow.ts
export const autoSummarizeWorkflow = createWorkflow({
  id: "auto-summarize-workflow",
  description: "新規追加されたMarkdownファイルを自動要約",
  inputSchema: z.object({
    targetDirectory: z.string().default("/Users/kimkiyong/Dev/learning-notes/articles")
  }),
  outputSchema: z.object({
    processedFiles: z.array(z.object({
      filename: z.string(),
      status: z.enum(["success", "failed", "skipped"]),
      message: z.string().optional()
    }))
  })
})
```

### 2. Step定義

#### GitDiffStep
```typescript
const gitDiffStep = createStep({
  id: "git-diff-step",
  description: "新規追加されたMarkdownファイルを検出",
  inputSchema: z.object({
    targetDirectory: z.string()
  }),
  outputSchema: z.object({
    newFiles: z.array(z.object({
      path: z.string(),
      filename: z.string()
    }))
  })
})
```

#### FileParserStep
```typescript
const fileParserStep = createStep({
  id: "file-parser-step",
  description: "MarkdownファイルのソースURLを解析",
  inputSchema: z.object({
    newFiles: z.array(z.object({
      path: z.string(),
      filename: z.string()
    }))
  }),
  outputSchema: z.object({
    filesWithSource: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      sourceUrl: z.string().optional(),
      content: z.string()
    }))
  })
})
```

#### ToolSelectorStep
```typescript
const toolSelectorStep = createStep({
  id: "tool-selector-step",
  description: "ソースURLに基づいて適切なツールを選択",
  inputSchema: z.object({
    filesWithSource: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      sourceUrl: z.string().optional(),
      content: z.string()
    }))
  }),
  outputSchema: z.object({
    filesWithTool: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      sourceUrl: z.string().optional(),
      content: z.string(),
      tool: z.enum(["youtube-mcp", "web-fetch", "default"])
    }))
  })
})
```

#### SummaryStep (Suspendable)
```typescript
const summaryStep = createStep({
  id: "summary-step",
  description: "Claude Code CLIを使用して要約を生成",
  inputSchema: z.object({
    filesWithTool: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      sourceUrl: z.string().optional(),
      content: z.string(),
      tool: z.enum(["youtube-mcp", "web-fetch", "default"])
    }))
  }),
  outputSchema: z.object({
    summaries: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      summary: z.string(),
      metadata: z.object({
        author: z.string().optional(),
        published: z.string().optional(),
        description: z.string(),
        tags: z.array(z.string())
      })
    }))
  }),
  suspendSchema: z.object({
    currentFile: z.object({
      path: z.string(),
      filename: z.string(),
      proposedSummary: z.string()
    })
  }),
  resumeSchema: z.object({
    approved: z.boolean(),
    editedSummary: z.string().optional()
  })
})
```

#### UpdateFileStep
```typescript
const updateFileStep = createStep({
  id: "update-file-step",
  description: "承認された要約でMarkdownファイルを更新",
  inputSchema: z.object({
    summaries: z.array(z.object({
      path: z.string(),
      filename: z.string(),
      summary: z.string(),
      metadata: z.object({
        author: z.string().optional(),
        published: z.string().optional(),
        description: z.string(),
        tags: z.array(z.string())
      })
    }))
  }),
  outputSchema: z.object({
    processedFiles: z.array(z.object({
      filename: z.string(),
      status: z.enum(["success", "failed", "skipped"]),
      message: z.string().optional()
    }))
  })
})
```

### 3. Tool定義

#### YouTubeMCPTool
```typescript
const youtubeMCPTool = createTool({
  id: "youtube-mcp-tool",
  description: "YouTube動画の情報を取得",
  inputSchema: z.object({
    url: z.string().url()
  }),
  outputSchema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishedAt: z.string(),
    transcript: z.string().optional()
  })
})
```

#### WebFetchTool
```typescript
const webFetchTool = createTool({
  id: "web-fetch-tool",
  description: "Webページの内容を取得",
  inputSchema: z.object({
    url: z.string().url()
  }),
  outputSchema: z.object({
    content: z.string(),
    title: z.string().optional(),
    author: z.string().optional(),
    publishedDate: z.string().optional()
  })
})
```

### 4. Claude Code CLIとの統合

```typescript
// src/mastra/tools/claude-code-tool.ts
const claudeCodeTool = createTool({
  id: "claude-code-tool",
  description: "Claude Code CLIを実行して要約を生成",
  inputSchema: z.object({
    content: z.string(),
    promptPath: z.string()
  }),
  outputSchema: z.object({
    summary: z.string(),
    metadata: z.object({
      author: z.string().optional(),
      published: z.string().optional(),
      description: z.string(),
      tags: z.array(z.string())
    })
  }),
  execute: async ({ context }) => {
    // Claude Code CLIを呼び出して要約を生成
    // 実装詳細は実装フェーズで定義
  }
})
```

## エラーハンドリング

### エラーケース
1. git diffの実行失敗
2. ファイル読み取り失敗
3. Claude Code CLI実行失敗
4. ファイル書き込み失敗

### リトライ戦略
- 各ステップで最大3回のリトライ
- 指数バックオフ（1秒、2秒、4秒）

## セキュリティ考慮事項

1. ファイルアクセス権限の確認
2. 外部APIへのアクセス制限
3. Claude Code CLIの実行権限管理
4. ユーザー承認プロセスの実装

## パフォーマンス最適化

1. 並列処理
   - 複数ファイルの同時処理（最大5ファイル）
   - ツール呼び出しの並列実行

2. キャッシング
   - 処理済みファイルの記録
   - ツール応答のキャッシュ

## 設定管理

```typescript
// src/mastra/config/auto-summarize.config.ts
export const autoSummarizeConfig = {
  targetDirectory: process.env.TARGET_DIRECTORY || "/Users/kimkiyong/Dev/learning-notes/articles",
  promptPath: process.env.PROMPT_PATH || "/Users/kimkiyong/Dev/learning-notes/tools/autoSummarize/auto-summarizer/doc/summarize-prompt.md",
  maxConcurrentFiles: 5,
  retryAttempts: 3,
  retryDelay: 1000
}
```