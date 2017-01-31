import gql from 'graphql-tag';

export const OpportunityQuery = gql`
  query OpportunityQuery($id: String!) {
    opportunity(id:$id) {
      title
      userEmail
    }
  }
  
`;
export const MeQuery = gql`
  query MeQuery {
    me {
      email
      zip
    }
  }
`;
