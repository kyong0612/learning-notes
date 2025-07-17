import { createStep } from '@mastra/core';
import { z } from 'zod';

export const toolSelectorStep = createStep({
  id: 'tool-selector-step',
  description: 'ソースURLに基づいて適切なツールを選択',
  inputSchema: z.object({
    filesWithSource: z.array(
      z.object({
        path: z.string(),
        filename: z.string(),
        sourceUrl: z.string().optional(),
        content: z.string(),
      }),
    ),
  }),
  outputSchema: z.object({
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
  execute: async ({ inputData }) => {
    console.log(`Selecting tools for ${inputData.filesWithSource.length} files`);

    const filesWithTool = inputData.filesWithSource.map((file) => {
      let tool: 'youtube-mcp' | 'web-fetch' | 'default' = 'default';

      if (file.sourceUrl) {
        const sourceUrl = file.sourceUrl;
        // YouTube URLパターンの検出
        const youtubePatterns = [
          /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/,
          /youtube\.com\/watch/,
          /youtu\.be\//,
        ];

        const isYouTube = youtubePatterns.some((pattern) => pattern.test(sourceUrl));

        if (isYouTube) {
          tool = 'youtube-mcp';
          console.log(`Selected YouTube MCP tool for: ${file.filename}`);
        } else if (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://')) {
          tool = 'web-fetch';
          console.log(`Selected Web Fetch tool for: ${file.filename}`);
        }
      }

      if (tool === 'default') {
        console.log(`Using default tool for: ${file.filename} (no valid source URL)`);
      }

      return {
        ...file,
        tool,
      };
    });

    return {
      filesWithTool,
    };
  },
});
