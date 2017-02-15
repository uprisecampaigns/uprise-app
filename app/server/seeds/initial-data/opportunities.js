const moment = require('moment');

module.exports = async (knex, { users, campaigns, levels, issueAreas, types }) => {
  // Deletes ALL existing entries
  await knex('opportunities').del();
  await knex('activities').del();
  await knex('opportunities_activities').del();
  await knex('opportunities_types').del();
  await knex('opportunities_issue_areas').del();
  await knex('opportunities_levels').del();

  const opportunities = await knex('opportunities').insert([
    {
      title: 'Phone Bank Party',
      owner_id: users[0].id,
      campaign_id: campaigns[0].id,
      start_time: moment().add(1, 'days').toISOString(), 
      end_time: moment().add(1, 'days').add(3, 'hours').toISOString(), 
      tags: ['#Progress', '#People', 'Phone Bank', '#PhoneBanking']
    },
    {
      title: 'Office Work',
      owner_id: users[0].id,
      campaign_id: campaigns[0].id,
      start_time: moment().add(5, 'days'), 
      end_time: moment().add(5, 'days').add(2, 'hours'), 
      tags: ['Office', 'Paperwork', '#Computers']
    },
  ], ['id']);

  const activities = await knex('activities').insert([
    { title: 'meet', description: 'General meeting, discussion, strategy' },
    { title: 'phone', description: 'Calling voters or managing a phone bank' },
    { title: 'canvass', description: 'Talking to voters door to door, managing a team' },
    { title: 'outreach', description: 'Public outreach, leafleting, tabling, voter registration' },
    { title: 'rallies', description: 'Organizing rallies, marches, parades or demonstrations' },
    { title: 'visibility', description: 'Visibility: lawn signs, posters, visual arts' },
    { title: 'precinct', description: 'Organizing my block, precinct, neighborhood' },
    { title: 'political', description: 'Organizing social, issue or identity groups' },
    { title: 'host', description: 'Hosting a small event in my home or business' },
    { title: 'event', description: 'Event production, promotion, A/V, catering, music' },
    { title: 'policy', description: 'Policy or other research, issue expertise' },
    { title: 'advertising', description: 'Communication, advertising, marketing' },
    { title: 'polling', description: 'Polling, market research, analytics' },
    { title: 'writing', description: 'Writing, editing, news reporting, opinion, blogging' },
    { title: 'press', description: 'Public relations, press outreach, booking' },
    { title: 'social', description: 'Email, social media, online organizing' },
    { title: 'website', description: 'Website, software, design, development' },
    { title: 'design', description: 'Graphic design, photo, audio, video production' },
    { title: 'coordinate', description: 'Volunteer coordinating, training, HR, management' },
    { title: 'office', description: 'Office admin, reception, data entry, tech support' },
    { title: 'data', description: 'Data management, voter file admin, CRM systems' },
    { title: 'legal', description: 'Legal assistance, ballot access, voter protection' },
    { title: 'compliance', description: 'Accounting, bookkeeping, FEC compliance' },
    { title: 'finance', description: 'Fundraising' },
  ], ['id']);


  const opportunitiesActivities = await knex('opportunities_activities').insert([
    { opportunity_id: opportunities[0].id, activity_id: activities[1].id },
    { opportunity_id: opportunities[1].id, activity_id: activities[19].id },
  ], ['id']);

  const opportunitiesLevels = await knex('opportunities_levels').insert([
    { opportunity_id: opportunities[0].id, level_id: levels[0].id },
    { opportunity_id: opportunities[0].id, level_id: levels[3].id },
    { opportunity_id: opportunities[1].id, level_id: levels[0].id },
    { opportunity_id: opportunities[1].id, level_id: levels[3].id },
  ], ['id']);

  const opportunitiesIssueAreas = await knex('opportunities_issue_areas').insert([
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[3].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[2].id },
  ], ['id']);

  const opportunitiesTypes = await knex('opportunities_types').insert([
    { opportunity_id: opportunities[0].id, type_id: types[1].id },
    { opportunity_id: opportunities[0].id, type_id: types[3].id },
  ], ['id']);

  return opportunities;

};
