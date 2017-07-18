
import MyCampaignsQuery from 'schemas/queries/MyCampaignsQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActionQuery from 'schemas/queries/ActionQuery.graphql';


export default ({ path, component }) => ({

  path,

  async action(context) {
    let myCampaignsResults;
    let campaignResult;
    let actionResult;

    try {
      [myCampaignsResults, campaignResult, actionResult] = await Promise.all([
        context.apolloClient.query({
          query: MyCampaignsQuery,
        }),
        context.apolloClient.query({
          query: CampaignQuery,
          variables: {
            search: {
              slug: context.params.campaignSlug,
            },
          },
        }),
        context.apolloClient.query({
          query: ActionQuery,
          variables: {
            search: {
              slug: context.params.actionSlug,
            },
          },
        }),
      ]);
    } catch (e) {
      console.error(e);
      return {
        redirect: `/organize/${context.params.campaignSlug}/actions`,
      };
    }

    if (typeof myCampaignsResults.data.myCampaigns === 'object' &&
        myCampaignsResults.data.myCampaigns.length > 0) {
      const myCampaignsSlugs = myCampaignsResults.data.myCampaigns.map(campaign => campaign.slug);

      if (myCampaignsSlugs.includes(context.params.campaignSlug)) {
        if (typeof actionResult.data.action === 'object' &&
            actionResult.data.action.campaign.id === campaignResult.data.campaign.id) {
          return {
            title: actionResult.data.action.title,
            component: component(campaignResult.data.campaign, actionResult.data.action),
          };
        }
      }
    }

    return {
      redirect: `/organize/${context.params.campaignSlug}/actions`,
    };
  },
});
