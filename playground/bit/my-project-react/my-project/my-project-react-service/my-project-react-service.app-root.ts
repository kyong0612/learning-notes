import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { myProjectReactServiceSchema } from './my-project-react-service.graphql.js';
import { MyProjectReactService } from './my-project-react-service.js';

export async function run() {
  // ports are injects by Bit to `process.env.PORT`
  const port = parseInt(process.env.PORT, 10) || 3000;
  const myProjectReactService = MyProjectReactService.from();
  
  const { typeDefs, resolvers } = myProjectReactServiceSchema(myProjectReactService);
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers })
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: {
      port
    }
  });

  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at: ${url}`);

  return {
    port,
    stop: async () => {
      await server.stop();
    }
  }
}
