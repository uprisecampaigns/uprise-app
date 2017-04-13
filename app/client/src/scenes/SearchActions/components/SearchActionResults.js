
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
const isEqual = require('lodash.isequal');

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchActionResults extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    actions: PropTypes.array,
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (!nextProps.graphqlLoading && typeof nextProps.actions === 'object');
  }

  render() {
    const { sortBy, ...props } = this.props;

    const actionsSort = (a, b) => {
      if (sortBy.name === 'date') {
        if (sortBy.descending) {
          return moment(a.start_time).isBefore(moment(b.start_time)) ? 1 : -1;
        } else {
          return moment(a.start_time).isAfter(moment(b.start_time)) ? 1 : -1;
        }
      } else if (sortBy.name === 'campaignName') {
        if (sortBy.descending) {
          return (a.campaign.title < b.campaign.title) ? 1 : -1;
        } else {
          return (a.campaign.title > b.campaign.title) ? 1 : -1;
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

      return (
        <Link to={'/action/' + action.slug}>
          <Card key={index}>
            <CardHeader
              title={action.title}
              subtitle={
                <Link to={'/campaign/' + action.campaign.slug} className={s.campaignLink}>{action.campaign.title}</Link>
              }
            >
              { startTime && <div>Date: {startTime.format('ddd MMM Do, YYYY')}</div> }
              { startTime && <div>Time: {startTime.format('h:mm a') + ' - ' + endTime.format('h:mm a')}</div> }
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
          ) : actions 
        }
      </div>
    );
  }
}


export default SearchActionResults;
