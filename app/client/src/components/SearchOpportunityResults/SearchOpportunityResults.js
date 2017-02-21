
import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';

import Link from 'components/Link';

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

    return (
      <li key={index}>
        <div><h3>Title: {opportunity.title}</h3></div>
        <div>Campaign: {opportunity.campaign.title}</div>
        <div>Owner: {opportunity.owner.email}</div>
        <div>Start Time: {opportunity.start_time}</div>
        <div>End Time: {opportunity.start_time}</div>
        <div>Tags: {tags}</div>
        <div>Activities: {activities}</div>
        <div>Issues: {issues}</div>
      </li>
    );
  });

  return (
    <ul>
      { opportunities }
    </ul>
  );
}

SearchOpportunityResults.propTypes = {
  opportunities: PropTypes.array.isRequired
};

export default SearchOpportunityResults;
