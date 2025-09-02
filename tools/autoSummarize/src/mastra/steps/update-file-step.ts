import fs from 'node:fs/promises';
import path from 'node:path';
import { createStep } from '@mastra/core';
import { z } from 'zod';

export const updateFileStep = createStep({
  id: 'update-file-step',
  description: '承認された要約でMarkdownファイルを更新',
  inputSchema: z.object({
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
  outputSchema: z.object({
    processedFiles: z.array(
      z.object({
        filename: z.string(),
        status: z.enum(['success', 'failed', 'skipped']),
        message: z.string().optional(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    console.log(`Updating ${inputData.summaries.length} Markdown files`);

    const processedFiles = [];

    for (const summaryData of inputData.summaries) {
      try {
        // バックアップディレクトリを作成
        const backupDir = path.join(path.dirname(summaryData.path), '.backups');
        await fs.mkdir(backupDir, { recursive: true });

        // バックアップファイルを作成
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${summaryData.filename}.${timestamp}.bak`);

        // 元のファイルの内容を読み込む
        const originalContent = await fs.readFile(summaryData.path, 'utf-8');

        // バックアップを保存
        await fs.writeFile(backupPath, originalContent);
        console.log(`Created backup: ${backupPath}`);

        // メタデータセクションを構築
        const metadataLines = ['---'];

        // 既存のメタデータを解析
        const existingMetadataMatch = originalContent.match(/^---\n([\s\S]*?)\n---/);
        const existingMetadata: Record<string, string | string[]> = {};

        if (existingMetadataMatch) {
          const metadataSection = existingMetadataMatch[1];
          const lines = metadataSection.split('\n');

          for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              const value = valueParts.join(':').trim();
              existingMetadata[key.trim()] = value;
            }
          }
        }

        // 新しいメタデータとマージ
        const mergedMetadata = {
          ...existingMetadata,
          author: summaryData.metadata.author || existingMetadata.author || '',
          published: summaryData.metadata.published || existingMetadata.published || '',
          description: summaryData.metadata.description || existingMetadata.description,
          tags:
            summaryData.metadata.tags.length > 0
              ? summaryData.metadata.tags
              : existingMetadata.tags || [],
        };

        // メタデータを文字列に変換
        if (mergedMetadata.author) {
          metadataLines.push(`author: ${mergedMetadata.author}`);
        }
        if (mergedMetadata.published) {
          metadataLines.push(`published: ${mergedMetadata.published}`);
        }
        metadataLines.push(`description: ${mergedMetadata.description}`);
        metadataLines.push(
          `tags: ${Array.isArray(mergedMetadata.tags) ? mergedMetadata.tags.join(', ') : mergedMetadata.tags}`,
        );

        // sourceがある場合は追加
        const sourceMatch = originalContent.match(/^source:\s*(.+)$/m);
        if (sourceMatch) {
          metadataLines.push(`source: ${sourceMatch[1]}`);
        }

        metadataLines.push('---');

        // 新しいコンテンツを構築
        let updatedContent = `${metadataLines.join('\n')}\n\n`;

        // 既存のコンテンツから元のメタデータセクションを除去
        let bodyContent = originalContent;
        if (existingMetadataMatch) {
          bodyContent = originalContent.substring(existingMetadataMatch[0].length).trim();
        }

        // sourceの行を除去（メタデータに移動済み）
        bodyContent = bodyContent.replace(/^source:\s*.+$/m, '').trim();

        // 要約と元のコンテンツを追加
        updatedContent += `## 要約\n\n${summaryData.summary}\n\n`;
        updatedContent += `## 元の内容\n\n${bodyContent}`;

        // ファイルを更新
        await fs.writeFile(summaryData.path, updatedContent);
        console.log(`Updated file: ${summaryData.path}`);

        processedFiles.push({
          filename: summaryData.filename,
          status: 'success' as const,
          message: 'File updated successfully',
        });
      } catch (error) {
        console.log(`Warning: Error updating file ${summaryData.filename}:`, error);

        processedFiles.push({
          filename: summaryData.filename,
          status: 'failed' as const,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      processedFiles,
    };
  },
});
