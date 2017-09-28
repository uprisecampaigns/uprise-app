const getValidSlug = require('models/getValidSlug');
const vaActions = require('./actions/VA-actions-4.21.17.json');

const moment = require('moment');

module.exports = async ({ knex, users, activities, campaigns, levels, issueAreas, types }) => {
  // Deletes ALL existing entries
  await knex('actions').del();
  await knex('actions_activities').del();
  await knex('actions_types').del();
  await knex('actions_issue_areas').del();
  await knex('actions_levels').del();

  const antoniaUser = await knex.table('users').where('email', 'antonia@uprise.org').first();

  const actionActivities = [];

  const actions = [];
  for (const action of vaActions) {
    const skills = action.skills;
    delete action.skills;

    action.owner_id = antoniaUser.id;
    action.start_time = moment(action.start_time).format(),
    action.end_time = moment(action.end_time).format(),
    action.campaign_id = campaigns.find(campaign => campaign.title === action.campaign_title).id;
    action.slug = await getValidSlug(action.title);
    delete action.campaign_title;
    const result = await knex('actions').insert([action], ['id', 'title']);
    actions.push(result[0]);
    actionActivities.push({ id: result[0].id, activity: skills });
  }

  console.log('inserted actions: ');
  console.log(actions);

  // const actions = await knex('actions').insert(vaActions, ['id', 'title']);

  // const actionsActivities = await knex('actions_activities').insert([
  //   { action_id: actions[0].id, activity_id: activities[8].id },
  //   { action_id: actions[0].id, activity_id: activities[9].id },
  //   { action_id: actions[1].id, activity_id: activities[13].id },
  //   { action_id: actions[1].id, activity_id: activities[15].id },
  //   { action_id: actions[2].id, activity_id: activities[2].id },
  //   { action_id: actions[3].id, activity_id: activities[9].id },
  //   { action_id: actions[3].id, activity_id: activities[13].id },
  //   { action_id: actions[4].id, activity_id: activities[1].id },
  //   { action_id: actions[5].id, activity_id: activities[1].id },
  //   { action_id: actions[6].id, activity_id: activities[19].id },
  // ], ['id']);

  const actionActivitiesData = actionActivities.map((action) => {
    console.log(activities);
    console.log(action);

    const foundActivity = activities.find(activity => (activity.description.toLowerCase() === action.activity.toLowerCase()));

    console.log(foundActivity);
    return {
      action_id: action.id,
      activity_id: foundActivity.id,
    };
  });

  console.log('actionActivitiesData');
  console.log(actionActivitiesData);
  const actionsActivitiesResult = await knex('actions_activities').insert(actionActivitiesData);

  const vaActionLevels = actions.map(action => ({ action_id: action.id, level_id: levels[1].id }));
  const actionsLevels = await knex('actions_levels').insert(vaActionLevels, ['id']);

  const vaActionsIssueAreasData = actions.map(action => ({
    action_id: action.id,
    issue_area_id: issueAreas[Math.floor(Math.random(0, 9) * 10)].id,
  }));

  const actionsIssueAreas = await knex('actions_issue_areas').insert(vaActionsIssueAreasData, ['id']);

  const vaActionTypes = actions.map(action => ({ action_id: action.id, type_id: types[0].id }));
  const actionsTypes = await knex('actions_types').insert(vaActionTypes, ['id']);

  return actions;
};
