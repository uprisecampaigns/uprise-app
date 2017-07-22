
import MyCampaignsQuery from 'schemas/queries/MyCampaignsQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';


export default ({ path, component }) => ({

  path,

  async action(context) {
    try {
      const [myCampaignsResults, campaignResult] = await Promise.all([
        context.apolloClient.query({
          query: MyCampaignsQuery,
        }),
        context.apolloClient.query({
          query: CampaignQuery,
          variables: {
            search: {
              slug: context.params.slug,
            },
          },
        }),
      ]);

      if (typeof myCampaignsResults.data.myCampaigns === 'object' &&
          myCampaignsResults.data.myCampaigns.length > 0) {
        const myCampaignsSlugs = myCampaignsResults.data.myCampaigns.map(campaign => campaign.slug);

        if (myCampaignsSlugs.includes(context.params.slug)) {
          return {
            title: campaignResult.data.campaign.title,
            component: component(campaignResult.data.campaign),
          };
        }
      }

      return {
        redirect: '/organize',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/organize',
      };
    }
  },
});
