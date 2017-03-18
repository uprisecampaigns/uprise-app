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
      title: 'House Party Fundraiser for Darryl Wade',
      slug: 'house-party-fundraiser-for-darryl-wade',
      description: `
Darryl Wade needs your support. Help us throw a successful house party to raise awareness and funds to elect Darryl Wade as this city's next Mayor. We are especially looking for volunteers to cater appetizers and to break down and set up the event. Also we will need a volunteer to collect pledges and gather emails at the door.  
`,
      owner_id: users[1].id,
      zipcode: '98102',
      campaign_id: campaigns[2].id,
      start_time: moment('2017-04-11 18:00').format(), 
      end_time: moment('2017-04-11 21:00').format(), 
      city: 'Springfield',
      state: 'VA',
      tags: [
        'fundraising', 'party', 'house party', 'mayor', 
        '#DarrylForMayor', '#JobsForVirginia', '#EducationNow',
        '#gunviolence', '#obamacare', 'cooking', 'catering',
        'event', 'hosting'
      ]
    },
    {
      title: 'Blog Post Writing',
      slug: 'blog-post-writing-for-darryl-wade',
      description: `
We need a skilled volunteer to write relevant, accessible blog posts for a blog associated with the Daryll Wade For Mayor website. Volunteers can work remotely. Please contact our John Anderson for more information. 
`,
      owner_id: users[1].id,
      campaign_id: campaigns[2].id,
      start_time: moment('2017-04-13 09:00').format(), 
      end_time: moment('2017-04-13 17:00').format(), 
      city: 'Springfield',
      state: 'VA',
      tags: [
        '#DarrylForMayor', '#JobsForVirginia', '#EducationNow',
        '#gunviolence', '#obamacare', 'writing', 'social media',
        'blogging', 'blog'
      ]
    },
    {
      title: 'Canvassing Richmond Fan District',
      slug: 'canvassing-richmond-fan-district',
      description: `
No experience necessary!  We need volunteers to knock on doors and talk to neighbors about James Cole, the first student in our city's history to run for schoolboard. James Cole fights for an educational system that puts students first, values teachers above profits, and he needs our help to get elected. Please meet us at Park and N. Granby at 1pm sharp to help spread the word.
`,
      owner_id: users[6].id,
      campaign_id: campaigns[3].id,
      start_time: moment('2017-04-19 13:00').format(), 
      end_time: moment('2017-04-19 18:00').format(), 
      city: 'Richmond',
      state: 'VA',
      tags: [
        '#schoolboard', 'education', 'canvass'
      ]
    },
    {
      title: 'House Party for Marian Shultz',
      slug: 'house-party-for-marian-shultz',
      description: `
Help raise awareness and funds to support Marian Shultz's run for State Senate. Speakers include former Lt. Governor as well as Hive Studio's very own Mari Wilson. Looking for volunteers to help set up and break down the event. Have experience with sound systems? We need your help. RSVP. 
`,
      owner_id: users[3].id,
      campaign_id: campaigns[1].id,
      start_time: moment('2017-04-11 17:00').format(), 
      end_time: moment('2017-04-11 20:00').format(), 
      city: 'Fairfax',
      state: 'VA',
      tags: [
        '#ShultzForStateSenate', '@MarianShultz', '#EducationNow', '#JobsForVirginia',
        '#ProgressForPeople', '#obamacare', '#ACA', '#womensday', '#SenateVA',
        'house party', 'party'
      ]
    },
    {
      title: 'Tuesday Night Phone Bank for George Brown',
      slug: 'tuesday-night-phone-bank-for-george-brown',
      description: `
Do you have experience phonebanking or IT support? We need volunteers with these skills and volunteers who can follow a script and make calls to fellow Virginians on behalf of George Brown, running for state Governor.  We plan to call voters every tuesday night until election night to raise support and win! Virtual volunteering is possible, contact the organizer about how to install our virtual phone bank software at home. Volunteers who can donate snacks and beverages and volunteers with IT support experience are also needed to make this a successful event.
`,
      owner_id: users[1].id,
      campaign_id: campaigns[1].id,
      start_time: moment('2017-03-27 17:00').format(), 
      end_time: moment('2017-03-27 20:00').format(), 
      city: 'Fairfax',
      state: 'VA',
      tags: [
        '#GeorgeForGov', '#JobsForVirginia', 'government', 'transportation',
        'healthcare', 'public safety', 'virginia', 'immigration', 'economy',
        '#ProgressForPeople', '#VADemsOfFairfax', '#VirginiaVets', '#ACA',
        '#obamacare', 'veterans', '#gunviolence', '#dems'
      ]
    },
    {
      title: 'Office Work',
      slug: 'office-work',
      description: `
We need 1 or 2 volunteers who can commit to 2-4 hours a week in our downtown office performing a variety of administration tasks in the office such as filing, database entry, and prepping materials for weekly mailouts.  A dedicated, reliable volunteer with some administration experience, or just a knack for organization could really help our organization reach more voters and make more of an impact this season. Please contact our organizer directly for more information or to apply.
`,
      zipcode: '23226',
      owner_id: users[0].id,
      campaign_id: campaigns[4].id,
      start_time: moment('2017-04-16 09:00').format(), 
      end_time: moment('2017-04-16 12:00').format(), 
      city: 'Richmond',
      state: 'VA',
      tags: ['Office', 'Paperwork', '#Computers']
    },
    {
      title: 'PhoneBank for Town Hall Turnout!!',
      slug: 'phone-bank-for-town-hall-turnout',
      description: `
Help us get a big turnout for upcoming Town Hall Meeting next Tuesday. We need volunteers to call voters to make sure they know about this important Town Hall Meeting and ask them to attend. Experience phonebanking is a plus, but not required! We will provide a quick training on how to use the phone system and a script for speaking with callers.  Coffee and snacks provided.  
`,
      zipcode: '23226',
      owner_id: users[0].id,
      start_time: moment('2017-04-01 09:00').format(), 
      end_time: moment('2017-04-01 12:00').format(), 
      campaign_id: campaigns[4].id,
      city: 'Richmond',
      state: 'VA',
      tags: ['#ProgressForPeople', 'Phone Bank', '#PhoneBanking', '#Dems']
    },
  ], ['id']);

  const activities = await knex('activities').insert([
    { title: 'meet', description: 'General meeting' }, // 0 
    { title: 'phone', description: 'Calling voters' }, // 1 
    { title: 'canvass', description: 'Door to door' }, // 2 
    { title: 'outreach', description: 'Public outreach' }, // 3 
    { title: 'rallies', description: 'Rallies, marches' }, // 4 
    { title: 'visibility', description: 'Visibility, visual arts' }, // 5 
    { title: 'precinct', description: 'Organize neighborhood' }, // 6 
    { title: 'political', description: 'Organize issue groups' }, // 7 
    { title: 'host', description: 'Host an event' }, // 8 
    { title: 'event', description: 'Event production' }, // 9 
    { title: 'policy', description: 'Policy research' }, // 10 
    { title: 'advertising', description: 'Communication' }, // 11 
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
    { title: 'compliance', description: 'Accounting' }, // 22 
    { title: 'finance', description: 'Fundraising' }, // 23 
  ], ['id']);


  const opportunitiesActivities = await knex('opportunities_activities').insert([
    { opportunity_id: opportunities[0].id, activity_id: activities[8].id },
    { opportunity_id: opportunities[0].id, activity_id: activities[9].id },
    { opportunity_id: opportunities[1].id, activity_id: activities[13].id },
    { opportunity_id: opportunities[1].id, activity_id: activities[15].id },
    { opportunity_id: opportunities[2].id, activity_id: activities[2].id },
    { opportunity_id: opportunities[3].id, activity_id: activities[9].id },
    { opportunity_id: opportunities[3].id, activity_id: activities[13].id },
    { opportunity_id: opportunities[4].id, activity_id: activities[1].id },
    { opportunity_id: opportunities[5].id, activity_id: activities[1].id },
    { opportunity_id: opportunities[6].id, activity_id: activities[19].id },
  ], ['id']);

  const opportunitiesLevels = await knex('opportunities_levels').insert([
    { opportunity_id: opportunities[0].id, level_id: levels[1].id },
    { opportunity_id: opportunities[1].id, level_id: levels[1].id },
    { opportunity_id: opportunities[2].id, level_id: levels[3].id },
    { opportunity_id: opportunities[3].id, level_id: levels[1].id },
    { opportunity_id: opportunities[4].id, level_id: levels[1].id },
    { opportunity_id: opportunities[5].id, level_id: levels[2].id },
    { opportunity_id: opportunities[5].id, level_id: levels[3].id },
    { opportunity_id: opportunities[6].id, level_id: levels[0].id },
    { opportunity_id: opportunities[6].id, level_id: levels[1].id },
    { opportunity_id: opportunities[6].id, level_id: levels[2].id },
    { opportunity_id: opportunities[6].id, level_id: levels[3].id },
  ], ['id']);

  const opportunitiesIssueAreas = await knex('opportunities_issue_areas').insert([
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[0].id },
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[8].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[0].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[8].id },
    { opportunity_id: opportunities[2].id, issue_area_id: issueAreas[8].id },
    { opportunity_id: opportunities[3].id, issue_area_id: issueAreas[8].id },
    { opportunity_id: opportunities[3].id, issue_area_id: issueAreas[3].id },
    { opportunity_id: opportunities[4].id, issue_area_id: issueAreas[8].id },
    { opportunity_id: opportunities[4].id, issue_area_id: issueAreas[3].id },
    { opportunity_id: opportunities[4].id, issue_area_id: issueAreas[9].id },
    { opportunity_id: opportunities[5].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[5].id, issue_area_id: issueAreas[3].id },
    { opportunity_id: opportunities[6].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[6].id, issue_area_id: issueAreas[3].id },
  ], ['id']);

  const opportunitiesTypes = await knex('opportunities_types').insert([
    { opportunity_id: opportunities[0].id, type_id: types[0].id },
    { opportunity_id: opportunities[1].id, type_id: types[0].id },
    { opportunity_id: opportunities[2].id, type_id: types[0].id },
    { opportunity_id: opportunities[3].id, type_id: types[0].id },
    { opportunity_id: opportunities[4].id, type_id: types[0].id },
  ], ['id']);

  return opportunities;

};
