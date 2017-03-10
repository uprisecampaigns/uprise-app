
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
const isEqual = require('lodash.isequal');

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchOpportunityResults extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    opportunities: PropTypes.array,
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return (!nextProps.graphqlLoading && typeof nextProps.opportunities === 'object');
  }

  render() {
    const { sortBy, ...props } = this.props;

    const opportunitiesSort = (a, b) => {
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

    const opportunities = props.opportunities ? Array.from(props.opportunities).sort(opportunitiesSort).map( (opportunity, index) => {

      const tags = opportunity.tags ? opportunity.tags.map( (tag, index) => {
        return <span key={index}>{tag}{(index === opportunity.tags.length - 1) ? '' : ', '}</span>;
      }) : [];

      const activities = opportunity.activities ? opportunity.activities.map( (activity, index) => {
        return <span key={index}>{activity.title}{(index === opportunity.activities.length - 1) ? '' : ', '}</span>;
      }) : [];

      const issues = opportunity.issue_areas ? opportunity.issue_areas.map( (issue, index) => {
        return <span key={index}>{issue.title}{(index === opportunity.issue_areas.length - 1) ? '' : ', '}</span>;
      }) : [];

      const startTime = moment(opportunity.start_time);
      const endTime = moment(opportunity.end_time);

      return (
        <Card key={index}>
          <CardHeader
            title={
              <Link to={'/opportunity/' + opportunity.slug}>{opportunity.title}</Link>
            }
            subtitle={
              <Link to={'/campaign/' + opportunity.campaign.slug}>{opportunity.campaign.title}</Link>
            }
            showExpandableButton={true}
          >
            <div>Date: {startTime.format('ddd MMM Do, YYYY')}</div>
            <div>Time: {startTime.format('h:mm a') + ' - ' + endTime.format('h:mm a')}</div>  
            <div>Place: {opportunity.city}, {opportunity.state}</div>
          </CardHeader>
          <CardText expandable={true}>
            <div className={s.descriptionContainer}>
              {opportunity.description}
            </div>
          </CardText>
        </Card>
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
          ) : opportunities 
        }
      </div>
    );
  }
}


export default SearchOpportunityResults;
