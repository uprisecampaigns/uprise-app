const vaCampaigns = require('./campaigns/VA-campaigns-4.18.17.json');
const vaKeywords = require('./campaigns/VA-keywords-4.18.17.json');

module.exports = async (knex, users) => {
  // Deletes ALL existing entries
  await knex('campaigns').del();
  await knex('types').del();
  await knex('issue_areas').del();
  await knex('levels').del();
  await knex('campaigns_types').del();
  await knex('campaigns_issue_areas').del();
  await knex('campaigns_levels').del();

  const levels = await knex('levels').insert([
    { title: 'Federal' },
    { title: 'State' },
    { title: 'County, Regional' },
    { title: 'Local, Municipal' },
  ], ['id']);

  const issueAreas = await knex('issue_areas').insert([
    { title: 'Progressive - All' },
    { title: 'Government, Elections' },
    { title: 'Energy, Environment' },
    { title: 'Domestic Economy' },
    { title: 'Security, International' },
    { title: 'Science, Technology' },
    { title: 'Civil Rights and Liberties' },
    { title: 'Health Care' },
    { title: 'Education' },
    { title: 'Immigration' },
  ], ['id']);

  const types = await knex('types').insert([
    { title: 'Candidate', description: 'Election' },
    { title: 'Ballot Initiative', description: 'Proposition/Referendum/Amendment' },
    { title: 'Lobbying', description: 'For or against a specific bill' },
    { title: 'Issue Advocacy', description: 'For or against an issue in general' },
  ], ['id']);

  const maxTagNum = 6;

  const pickTag = (tags) => {
    return tags[Math.floor(Math.random(0,tags.length) * 10)];
  }

  const genTags = (tags) => {
    const tagNum = Math.floor(Math.random(0,maxTagNum) * 10);
    const chosenTags = [];

    let i = 0;

    while (i < tagNum) {
      let tag = pickTag(tags);
      if (!chosenTags.includes(tag)) {
        chosenTags.push(tag);
        i++;
      }
    }

    return [...new Set(chosenTags)];
  }

  vaCampaigns.forEach( (campaign) => {
    campaign.tags = genTags(vaKeywords);
  });

  const campaigns = await knex('campaigns').insert(vaCampaigns , ['id']);

  const vaCampaignsLevelsData = campaigns.map( (campaign) => ({ 
    campaign_id: campaign.id,
    level_id: levels[1].id
  }));

  const campaignsLevels = await knex('campaigns_levels').insert(vaCampaignsLevelsData, ['id']);

  const vaCampaignsTypesData = campaigns.map( (campaign) => ({ 
    campaign_id: campaign.id,
    type_id: types[0].id
  }));

  const campaignsTypes = await knex('campaigns_types').insert(vaCampaignsTypesData, ['id']);

  const vaCampaignsIssueAreasData = campaigns.map( (campaign) => ({ 
    campaign_id: campaign.id,
    issue_area_id: issueAreas[Math.floor(Math.random(0,9) * 10)].id
  }));

  const campaignIssueAreas = await knex('campaigns_issue_areas').insert(vaCampaignsIssueAreasData, ['id']);

  return { campaigns, levels, issueAreas, types };

};
