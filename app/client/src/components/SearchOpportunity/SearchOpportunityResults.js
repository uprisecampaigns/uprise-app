
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import Link from 'components/Link';

import s from './SearchOpportunity.scss';


const SearchOpportunityResults = (props) => {
  const opportunities = props.opportunities.map( (opportunity, index) => {

    const tags = opportunity.tags.map( (tag, index) => {
      return <span key={index}>{tag}{(index === opportunity.tags.length - 1) ? '' : ', '}</span>;
    });

    const activities = opportunity.activities.map( (activity, index) => {
      return <span key={index}>{activity.title}{(index === opportunity.activities.length - 1) ? '' : ', '}</span>;
    });

    const issues = opportunity.issueAreas.map( (issue, index) => {
      return <span key={index}>{issue.title}{(index === opportunity.issueAreas.length - 1) ? '' : ', '}</span>;
    });

    const startTime = moment(opportunity.start_time);
    const endTime = moment(opportunity.end_time);

    return (
      <Card key={index}>
        <CardHeader
          title={
            <Link to={'/opportunities/' + opportunity.slug}>{opportunity.title}</Link>
          }
          subtitle={
            <Link to={'/campaigns/' + opportunity.campaign.slug}>{opportunity.campaign.title}</Link>
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
  });

  return (
    <div>
      { opportunities }
    </div>
  );
}

SearchOpportunityResults.propTypes = {
  opportunities: PropTypes.array.isRequired
};

export default SearchOpportunityResults;
