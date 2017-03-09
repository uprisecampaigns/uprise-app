
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
const isEqual = require('lodash.isequal');

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchCampaignResults extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    campaigns: PropTypes.array,
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    // TODO: How to also prevent updates if nothing 
    // has changed during polling
    return !isEqual(this.props.sortBy, nextProps.sortBy) ||
           (!nextProps.graphqlLoading && nextProps.campaigns);
  }

  render() {
    const { sortBy, ...props } = this.props;

    const campaignsSort = (a, b) => {
      const prop = sortBy.name;
      if (sortBy.descending) {
        return (a[prop] < b[prop]) ? 1 : -1;
      } else {
        return (a[prop] > b[prop]) ? 1 : -1;
      } 
    }

    const campaigns = props.campaigns ? Array.from(props.campaigns).sort(campaignsSort).map( (campaign, index) => {

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
    }) : [];

    return (
      <div>
        { campaigns }
      </div>
    );
  }
}

export default SearchCampaignResults;
