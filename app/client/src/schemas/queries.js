import gql from 'graphql-tag';

export const CampaignsQuery = gql`
  query CampaignsQuery($search:CampaignSearchInput) {
    campaigns(search:$search){
      id
      title
      description
      slug
      tags
      city
      state
      profile_subheader
      profile_image_url
      issue_areas {
        id
        title
      }
      owner {
        id
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
  query CampaignQuery($search:CampaignQueryInput) {
    campaign(search:$search){
      id
      title
      slug
      description
      profile_subheader
      tags
      subscribed
      street_address
      street_address2
      city
      state
      zipcode
      location_state
      location_district_number
      location_type 
      legislative_district_type
      zipcode_list
      phone_number
      website_url
      profile_image_url
      owner {
        id
        first_name
        last_name
        email
      }
      issue_areas {
        id
        title
      }
      levels {
        id
        title
      }
      types {
        id
        title
      }
    }
  }
`;
 
export const ActionQuery = gql`
  query ActionQuery($search:ActionQueryInput) {
    action(search:$search){
      id
      title
      internal_title
      slug
      description
      start_time
      end_time
      tags
      virtual
      attending
      location_name
      street_address
      street_address2
      city
      state
      zipcode
      location_notes
      activities {
        id
        title
        description
      }
      issue_areas {
        id
        title
      }
      owner {
        id
        first_name
        last_name
        email
      }
      campaign {
        id
        title
        slug
      }
      issue_areas {
        id
        title
      }
      levels {
        id
        title
      }
      types {
        id
        title
      }
    }
  }
`;
 
export const ActionsQuery = gql`
  query ActionsQuery($search:ActionSearchInput) {
    actions(search:$search){
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
        id
        title
        description
      }
      issue_areas {
        id
        title
      }
      owner {
        id
        email
      }
      campaign {
        id
        title
        slug
        profile_image_url
      }
    }
  }
`;
 
export const MyActionsQuery = gql`
  query MyActionsQuery {
    myActions {
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
      owner {
        id
        first_name
        last_name
        email
      }
      campaign {
        id
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
 
export const SignedUpVolunteersQuery = gql`
  query SignedUpVolunteersQuery ($search:ActionQueryInput) {
    signedUpVolunteers(search:$search){
      id
      first_name
      last_name
      email
    }
  }
`;
  
export const SubscribedUsersQuery = gql`
  query SubscribedUsersQuery ($search:CampaignQueryInput) {
    subscribedUsers(search:$search){
      id
      first_name
      last_name
      email
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
      phone_number
    }
  }
`;

export const EmailAvailable = gql`
  query EmailAvailable($email: String!) {
    emailAvailable(email:$email) 
  }
`;

export const FileUploadSignature = gql`
  query FileUploadSignature($input: FileToUpload!) {
    fileUploadSignature(input:$input) {
      url
    }
  }
`;
