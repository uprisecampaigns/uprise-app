
module.exports = async (knex, users) => {
  const activities = [
    { title: 'Art, design, audio, video', description: 'Produce content, graphic design, video or audio' },
    { title: 'Bookkeeping', description: 'Budgets, contributions, expendtures, FEC reporting' },
    { title: 'Calling voters', description: 'Phone bank or host a phone bank in your home' },
    { title: 'Communications', description: 'Advertising and marketing, messaging and persuasion' },
    { title: 'Coordinate volunteers', description: 'Manage a team of volunteers or a lead a project' },
    { title: 'Data management', description: 'Enter data or manage donor, volunteer or voter data' },
    { title: 'Direct voter outreach', description: 'Tabling, fairs and festivals, street teams, hold signs' },
    { title: 'Door to door', description: 'Canvass, mobilize supporters or persuade undecideds' },
    { title: 'Drive volunteers, voters', description: 'Drive candidates, volunteers, voters to polls, deliveries' },
    { title: 'Email, social media', description: 'Email outreach, contact mgmt, social media content' },
    { title: 'Food and drink', description: 'Provide food or drink for volunteers or house parties' },
    { title: 'Fundraising', description: 'Research donors, plan events, assist with call time' },
    { title: 'Host a meet and greet', description: 'Host a house party or event in your building or business' },
    { title: 'Lawn signs, visibility', description: 'Deliver lawn signs, 4x8s, painting or light construction' },
    { title: 'Legal, voter protection', description: 'Campaign filing, ballot access, FEC law, voters\' rights' },
    { title: 'Lobbying', description: 'Call, write or visit legislators, track bills' },
    { title: 'Meeting', description: 'Attend strategy or planning meetings, discussions ' },
    { title: 'Office admin', description: 'Help with reception, scheduling, mailings, materials' },
    { title: 'Online research', description: 'Look up policies, people, events or other opportunities' },
    { title: 'Organize issue groups', description: 'Outreach to people who share an identity or interest' },
    { title: 'Organize neighbors', description: 'Outreach to precinct, people who live near you' },
    { title: 'Policy', description: 'Reseach and write policy briefs and statements' },
    { title: 'Press relations', description: 'Maintain relationships, press lists, releases, booking' },
    { title: 'Produce big events', description: 'Promote, cater, AV, lighting, décor, entertainment' },
    { title: 'Protest, demonstration', description: 'Organize rallies, marches, parades, demonstrations' },
    { title: 'Tech, software, coding', description: 'Use or develop websites and political tech tools, IT' },
    { title: 'Training', description: 'Organize trainings or be a trainer' },
    { title: 'Volunteer housing', description: 'Provide housing for an organizer or volunteer' },
    { title: 'Website admin', description: 'Manage website, add content, respond to inquiries' },
    { title: 'Writing, editing', description: 'Write or edit speeches, letters, blog posts, content' },
  ];

  await Promise.all(activities.map(async (activity) => {
    const exists = await knex('activities').where('title', activity.title);

    if (exists.length === 0) {
      await knex('activities').insert(activity);
    }
  }));
};
