
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
    { title: 'meet', description: 'General meeting' }, // 0 
    { title: 'phone', description: 'Calling voters' }, // 1 
    { title: 'canvass', description: 'Door to door' }, // 2 
    { title: 'outreach', description: 'Public outreach' }, // 3 
    { title: 'rallies', description: 'Rallies, marches' }, // 4 
    { title: 'visibility', description: 'Visibility, visual arts' }, // 5 
    { title: 'neighborhood', description: 'Organize neighborhood' }, // 6
    { title: 'issue groups', description: 'Organize issue groups' }, // 7
    { title: 'host', description: 'Host an event' }, // 8 
    { title: 'event', description: 'Event production' }, // 9 
    { title: 'policy', description: 'Policy research' }, // 10 
    { title: 'communication', description: 'Communication' }, // 11
    { title: 'polling', description: 'Polling, analytics' }, // 12 
    { title: 'writing', description: 'Writing, editing' }, // 13 
    { title: 'press', description: 'Press relations' }, // 14 
    { title: 'social', description: 'Email, social media' }, // 15 
    { title: 'website', description: 'Website, software' }, // 16 
    { title: 'design', description: 'Design, production' }, // 17 
    { title: 'coordinate', description: 'Coordinate volunteers' }, // 18 
    { title: 'office', description: 'Office admin' }, // 19 
    { title: 'data', description: 'Data management' }, // 20 
    { title: 'legal', description: 'Legal' }, // 21 
    { title: 'accounting', description: 'Accounting' }, // 22
    { title: 'finance', description: 'Fundraising' }, // 23 
  ], ['id', 'title', 'description']);


  return { levels, issueAreas, types, activities };

};
