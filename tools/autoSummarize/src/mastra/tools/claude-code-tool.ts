import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createTool } from '@mastra/core';
import { z } from 'zod';

const execAsync = promisify(exec);

export const claudeCodeTool = createTool({
  id: 'claude-code-tool',
  description: 'Claude Code CLIを実行して要約を生成',
  inputSchema: z.object({
    content: z.string().describe('要約対象のコンテンツ'),
    promptPath: z.string().describe('プロンプトファイルのパス'),
    sourceUrl: z.string().optional().describe('ソースURL'),
  }),
  outputSchema: z.object({
    summary: z.string().describe('生成された要約'),
    metadata: z
      .object({
        author: z.string().optional(),
        published: z.string().optional(),
        description: z.string(),
        tags: z.array(z.string()),
      })
      .describe('抽出されたメタデータ'),
  }),
  execute: async ({ context }) => {
    const { content, promptPath, sourceUrl } = context;

    try {
      // プロンプトファイルを読み込む
      const promptContent = await fs.readFile(promptPath, 'utf-8');

      // 一時ファイルに内容を保存
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-code-'));
      const contentFile = path.join(tempDir, 'content.md');

      // ソースURLを含むコンテンツを作成
      const fullContent = sourceUrl ? `source: ${sourceUrl}\n\n${content}` : content;

      await fs.writeFile(contentFile, fullContent);

      // Claude Code CLIコマンドを構築
      const command = `claude --print "${promptContent}" < "${contentFile}"`;

      console.log('Executing Claude Code CLI...');

      // CLIを実行
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });

      if (stderr) {
      }

      // 出力を解析してメタデータと要約を抽出
      const result = parseClaudeOutput(stdout);

      // 一時ファイルをクリーンアップ
      await fs.rm(tempDir, { recursive: true, force: true });

      return result;
    } catch (error) {
      console.log('Warning: Claude Code tool error:', error);

      // エラー時のフォールバック
      return {
        summary: '要約の生成に失敗しました。',
        metadata: {
          author: undefined,
          published: undefined,
          description: '要約生成エラー',
          tags: [],
        },
      };
    }
  },
});

function parseClaudeOutput(output: string): {
  summary: string;
  metadata: {
    author?: string;
    published?: string;
    description: string;
    tags: string[];
  };
} {
  // Claudeの出力からメタデータと要約を抽出
  // 実際の形式に応じて調整が必要

  const lines = output.split('\n');
  const metadata: {
    author?: string;
    published?: string;
    description: string;
    tags: string[];
  } = {
    description: '',
    tags: [],
  };

  let summaryStartIndex = 0;

  // メタデータの抽出を試みる
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('author:')) {
      metadata.author = line.substring('author:'.length).trim();
    } else if (line.startsWith('published:')) {
      metadata.published = line.substring('published:'.length).trim();
    } else if (line.startsWith('description:')) {
      metadata.description = line.substring('description:'.length).trim();
    } else if (line.startsWith('tags:')) {
      const tagsStr = line.substring('tags:'.length).trim();
      metadata.tags = tagsStr
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else if (line === '---' || line === '') {
      // メタデータセクションの終了
      summaryStartIndex = i + 1;
      break;
    }
  }

  // 要約部分を抽出
  const summary = lines.slice(summaryStartIndex).join('\n').trim();

  // デフォルト値の設定
  if (!metadata.description) {
    metadata.description = `${summary.substring(0, 150)}...`;
  }

  if (metadata.tags.length === 0) {
    metadata.tags = ['未分類'];
  }

  return {
    summary: summary || output,
    metadata,
  };
}
