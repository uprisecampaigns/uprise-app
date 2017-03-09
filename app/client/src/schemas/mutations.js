import gql from 'graphql-tag';

export const CreateCampaignMutation = gql`
  mutation CreateCampaignMutation ($data:CreateCampaignInput) {
    createCampaign(data:$data){
      title
      slug
    }
  }
`;
