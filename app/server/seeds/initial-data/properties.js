
module.exports = async (knex, users) => {
  // Deletes ALL existing entries
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

  const activities = await knex('activities').insert([
    { title: 'meet', description: 'Meeting' }, // 0
    { title: 'phone', description: 'Calling voters' }, // 1
    { title: 'canvass', description: 'Door to door' }, // 2
    { title: 'outreach', description: 'Outreach, tabling, street teams' }, // 3
    { title: 'protest', description: 'Protest, demonstration' }, // 4
    { title: 'visibility', description: 'Lawn signs, visibility' }, // 5
    { title: 'precinct', description: 'Organize precinct, neighborhood' }, // 6
    { title: 'issuegroups', description: 'Organize issue groups' }, // 7
    { title: 'host', description: 'Host a meet and greet' }, // 8
    { title: 'event', description: 'Big event production' }, // 9
    { title: 'policy', description: 'Policy' }, // 10
    { title: 'communications', description: 'Communications' }, // 11
    { title: 'writing', description: 'Writing, editing' }, // 12
    { title: 'press', description: 'Press relations' }, // 13
    { title: 'social', description: 'Email, social media' }, // 14
    { title: 'website', description: 'Website, software' }, // 15
    { title: 'design', description: 'Art, design, audio, video' }, // 16
    { title: 'coordinate', description: 'Coordinate volunteers' }, // 17
    { title: 'office', description: 'Office admin' }, // 18
    { title: 'data', description: 'Data management' }, // 19
    { title: 'legal', description: 'Legal, voter protection' }, // 20
    { title: 'bookkeeping', description: 'Bookkeeping' }, // 21
    { title: 'fundraising', description: 'Fundraising' }, // 22
    { title: 'training', description: 'Training' }, // 23
    { title: 'drive', description: 'Drive volunteers, voters' }, // 24
    { title: 'feed', description: 'Feed volunteers' }, // 25
    { title: 'lobby', description: 'Lobbying' }, // 26
    { title: 'research', description: 'Online research' }, // 27
    { title: 'tech', description: 'Tech, software, coding' }, // 28
    { title: 'house', description: 'Volunteer housing' }, // 29

  ], ['id', 'title', 'description']);


  return { levels, issueAreas, types, activities };

};
