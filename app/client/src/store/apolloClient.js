import ApolloClient, { createNetworkInterface } from 'apollo-client';

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080/api/graphql',
    opts: {
      credentials: 'include',
    } 
  })
});

export default apolloClient;
