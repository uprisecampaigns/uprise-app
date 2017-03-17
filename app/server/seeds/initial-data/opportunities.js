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
      start_time: moment('2017-03-11 18:00').format(), 
      end_time: moment('2017-03-11 21:00').format(), 
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
      start_time: moment('2017-03-13 09:00').format(), 
      end_time: moment('2017-03-13 17:00').format(), 
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
      start_time: moment('2017-03-19 13:00').format(), 
      end_time: moment('2017-03-19 18:00').format(), 
      city: 'Richmond',
      state: 'VA',
      tags: [
        '#schoolboard', 'education', 'canvass'
      ]
    },
    {
      title: 'HouseParty for Marian Shultz',
      slug: 'houseparty-for-marian-shultz',
      description: `
Help raise awareness and funds to support Marian Shultz's run for State Senate. Speakers include former Lt. Governor as well as Hive Studio's very own Mari Wilson. Looking for volunteers to help set up and break down the event. Have experience with sound systems? We need your help. RSVP. 
`,
      owner_id: users[3].id,
      campaign_id: campaigns[1].id,
      start_time: moment('2017-03-11 17:00').format(), 
      end_time: moment('2017-03-11 20:00').format(), 
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
      start_time: moment('2017-03-20 17:00').format(), 
      end_time: moment('2017-03-20 20:00').format(), 
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
      title: 'Phone Bank Party',
      slug: 'phone-bank-party',
      description: `
People do not make revolution eagerly any more than they do war. There is this difference, however, that in war compulsion plays the decisive rôle, in revolution there is no compulsion except that of circumstances. 

A revolution takes place only when there is no other way out. And the insurrection, which rises above a revolution like a peak in the mountain chain of its events, can no more be evoked
 at will than the revolution as a whole. 

The masses advance and retreat several times before they make up their minds to the final assault.Conspiracy is ordinarily contrasted to insurrection as the deliberate undertaking of a minority to a 
spontaneous movement of the majority.
`,
      owner_id: users[0].id,
      zipcode: '94703',
      campaign_id: campaigns[4].id,
      start_time: moment().add(1, 'days').local().format(), 
      end_time: moment().add(1, 'days').add(3, 'hours').local().format(), 
      city: 'Berkeley',
      state: 'CA',
      tags: ['#Progress', '#People', 'Phone Bank', '#PhoneBanking']
    },
    {
      title: 'Office Work',
      slug: 'office-work',
      description: `
The Work of Art in the Age of Mechanical Reproduction production of innocence the notion of the public abundance David Cohn fair use Article Skimmer rubber cement metered model curation audience atomization overcome writing masthead, Pulse rubber cement Pulse natural-born blogger curation WordPress RSS cancel my subscription reporting media diet advertising Google+ iPhone app, Quora CTR fair use RT Like button vast wasteland CNN leaves it there production of innocence Arianna shoot a video Google+.
`,
      zipcode: '90007',
      owner_id: users[0].id,
      campaign_id: campaigns[4].id,
      start_time: moment().add(5, 'days').local().format(), 
      end_time: moment().add(5, 'days').add(2, 'hours').local().format(), 
      city: 'Los Angeles',
      state: 'CA',
      tags: ['Office', 'Paperwork', '#Computers']
    },
    {
      title: 'Fundraising Party',
      slug: 'fundraising-party',
      description: `
That they are endowed by their Creator with certain inalienable rights. The audacity of hope! In the end, that is God's greatest gift to us, the bedrock of this nation. So I've got news for you, John McCain. That is why I intend to personally pursue this outcome with all the patience that the task requires. People in every country should be free to choose and live their faith based upon the persuasion of the mind, heart, and soul.

They know they have to work hard to get ahead - and they want to. It's that folks are hungry for change - they're hungry for something new. The Palestinian Authority must develop its capacity to govern, with institutions that serve the needs of its people.

Tonight, we gather to affirm the greatness of our nation - not because of the height of our skyscrapers, or the power of our military, or the size of our economy. In Washington, they call this the Ownership Society, but what it really means is - you're on your own. No health care? The market will fix it. This truth transcends nations and peoples - a belief that isn't new; that isn't black or white or brown; that isn't Christian, or Muslim or Jew. 
`,
      zipcode: '94601',
      owner_id: users[0].id,
      campaign_id: campaigns[4].id,
      start_time: moment().add(10, 'days').local().format(), 
      end_time: moment().add(10, 'days').add(2, 'hours').local().format(), 
      city: 'Oakland',
      state: 'CA',
      tags: ['Fundraising', 'Party']
    },
    {
      title: 'Blog Post Writing',
      slug: 'blog-post-writing',
      description: `
And meeting them won't be easy. Out of work? Tough luck. We all put our country first. Because I've seen it. This construction violates previous agreements and undermines efforts to achieve peace. I do not believe that women must make the same choices as men in order to be equal, and I respect those women who choose to live their lives in traditional roles.

We have real enemies in the world. Like other black churches, Trinity's services are full of raucous laughter and sometimes bawdy humor. What's remarkable is not how many failed in the face of discrimination, but rather how many men and women overcame the odds; how many were able to make a way out of no way for those like me who would come after them. It is where our union grows stronger. It is based upon cultural and historical ties, and the recognition that the aspiration for a Jewish homeland is rooted in a tragic history that cannot be denied. The obligations that the parties have agreed to under the Road Map are clear.

We will all have to make concessions to achieve this. But what we know - what we have seen - is that America can change. For we have a choice in this country. For decades, there has been a stalemate: two peoples with legitimate aspirations, each with a painful history that makes compromise elusive. And I will host a Summit on Entrepreneurship this year to identify how we can deepen ties between business leaders, foundations and social entrepreneurs in the United States and Muslim communities around the world. 
`,
      zipcode: '94577',
      city: 'San Leandro',
      state: 'CA',
      owner_id: users[0].id,
      campaign_id: campaigns[4].id,
      start_time: moment().add(12, 'days').local().format(), 
      end_time: moment().add(12, 'days').add(2, 'hours').local().format(), 
      tags: ['Blogging']
    },
    {
      title: 'Canvassing Neighbors',
      slug: 'canvassing-neighbors',
      description: `
And I heard Reverend Jeremiah A. And there's another issue we must confront as well.

I stand here knowing that my story is part of the larger American story, that I owe a debt to all of those who came before me, and that, in no other country on earth, is my story even possible. John Kerry believes in an America where hard work is rewarded; so instead of offering tax breaks to companies shipping jobs overseas, he offers them to companies creating jobs here at home. That won't keep America safe. But we should choose the right path, not just the easy path. 
`,
      zipcode: '80304',
      owner_id: users[0].id,
      campaign_id: campaigns[5].id,
      start_time: moment().add(17, 'days').local().format(), 
      end_time: moment().add(17, 'days').add(2, 'hours').local().format(), 
      city: 'Boulder',
      state: 'CO',
      tags: ['Neighbors']
    },
  ], ['id']);

  const activities = await knex('activities').insert([
    { title: 'meet', description: 'General meeting' },
    { title: 'phone', description: 'Calling voters' },
    { title: 'canvass', description: 'Door to door' },
    { title: 'outreach', description: 'Public outreach' },
    { title: 'rallies', description: 'Rallies, marches' },
    { title: 'visibility', description: 'Visibility, visual arts' },
    { title: 'precinct', description: 'Organize neighborhood' },
    { title: 'political', description: 'Organize issue groups' },
    { title: 'host', description: 'Host an event' },
    { title: 'event', description: 'Event production' },
    { title: 'policy', description: 'Policy research' },
    { title: 'advertising', description: 'Communication' },
    { title: 'polling', description: 'Polling, analytics' },
    { title: 'writing', description: 'Writing, editing' },
    { title: 'press', description: 'Press relations' },
    { title: 'social', description: 'Email, social media' },
    { title: 'website', description: 'Website, software' },
    { title: 'design', description: 'Design, production' },
    { title: 'coordinate', description: 'Coordinate volunteers' },
    { title: 'office', description: 'Office admin' },
    { title: 'data', description: 'Data management' },
    { title: 'legal', description: 'Legal' },
    { title: 'compliance', description: 'Accounting' },
    { title: 'finance', description: 'Fundraising' },
  ], ['id']);


  const opportunitiesActivities = await knex('opportunities_activities').insert([
    { opportunity_id: opportunities[0].id, activity_id: activities[1].id },
    { opportunity_id: opportunities[1].id, activity_id: activities[19].id },
    { opportunity_id: opportunities[2].id, activity_id: activities[8].id },
    { opportunity_id: opportunities[3].id, activity_id: activities[13].id },
    { opportunity_id: opportunities[4].id, activity_id: activities[2].id },
  ], ['id']);

  const opportunitiesLevels = await knex('opportunities_levels').insert([
    { opportunity_id: opportunities[0].id, level_id: levels[0].id },
    { opportunity_id: opportunities[0].id, level_id: levels[3].id },
    { opportunity_id: opportunities[1].id, level_id: levels[0].id },
    { opportunity_id: opportunities[1].id, level_id: levels[3].id },
    { opportunity_id: opportunities[2].id, level_id: levels[3].id },
    { opportunity_id: opportunities[3].id, level_id: levels[3].id },
    { opportunity_id: opportunities[4].id, level_id: levels[3].id },
  ], ['id']);

  const opportunitiesIssueAreas = await knex('opportunities_issue_areas').insert([
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[0].id, issue_area_id: issueAreas[3].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[1].id },
    { opportunity_id: opportunities[1].id, issue_area_id: issueAreas[2].id },
    { opportunity_id: opportunities[2].id, issue_area_id: issueAreas[0].id },
    { opportunity_id: opportunities[3].id, issue_area_id: issueAreas[0].id },
    { opportunity_id: opportunities[4].id, issue_area_id: issueAreas[0].id },
  ], ['id']);

  const opportunitiesTypes = await knex('opportunities_types').insert([
    { opportunity_id: opportunities[0].id, type_id: types[1].id },
    { opportunity_id: opportunities[0].id, type_id: types[3].id },
    { opportunity_id: opportunities[2].id, type_id: types[0].id },
    { opportunity_id: opportunities[3].id, type_id: types[0].id },
    { opportunity_id: opportunities[4].id, type_id: types[0].id },
  ], ['id']);

  return opportunities;

};
