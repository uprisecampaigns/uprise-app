import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { urls} from 'config/config'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: urls.api + '/graphql',
    dataIdFromObject: o => o.id,
    opts: {
      credentials: 'include',
    } 
  })
});

export default apolloClient;
