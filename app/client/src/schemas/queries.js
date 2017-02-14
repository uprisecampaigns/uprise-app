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
      first_name
      last_name
      email
      zip
    }
  }
`;

export const EmailAvailable = gql`
  query EmailAvailable($email: String!) {
    emailAvailable(email:$email) 
  }
`;
