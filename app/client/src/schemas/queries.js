import gql from 'graphql-tag';

export const OpportunitiesQuery = gql`
  query OpportunitiesQuery($search:OpportunitySearchInput) {
    opportunities(search:$search){
      title
      start_time
      end_time
      keywords
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

export const ActivitiesQuery = gql`
  query ActivitiesQuery {
    activities {
      title
      description
    }
  }
`;

export const LevelsQuery = gql`
  query LevelsQuery {
    levels {
      title
    }
  }
`;

export const TypesQuery = gql`
  query TypesQuery {
    types {
      title
      description
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
