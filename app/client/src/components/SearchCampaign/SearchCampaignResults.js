
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import Link from 'components/Link';

import s from 'styles/Search.scss';


const SearchCampaignResults = (props) => {

  const sortBy = props.sortBy;

  const campaignsSort = (a, b) => {
    if (sortBy.name === 'title') {
      if (sortBy.descending) {
        return (a.title < b.title) ? 1 : -1;
      } else {
        return (a.title > b.title) ? 1 : -1;
      } 
    }
  }

  const campaigns = Array.from(props.campaigns).sort(campaignsSort).map( (campaign, index) => {

    const tags = campaign.tags ? campaign.tags.map( (tag, index) => {
      return <span key={index}>{tag}{(index === campaign.tags.length - 1) ? '' : ', '}</span>;
    }) : [];

    const issues = campaign.issue_areas ? campaign.issue_areas.map( (issue, index) => {
      return <span key={index}>{issue.title}{(index === campaign.issue_areas.length - 1) ? '' : ', '}</span>;
    }) : [];

    return (
      <Card key={index}>
        <CardHeader
          title={
            <Link to={'/campaign/' + campaign.slug}>{campaign.title}</Link>
          }
          showExpandableButton={true}
        >
        </CardHeader>
        <CardText expandable={true}>
          <div className={s.descriptionContainer}>
            {campaign.description}
          </div>
          <div className={s.issuesContainer}>
            {issues}
          </div>
          <div className={s.tagsContainer}>
            {tags}
          </div>
        </CardText>
      </Card>
    );
  });

  return (
    <div>
      { campaigns }
    </div>
  );
}

SearchCampaignResults.propTypes = {
  campaigns: PropTypes.array.isRequired,
  search: PropTypes.object.isRequired,
  sortBy: PropTypes.object.isRequired,
};

export default SearchCampaignResults;
