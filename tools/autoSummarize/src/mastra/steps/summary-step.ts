import { createStep } from '@mastra/core';
import { z } from 'zod';
import { autoSummarizeConfig } from '../config/auto-summarize.config.js';
import { claudeCodeTool } from '../tools/claude-code-tool.js';
import { webFetchTool } from '../tools/web-fetch-tool.js';
import { youtubeMCPTool } from '../tools/youtube-mcp-tool.js';

export const summaryStep = createStep({
  id: 'summary-step',
  description: 'Claude Code CLIを使用して要約を生成',
  inputSchema: z.object({
    filesWithTool: z.array(
      z.object({
        path: z.string(),
        filename: z.string(),
        sourceUrl: z.string().optional(),
        content: z.string(),
        tool: z.enum(['youtube-mcp', 'web-fetch', 'default']),
      }),
    ),
  }),
  outputSchema: z.object({
    summaries: z.array(
      z.object({
        path: z.string(),
        filename: z.string(),
        summary: z.string(),
        metadata: z.object({
          author: z.string().optional(),
          published: z.string().optional(),
          description: z.string(),
          tags: z.array(z.string()),
        }),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    console.log(`Generating summaries for ${inputData.filesWithTool.length} files`);

    const summaries = [];

    for (const file of inputData.filesWithTool) {
      try {
        let contentToSummarize = file.content;
        let additionalMetadata = {};

        // ツールに応じてコンテンツを取得
        if (file.tool === 'youtube-mcp' && file.sourceUrl) {
          console.log(`Fetching YouTube content for: ${file.filename}`);
          const youtubeResult = await youtubeMCPTool.execute({
            context: { url: file.sourceUrl },
            threadId: undefined,
            resourceId: undefined,
            runtimeContext: {},
          } as any);

          contentToSummarize = `
Title: ${youtubeResult.title}
Author: ${youtubeResult.author}
Published: ${youtubeResult.publishedAt}
Description: ${youtubeResult.description}
${youtubeResult.transcript ? `\nTranscript:\n${youtubeResult.transcript}` : ''}
          `;

          additionalMetadata = {
            author: youtubeResult.author,
            published: youtubeResult.publishedAt,
          };
        } else if (file.tool === 'web-fetch' && file.sourceUrl) {
          console.log(`Fetching web content for: ${file.filename}`);
          const webResult = await webFetchTool.execute({
            context: { url: file.sourceUrl },
            threadId: undefined,
            resourceId: undefined,
            runtimeContext: {},
          } as any);

          contentToSummarize = webResult.content;
          additionalMetadata = {
            author: webResult.author,
            published: webResult.publishedDate,
          };
        }

        // Claude Codeで要約を生成
        console.log(`Generating summary with Claude Code for: ${file.filename}`);
        const summaryResult = await claudeCodeTool.execute({
          context: {
            content: contentToSummarize,
            promptPath: autoSummarizeConfig.promptPath,
            sourceUrl: file.sourceUrl,
          },
          threadId: undefined,
          resourceId: undefined,
          runtimeContext: {},
        } as any);

        // メタデータをマージ
        const metadata = {
          ...summaryResult.metadata,
          ...additionalMetadata,
        };

        // ユーザー承認のためにサスペンド
        // TODO: Suspendableの実装方法を確認後に実装
        // if (suspend) {
        //   const resumeData = await suspend({
        //     currentFile: {
        //       path: file.path,
        //       filename: file.filename,
        //       proposedSummary: summaryResult.summary
        //     }
        //   });
        //
        //   if (!resumeData.approved) {
        //     console.log(`Summary rejected for: ${file.filename}`);
        //     continue;
        //   }
        //
        //   // 編集された要約があれば使用
        //   if (resumeData.editedSummary) {
        //     summaryResult.summary = resumeData.editedSummary;
        //   }
        // }

        summaries.push({
          path: file.path,
          filename: file.filename,
          summary: summaryResult.summary,
          metadata,
        });
      } catch (error) {
        console.log(`Warning: Error generating summary for ${file.filename}:`, error);

        // エラー時のフォールバック
        summaries.push({
          path: file.path,
          filename: file.filename,
          summary: '要約の生成に失敗しました。',
          metadata: {
            description: 'エラーが発生しました',
            tags: ['エラー'],
          },
        });
      }
    }

    return {
      summaries,
    };
  },
});
