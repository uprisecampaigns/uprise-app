
module.exports = async (knex, users) => {
  // Deletes ALL existing entries
  await knex('campaigns').del();
  await knex('types').del();
  await knex('issue_areas').del();
  await knex('levels').del();
  await knex('campaigns_types').del();
  await knex('campaigns_issue_areas').del();
  await knex('campaigns_levels').del();

  const campaigns = await knex('campaigns').insert([
    {
      title: 'People for Progress',
      owner_id: users[0].id,
      tags: ['#Progress', '#People']
    },
    {
      title: 'Jane for Mayor',
      owner_id: users[0].id,
      tags: ['#VoteJane', '#ProgressiveMayors', 'Mayors']
    },
    {
      title: 'Bob for Schoolboard',
      owner_id: users[0].id,
      tags: ['#VoteBob', '#SchoolBoardsRock']
    },
  ], ['id']);

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

  const campaignsLevels = await knex('campaigns_levels').insert([
    { campaign_id: campaigns[0].id, level_id: levels[0].id },
    { campaign_id: campaigns[0].id, level_id: levels[3].id },
    { campaign_id: campaigns[1].id, level_id: levels[3].id },
    { campaign_id: campaigns[2].id, level_id: levels[3].id },
  ], ['id']);

  const campaignsIssueAreas = await knex('campaigns_issue_areas').insert([
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[0].id },
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[3].id },
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[4].id },
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[6].id },
    { campaign_id: campaigns[1].id, issue_area_id: issueAreas[0].id },
    { campaign_id: campaigns[1].id, issue_area_id: issueAreas[1].id },
    { campaign_id: campaigns[2].id, issue_area_id: issueAreas[1].id },
  ], ['id']);

  const campaignsTypes = await knex('campaigns_types').insert([
    { campaign_id: campaigns[0].id, type_id: types[3].id },
    { campaign_id: campaigns[0].id, type_id: types[2].id },
    { campaign_id: campaigns[1].id, type_id: types[0].id },
    { campaign_id: campaigns[2].id, type_id: types[0].id },
  ], ['id']);

  return { campaigns, levels, issueAreas, types };

};
