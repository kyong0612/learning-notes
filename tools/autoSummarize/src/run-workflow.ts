import { autoSummarizeConfig } from './mastra/config/auto-summarize.config.js';
import { mastra } from './mastra/index.js';

async function runAutoSummarizeWorkflow() {
  console.log('Starting Auto Summarize Workflow...');

  try {
    // ワークフローを実行
    const workflow = mastra.getWorkflow('autoSummarizeWorkflow');
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        targetDirectory: process.env.TARGET_DIRECTORY || autoSummarizeConfig.targetDirectory,
      }
    });

    console.log('\nWorkflow completed!');
    console.log('Result:', JSON.stringify(result, null, 2));

    // 処理結果をサマリー
    if (result?.result && 'processedFiles' in result.result && result.result.processedFiles && result.result.processedFiles.length > 0) {
      console.log('\nProcessed files summary:');
      const typedResult = result.result as { processedFiles: Array<{ filename: string; status: string }> };
      for (const file of typedResult.processedFiles) {
        console.log(`- ${file.filename}: ${file.status}`);
      }
    } else {
      console.log('\nNo files were processed.');
    }
  } catch (error) {
    console.log('Error running workflow:', error);
    process.exit(1);
  }
}

// スクリプトとして直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  runAutoSummarizeWorkflow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.log('Fatal error:', error);
      process.exit(1);
    });
}

export { runAutoSummarizeWorkflow };
