import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
const isEqual = require('lodash.isequal');

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchActionResults extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    actions: PropTypes.array,
    items: PropTypes.array,
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (!nextProps.graphqlLoading &&
            this.props.graphqlLoading &&
            typeof nextProps.actions === 'object' ||
            !isEqual(this.props.sortBy, nextProps.sortBy));
  }

  render() {
    const { sortBy, ...props } = this.props;

    // TODO: This is shared by SearchCampaignResults and can definitely be refactored
    const actionsSort = (a, b) => {
      if (sortBy.name === 'date') {
        if (sortBy.descending) {
          return moment(a.start_time).isBefore(moment(b.start_time)) ? 1 : -1;
        } else {
          return moment(a.start_time).isAfter(moment(b.start_time)) ? 1 : -1;
        }
      } else if (sortBy.name === 'campaignName') {
        if (sortBy.descending) {
          return (a.campaign.title.toLowerCase() < b.campaign.title.toLowerCase()) ? 1 : -1;
        } else {
          return (a.campaign.title.toLowerCase() > b.campaign.title.toLowerCase()) ? 1 : -1;
        } 
      }
    }

    const actions = props.actions ? Array.from(props.actions).sort(actionsSort).map( (action, index) => {

      const tags = action.tags ? action.tags.map( (tag, index) => {
        return <span key={index}>{tag}{(index === action.tags.length - 1) ? '' : ', '}</span>;
      }) : [];

      const activities = action.activities ? action.activities.map( (activity, index) => {
        return <span key={index}>{activity.title}{(index === action.activities.length - 1) ? '' : ', '}</span>;
      }) : [];

      const issues = action.issue_areas ? action.issue_areas.map( (issue, index) => {
        return <span key={index}>{issue.title}{(index === action.issue_areas.length - 1) ? '' : ', '}</span>;
      }) : [];

      // TODO: better datetime parsing (not relying on native Date) and checking for missing values
      const startTime = moment(action.start_time);
      const endTime = moment(action.end_time);

      const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
      const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

      return (
        <Link key={index} to={'/action/' + action.slug}>
          <Card>
            <CardHeader
              title={action.title}
              className={s.resultsHeader}
              avatar={action.campaign.profile_image_url ? <Avatar src={action.campaign.profile_image_url} size={40}/> : undefined}
            >
              <div><Link to={'/campaign/' + action.campaign.slug} className={s.subheaderContainer}>{action.campaign.title}</Link></div>
              { startTime && <div>Date: {startTime.format('ddd MMM Do, YYYY')}</div> }
              { startTime && <div>Time: {startTimeString + ' - ' + endTimeString}</div> }
              { (action.city && action.state) && <div>Place: {action.city}, {action.state}</div> }
            </CardHeader>
          </Card>
        </Link>
      );
    }) : [];

    return (
      <div>
        { 
          props.graphqlLoading ? (
            <div className={s.loadingContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          ) : (

            <Infinite elementHeight={200}
              useWindowAsScrollContainer>
              {actions}
            </Infinite>

          )
        }
      </div>
    );
  }
}

export default SearchActionResults;
