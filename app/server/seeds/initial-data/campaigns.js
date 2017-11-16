const vaCampaigns = require('./campaigns/VA-campaigns-4.18.17.json');
const vaKeywords = require('./campaigns/VA-keywords-4.18.17.json');

module.exports = async ({
  knex, users, types, activities, levels, issueAreas,
}) => {
  // Deletes ALL existing entries
  await knex('campaigns').del();
  await knex('campaigns_types').del();
  await knex('campaigns_issue_areas').del();
  await knex('campaigns_levels').del();

  const maxTagNum = 6;

  const pickTag = tags => tags[Math.floor(Math.random(0, tags.length) * 10)];

  const genTags = (tags) => {
    const tagNum = Math.floor(Math.random(0, maxTagNum) * 10);
    const chosenTags = [];

    let i = 0;

    while (i < tagNum) {
      const tag = pickTag(tags);
      if (!chosenTags.includes(tag)) {
        chosenTags.push(tag);
        i++;
      }
    }

    return [...new Set(chosenTags)];
  };

  vaCampaigns.forEach((campaign) => {
    campaign.tags = genTags(vaKeywords);
  });

  const campaigns = await knex('campaigns').insert(vaCampaigns, ['id', 'title']);

  const vaCampaignsLevelsData = campaigns.map(campaign => ({
    campaign_id: campaign.id,
    level_id: levels[1].id,
  }));

  const campaignsLevels = await knex('campaigns_levels').insert(vaCampaignsLevelsData, ['id']);

  const vaCampaignsTypesData = campaigns.map(campaign => ({
    campaign_id: campaign.id,
    type_id: types[0].id,
  }));

  const campaignsTypes = await knex('campaigns_types').insert(vaCampaignsTypesData, ['id']);

  const vaCampaignsIssueAreasData = campaigns.map(campaign => ({
    campaign_id: campaign.id,
    issue_area_id: issueAreas[Math.floor(Math.random(0, 9) * 10)].id,
  }));

  const campaignIssueAreas = await knex('campaigns_issue_areas').insert(vaCampaignsIssueAreasData, ['id']);

  return {
    campaigns, levels, issueAreas, types,
  };
};
