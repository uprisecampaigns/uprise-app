
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
      title: 'George Brown for Governor',
      slug: 'goerge-brown-for-gov',
      email: 'george_brown22@example.com',
      street_address: '676 Pine St. Apt. 34',
      city: 'Richmond',
      state: 'VA',
      zipcode: '23219',
      location_state: 'VA',
      location_type: 'statewide',
      phone_number: '2154647781',
      website_url: 'https://GeorgeBrownForGovernor.com',
      description: `
I'm running for Governor of Virginia because our state must be a firewall against hate, corruption and an assault on the Virginia values of decency and progress. That is a wall worth building! This election is not just about the next four years -- but the next generation. Together we can demand better wages, more time with family, paid family leave and better, more affordable education. This is a fight to reclaim the politics and policies of our state for the people and the problem-solvers. You and I can fight together -- and if we stand strong by our values and refuse to back down, I believe we can win.
`,
      owner_id: users[1].id,
      tags: [
        '#GeorgeForGov', '#JobsForVirginia', 'government', 'transportation',
        'healthcare', 'public safety', 'virginia', 'immigration', 'economy',
        '#ProgressForPeople', '#VADemsOfFairfax', '#VirginiaVets', '#ACA',
        '#obamacare', 'veterans', '#gunviolence', '#dems'
      ]
    },
    { 
      title: 'Vote for Marian',
      slug: 'vote-for-marian',
      email: 'marian_shultz19@example.com',
      street_address: '1628 Lone Mountain Rd.',
      city: 'Richmond',
      state: 'VA',
      location_state: 'VA',
      location_district_number: '1',
      location_type: 'legislative-district',
      legislative_district_type: 'state-senate',
      zipcode: '23220',
      phone_number: '3124665959',
      website_url: 'https://ShultzForStateSenate.com',
      description: `
We need to focus on common sense policies that work for the 22nd Senate District, that do not overburden our localities.  We need to acknowledge that education drives our economy: no company is going to move to our area if we don’t have a strong workforce. This is going to be my focus throughout this campaign and in the Virginia Senate.
`,
      owner_id: users[3].id,
      tags: [
        '#ShultzForStateSenate', '@MarianShultz', '#EducationNow', '#JobsForVirginia',
        '#ProgressForPeople', '#obamacare', '#ACA', '#womensday', '#SenateVA'
      ]
    },
    { 
      title: 'Darryl Wade for Richmond Mayor',
      slug: 'darryl-wade-richmond-mayor',
      email: 'darryl_wade83@example.com',
      street_address: '8185 W Ann Road',
      city: 'Richmond',
      state: 'VA',
      zipcode: '23219',
      phone_number: '5853894484',
      website_url: 'https://darrylformayor.com',
      description: `
I have served the city of Richmond for 8 years and during that time, we have created jobs, tackled the important issues of homelessness and safety, and worked towards rebuilding the business district. I hope to continue to serve this great city as your Mayor.

Winning this race will take a true grassroots effort. We need people like you to grow this campaign into a competitive race to win the seat of Mayor for Darryl Wade, so he can continue to bring progressive values and a prosperous future to our city. Join our campaign today.
`,
      owner_id: users[1].id,
      tags: [
        '#DarrylForMayor', '#JobsForVirginia', '#EducationNow',
        '#obamacare', '#gunviolence'
      ]
    },
    { 
      title: 'James Cole for Schoolboard',
      slug: 'james-cole-schoolboard',
      email: 'james_cole67@example.com',
      street_address: '2623 Covington Ln.',
      city: 'Richmond',
      state: 'VA',
      zipcode: '23220',
      phone_number: '8664913667',
      website_url: 'https://JamesColeSchoolboard.com',
      description: `
James Cole was born and raised in Richmond Virginia. He believes that public education is our greatest community ressource and wants to work with teachers, parents, and colleagues to create an environment in which the children of Richmond can thrive. 
`,
      owner_id: users[6].id,
      tags: [
        '#schoolboard', 'education'
      ]
    },
    {
      title: 'People for Progress',
      slug: 'people-for-progress',
      owner_id: users[0].id,
      tags: ['#Progress', '#People']
    },
    {
      title: 'Jane for Mayor',
      slug: 'jane-for-mayor',
      owner_id: users[0].id,
      tags: ['#VoteJane', '#ProgressiveMayors', 'Mayors']
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
    { campaign_id: campaigns[0].id, level_id: levels[1].id },
    { campaign_id: campaigns[1].id, level_id: levels[1].id },
    { campaign_id: campaigns[2].id, level_id: levels[3].id },
    { campaign_id: campaigns[3].id, level_id: levels[3].id },
    { campaign_id: campaigns[4].id, level_id: levels[0].id },
    { campaign_id: campaigns[5].id, level_id: levels[3].id },
  ], ['id']);

  const campaignsIssueAreas = await knex('campaigns_issue_areas').insert([
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[8].id },
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[6].id },
    { campaign_id: campaigns[0].id, issue_area_id: issueAreas[7].id },
    { campaign_id: campaigns[1].id, issue_area_id: issueAreas[8].id },
    { campaign_id: campaigns[1].id, issue_area_id: issueAreas[3].id },
    { campaign_id: campaigns[1].id, issue_area_id: issueAreas[7].id },
    { campaign_id: campaigns[2].id, issue_area_id: issueAreas[3].id },
    { campaign_id: campaigns[3].id, issue_area_id: issueAreas[8].id },
    { campaign_id: campaigns[4].id, issue_area_id: issueAreas[0].id },
    { campaign_id: campaigns[5].id, issue_area_id: issueAreas[5].id },
    { campaign_id: campaigns[5].id, issue_area_id: issueAreas[9].id },
  ], ['id']);

  const campaignsTypes = await knex('campaigns_types').insert([
    { campaign_id: campaigns[0].id, type_id: types[0].id },
    { campaign_id: campaigns[1].id, type_id: types[0].id },
    { campaign_id: campaigns[2].id, type_id: types[0].id },
    { campaign_id: campaigns[3].id, type_id: types[0].id },
    { campaign_id: campaigns[4].id, type_id: types[2].id },
    { campaign_id: campaigns[4].id, type_id: types[3].id },
    { campaign_id: campaigns[5].id, type_id: types[0].id },
  ], ['id']);

  return { campaigns, levels, issueAreas, types };

};
