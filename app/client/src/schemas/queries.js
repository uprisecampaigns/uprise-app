import gql from 'graphql-tag';

export const CampaignsQuery = gql`
  query CampaignsQuery($search:CampaignSearchInput) {
    campaigns(search:$search){
      title
    }
  }
`;

export const CampaignQuery = gql`
  query CampaignQuery($search:CampaignInput) {
    campaign(search:$search){
      title
      slug
      description
      tags
      owner {
        first_name
        last_name
        email
      }
    }
  }
`;
 
export const OpportunityQuery = gql`
  query OpportunityQuery($search:OpportunityInput) {
    opportunity(search:$search){
      title
      slug
      description
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
      activities {
        title
        description
      }
      issue_areas {
        title
      }
      owner {
        first_name
        last_name
        email
      }
      campaign {
        title
        slug
      }
    }
  }
`;
 
export const OpportunitiesQuery = gql`
  query OpportunitiesQuery($search:OpportunitySearchInput) {
    opportunities(search:$search){
      title
      slug
      description
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
      activities {
        title
        description
      }
      issue_areas {
        title
      }
      owner {
        email
      }
      campaign {
        title
        slug
      }
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

export const IssueAreasQuery = gql`
  query IssueAreasQuery {
    issueAreas {
      title
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
