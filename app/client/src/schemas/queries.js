import gql from 'graphql-tag';

export const OpportunityQuery = gql`
  
  query OpportunityQuery($search:OpportunitySearchInput) {
    opportunity(search:$search){
      title
      start_time
      end_time
      tags
      location_name
      street_address
      street_address2
      city
      state
      zip
      location_notes
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
