import gql from 'graphql-tag';

export const CreateCampaignMutation = gql`
  mutation CreateCampaignMutation ($data:CreateCampaignInput) {
    createCampaign(data:$data){
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

export const EditCampaignMutation = gql`
  mutation EditCampaignMutation ($data:EditCampaignInput) {
    editCampaign(data:$data){
      id
      title
      slug
    }
  }
`;


export const DeleteCampaignMutation = gql`
  mutation DeleteCampaignMutation ($data:DeleteCampaignInput) {
    deleteCampaign(data:$data)
  }
`;
