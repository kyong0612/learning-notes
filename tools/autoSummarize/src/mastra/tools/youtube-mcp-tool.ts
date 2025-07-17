import { createTool } from '@mastra/core';
import { z } from 'zod';

export const youtubeMCPTool = createTool({
  id: 'youtube-mcp-tool',
  description: 'YouTube動画の情報を取得',
  inputSchema: z.object({
    url: z.string().url().describe('YouTube動画のURL'),
  }),
  outputSchema: z.object({
    title: z.string().describe('動画のタイトル'),
    description: z.string().describe('動画の説明'),
    author: z.string().describe('チャンネル名'),
    publishedAt: z.string().describe('公開日'),
    transcript: z.string().optional().describe('字幕テキスト'),
  }),
  execute: async (context) => {
    const { url } = context.context;

    try {
      // TODO: YouTube MCPサーバーとの連携実装
      // 現在は仮の実装として、基本的な情報のみ返す

      // YouTube URLの検証
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
      if (!youtubeRegex.test(url)) {
        throw new Error('Invalid YouTube URL');
      }

      console.log(`Fetching YouTube video info for: ${url}`);

      // TODO: 実際のMCPサーバー連携処理
      // 仮のレスポンス
      return {
        title: 'YouTube Video Title',
        description: 'Video description placeholder',
        author: 'Channel Name',
        publishedAt: new Date().toISOString(),
        transcript: undefined,
      };
    } catch (error) {
      console.log('Warning: YouTube MCP tool error:', error);
      throw error;
    }
  },
});
