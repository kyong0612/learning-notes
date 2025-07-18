import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { createTool } from '@mastra/core';
import { z } from 'zod';

const execAsync = promisify(exec);

export const gitDiffTool = createTool({
  id: 'git-diff-tool',
  description: '新規追加されたMarkdownファイルをgit diffで検出',
  inputSchema: z.object({
    targetDirectory: z.string().describe('検出対象のディレクトリパス'),
  }),
  outputSchema: z.object({
    newFiles: z
      .array(
        z.object({
          path: z.string().describe('ファイルの絶対パス'),
          filename: z.string().describe('ファイル名'),
        }),
      )
      .describe('新規追加されたMarkdownファイルのリスト'),
  }),
  execute: async ({ context }) => {
    const { targetDirectory } = context;

    try {
      // git リポジトリのルートディレクトリを取得
      const { stdout: gitRoot } = await execAsync('git rev-parse --show-toplevel', {
        cwd: targetDirectory,
      });
      const repoRoot = gitRoot.trim();
      
      // ターゲットディレクトリのリポジトリルートからの相対パスを取得
      const relativeTargetPath = path.relative(repoRoot, targetDirectory);

      // git diffで新規追加されたファイルを検出
      // --name-status: ファイル名とステータスを表示
      // --diff-filter=A: 追加されたファイルのみ
      const { stdout } = await execAsync(`git diff --cached --name-status --diff-filter=A`, {
        cwd: repoRoot,
      });

      // 結果をパース
      const lines = stdout
        .trim()
        .split('\n')
        .filter((line) => line);
      const newFiles = lines
        .map((line) => {
          const [, filePath] = line.split('\t');
          return filePath;
        })
        .filter((filePath) => filePath?.endsWith('.md'))
        .filter((filePath) => filePath?.startsWith(relativeTargetPath))
        .map((filePath) => ({
          path: path.join(repoRoot, filePath),
          filename: path.basename(filePath),
        }));

      // stagedでない新規ファイルも検出
      const { stdout: unstaged } = await execAsync(`git ls-files --others --exclude-standard`, {
        cwd: repoRoot,
      });

      const unstagedFiles = unstaged
        .trim()
        .split('\n')
        .filter((filePath) => filePath?.endsWith('.md'))
        .filter((filePath) => filePath?.startsWith(relativeTargetPath))
        .map((filePath) => ({
          path: path.join(repoRoot, filePath),
          filename: path.basename(filePath),
        }));

      // 重複を除去して結合
      const allNewFiles = [...newFiles, ...unstagedFiles];
      const uniqueFiles = Array.from(
        new Map(allNewFiles.map((file) => [file.path, file])).values(),
      );

      return {
        newFiles: uniqueFiles,
      };
    } catch (error) {
      console.log('Warning: Git diff execution failed:', error);

      // エラー時は空の配列を返す
      return {
        newFiles: [],
      };
    }
  },
});
