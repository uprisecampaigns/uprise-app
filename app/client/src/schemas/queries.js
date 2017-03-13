import gql from 'graphql-tag';

export const CampaignsQuery = gql`
  query CampaignsQuery($search:CampaignSearchInput) {
    campaigns(search:$search){
      id
      title
      description
      slug
      tags
      issue_areas {
        title
      }
      owner {
        first_name
        last_name
        email
      }
    }
  }
`;

export const MyCampaignsQuery = gql`
  query MyCampaignsQuery{
    myCampaigns{
      id
      title
      slug
    }
  }
`;


export const CampaignTitlesQuery = gql`
  query CampaignTitlesQuery($search:CampaignSearchInput) {
    campaigns(search:$search){
      id
      title
    }
  }
`;


export const CampaignQuery = gql`
  query CampaignQuery($search:CampaignInput) {
    campaign(search:$search){
      id
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
      id
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
      zipcode
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
      id
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
      zipcode
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
      id
      title
      description
    }
  }
`;

export const LevelsQuery = gql`
  query LevelsQuery {
    levels {
      id
      title
    }
  }
`;

export const TypesQuery = gql`
  query TypesQuery {
    types {
      id
      title
      description
    }
  }
`;

export const IssueAreasQuery = gql`
  query IssueAreasQuery {
    issueAreas {
      id
      title
    }
  }
`;

export const MeQuery = gql`
  query MeQuery {
    me {
      id
      first_name
      last_name
      email
      zipcode
    }
  }
`;

export const EmailAvailable = gql`
  query EmailAvailable($email: String!) {
    emailAvailable(email:$email) 
  }
`;
