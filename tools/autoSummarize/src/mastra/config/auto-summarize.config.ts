export const autoSummarizeConfig = {
  targetDirectory: process.env.TARGET_DIRECTORY || '/Users/kimkiyong/Dev/learning-notes/articles',
  promptPath:
    process.env.PROMPT_PATH ||
    '/Users/kimkiyong/Dev/learning-notes/tools/autoSummarize/docs/prompts/summarize-prompt.md',
  maxConcurrentFiles: parseInt(process.env.MAX_CONCURRENT_FILES || '5'),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.RETRY_DELAY || '1000'),
};
