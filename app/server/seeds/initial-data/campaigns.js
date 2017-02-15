
module.exports = async (knex, userId) => {
  // Deletes ALL existing entries
  await knex('campaigns').del();
  await knex('types').del();
  await knex('issue_areas').del();
  await knex('levels').del();
  await knex('campaigns_types').del();
  await knex('campaigns_issue_areas').del();
  await knex('campaigns_levels').del();

  const campaignRows = await knex('campaigns').insert({
    title: 'People for Progress',
    owner_id: userId,
    tags: ['#Progress', '#People']
  }, ['id']);

  console.log(campaignRows);

  const campaignId1 = campaignRows[0].id;

  const levelIds = await knex('levels').insert([
    { title: 'Federal' },
    { title: 'State' },
    { title: 'County, Regional' },
    { title: 'Local, Municipal' },
  ], ['id']);

  const issueAreaIds = await knex('issue_areas').insert([
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

  const typeIds = await knex('types').insert([
    { title: 'Candidate', description: 'Election' },
    { title: 'Ballot Initiative', description: 'Proposition/Referendum/Amendment' },
    { title: 'Lobbying', description: 'For or against a specific bill' },
    { title: 'Issue Advocacy', description: 'For or against an issue in general' },
  ], ['id']);

  const campaignsLevelsIds = await knex('campaigns_levels').insert([
    { campaign_id: campaignId1, level_id: levelIds[0].id },
    { campaign_id: campaignId1, level_id: levelIds[3].id },
  ], ['id']);

  const campaignsIssueAreasIds = await knex('campaigns_issue_areas').insert([
    { campaign_id: campaignId1, issue_area_id: issueAreaIds[0].id },
    { campaign_id: campaignId1, issue_area_id: issueAreaIds[3].id },
    { campaign_id: campaignId1, issue_area_id: issueAreaIds[4].id },
    { campaign_id: campaignId1, issue_area_id: issueAreaIds[6].id },
  ], ['id']);

  const campaignsTypesIds = await knex('campaigns_types').insert([
    { campaign_id: campaignId1, type_id: typeIds[0].id },
    { campaign_id: campaignId1, type_id: typeIds[3].id },
  ], ['id']);

};
