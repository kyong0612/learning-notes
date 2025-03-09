import {
  createTrajectoryLLMAsJudge,
  TRAJECTORY_ACCURACY_PROMPT,
} from "agentevals";
import { createLLMAsJudge, CORRECTNESS_PROMPT } from "openevals";

/**
 * agentevals
 */

async function main() {
  const trajectoryEvaluator = createTrajectoryLLMAsJudge({
    prompt: TRAJECTORY_ACCURACY_PROMPT,
    model: "openai:o3-mini",
  });

  const agentOutputs = [
    { role: "user", content: "What is the weather in SF?" },
    {
      role: "assistant",
      content: "",
      tool_calls: [
        {
          function: {
            name: "get_weather",
            arguments: JSON.stringify({ city: "SF" }),
          },
        },
      ],
    },
    { role: "tool", content: "It's 80 degrees and sunny in SF." },
    {
      role: "assistant",
      content: "The weather in SF is 80 degrees and sunny.",
    },
  ];

  const agentEvalResult = await trajectoryEvaluator({
    outputs: agentOutputs,
  });

  console.log(agentEvalResult);

  /**
   * openevals
   */

  const correctnessEvaluator = createLLMAsJudge({
    prompt: CORRECTNESS_PROMPT,
    model: "openai:o3-mini",
  });

  const inputs = "How much has the price of doodads changed in the past year?";
  // These are fake outputs, in reality you would run your LLM-based system to get real outputs
  const outputs = "Doodads have increased in price by 10% in the past year.";
  const referenceOutputs =
    "The price of doodads has decreased by 50% in the past year.";

  // When calling an LLM-as-judge evaluator, parameters are formatted directly into the prompt
  const evalResult = await correctnessEvaluator({
    inputs,
    outputs,
    referenceOutputs,
  });

  console.log(evalResult);
}

main().catch(console.error);
