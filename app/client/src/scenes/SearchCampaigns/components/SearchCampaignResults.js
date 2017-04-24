
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
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
    return (!nextProps.graphqlLoading && typeof nextProps.campaigns === 'object');
  }

  render() {
    const { sortBy, ...props } = this.props;

    const campaignsSort = (a, b) => {
      const prop = sortBy.name;

      const testA = (typeof a[prop] === 'string') ? a[prop].toLowerCase() : a[prop];
      const testB = (typeof b[prop] === 'string') ? b[prop].toLowerCase() : b[prop];

      if (sortBy.descending) {
        return (testA < testB) ? 1 : -1;
      } else {
        return (testA > testB) ? 1 : -1;
      } 
    }

    const campaigns = props.campaigns ? Array.from(props.campaigns).sort(campaignsSort).map( (campaign, index) => {

      const tags = campaign.tags ? campaign.tags.map( (tag, index) => {
        return <span key={index}>{tag}{(index === campaign.tags.length - 1) ? '' : ', '}</span>;
      }) : [];

      const issues = campaign.issue_areas ? campaign.issue_areas.map( (issue, index) => {
        return <span key={index}>{issue.title}{(index === campaign.issue_areas.length - 1) ? '' : ', '}</span>;
      }) : [];

      const subtitle = ((typeof campaign.profile_subheader === 'string' && campaign.profile_subheader.trim() !== '') || (campaign.city && campaign.state)) ? (
        <div>
          {(typeof campaign.profile_subheader === 'string' && campaign.profile_subheader.trim() !== '') && (
            <div className={s.subheaderContainer}>
              {campaign.profile_subheader}
            </div>
          )}
          { (campaign.state && campaign.city) && (
            <div className={s.locationContainer}>
              {campaign.city}, {campaign.state}
            </div>
          )} 
        </div>
      ) : null;

      return (
        <Link 
          to={'/campaign/' + campaign.slug}
          key={index}
        >
          <Card>
            <CardHeader
              title={campaign.title}
              avatar={campaign.profile_image_url ? <Avatar src={campaign.profile_image_url} size={80}/> : undefined}
              subtitle={subtitle}
            />
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
          ) : campaigns 
        }
      </div>
    );
  }
}

export default SearchCampaignResults;
