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

export const CreateActionMutation = gql`
  mutation CreateActionMutation ($data:CreateActionInput) {
    createAction(data:$data){
      id
      title
      slug
    }
  }
`;

export const EditActionMutation = gql`
  mutation EditActionMutation ($data:EditActionInput) {
    editAction(data:$data){
      id
      title
      slug
    }
  }
`;

export const ActionSignupMutation = gql`
  mutation ActionSignupMutation ($actionId:String!) {
    actionSignup(actionId:$actionId){
      id
      title
      slug
    }
  }
`;

export const CancelActionSignupMutation = gql`
  mutation CancelActionSignupMutation ($actionId:String!) {
    cancelActionSignup(actionId:$actionId){
      id
      title
      slug
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

export const DeleteActionMutation = gql`
  mutation DeleteActionMutation ($data:DeleteActionInput) {
    deleteAction(data:$data)
  }
`;

export const DeleteCampaignMutation = gql`
  mutation DeleteCampaignMutation ($data:DeleteCampaignInput) {
    deleteCampaign(data:$data)
  }
`;
