import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { urls } from 'config/config';

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `${urls.api}/graphql`,
    opts: {
      credentials: 'include',
    },
  }),
  dataIdFromObject: o => o.id,
});

export default apolloClient;
