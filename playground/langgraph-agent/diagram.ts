// Note: tslab only works inside a jupyter notebook. Don't worry about running this code yourself!
import * as tslab from "tslab";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const main = async () => {
	// Define the tools for the agent to use
	// Define the tools for the agent to use
	const agentTools = [new TavilySearchResults({ maxResults: 3 })];
	const agentModel = new ChatOpenAI({
		model: "gpt-4o-mini",
		temperature: 0,
	});

	// Initialize memory to persist state between graph runs
	const agentCheckpointer = new MemorySaver();
	const agent = createReactAgent({
		llm: agentModel,
		tools: agentTools,
		checkpointSaver: agentCheckpointer,
	});

	const graph = agent.getGraph();
	const image = await graph.drawMermaidPng();
	const arrayBuffer = await image.arrayBuffer();

	await tslab.display.png(new Uint8Array(arrayBuffer));
};

// Execute the main function and handle any errors
main().catch((error) => {
	console.error("Error:", error);
	process.exit(1);
});
