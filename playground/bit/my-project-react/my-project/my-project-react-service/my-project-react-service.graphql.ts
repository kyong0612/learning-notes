
import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import { MyProjectReactService } from './my-project-react-service.js';

export type ServerSchema = {
  typeDefs: DocumentNode,
  resolvers: GraphQLResolverMap
}

export function myProjectReactServiceSchema(myProjectReactService: MyProjectReactService): ServerSchema {
  const typeDefs = gql`#graphql

  type Announcement {
    title: String
    date: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "users" query returns an array of zero or more Users (defined above).
  type Query {
    listAnnouncements: [Announcement]
  }
`;

  const resolvers = {
    Query: {
      listAnnouncements: async () => {
        const announcements = await myProjectReactService.listAnnouncements();

        return announcements.map((announcement) => {
          return announcement.toObject();
        });
      },
    },
  };

  return {
    typeDefs,
    resolvers
  };
} 
