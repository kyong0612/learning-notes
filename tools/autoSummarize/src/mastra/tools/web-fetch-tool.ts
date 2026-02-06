import { createTool } from '@mastra/core';
import { z } from 'zod';

export const webFetchTool = createTool({
  id: 'web-fetch-tool',
  description: 'Webページの内容を取得',
  inputSchema: z.object({
    url: z.string().url().describe('取得するWebページのURL'),
  }),
  outputSchema: z.object({
    content: z.string().describe('ページの内容（HTML/Markdown）'),
    title: z.string().optional().describe('ページタイトル'),
    author: z.string().optional().describe('著者名'),
    publishedDate: z.string().optional().describe('公開日'),
  }),
  execute: async ({ context }) => {
    const { url } = context;

    try {
      // URLからコンテンツを取得
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // 簡易的なHTMLパース（実際の実装では適切なHTMLパーサーを使用）
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : undefined;

      // メタタグから情報を抽出
      const authorMatch = html.match(/<meta\s+name=["']author["']\s+content=["'](.*?)["']/i);
      const author = authorMatch ? authorMatch[1] : undefined;

      const dateMatch =
        html.match(/<meta\s+name=["']date["']\s+content=["'](.*?)["']/i) ||
        html.match(/<time[^>]*datetime=["'](.*?)["']/i);
      const publishedDate = dateMatch ? dateMatch[1] : undefined;

      // TODO: HTMLからMarkdownへの変換処理
      // 現在は簡易的にテキストのみ抽出
      const textContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        content: textContent,
        title,
        author,
        publishedDate,
      };
    } catch (error) {
      console.log('Warning: Web fetch tool error:', error);
      throw error;
    }
  },
});
