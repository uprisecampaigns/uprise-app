import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import Link from 'components/Link';

import { 
  OpportunityQuery, 
} from 'schemas/queries';

import s from 'styles/Opportunity.scss';

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

class OpportunityContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    opportunity: PropTypes.object.isRequired
  };

  render() {
    const { opportunity } = this.props;

    const startTime = moment(opportunity.start_time);
    const endTime = moment(opportunity.end_time);

    const issueAreas = (typeof opportunity.issue_areas === 'object') ? 
      opportunity.issue_areas.map( (issue, index) => {
        return <div key={index} className={s.detailLine}>{issue.title}</div>;
      }) : [];

    const activities = (typeof opportunity.activities === 'object') ? 
      opportunity.activities.map( (activity, index) => {
        return <div key={index} className={s.detailLine}>{activity.description}</div>;
      }) : [];

    const keywords = (typeof opportunity.tags === 'object') ? 
      opportunity.tags.map( (tag, index) => {
        return <div key={index} className={s.detailLine}>{tag}</div>;
      }) : [];

    return (
      <div className={s.outerContainer}>
        <Link to={'/campaign/' + opportunity.campaign.slug}>
          <div className={s.campaignHeader}>{opportunity.campaign.title}</div>
        </Link>
        <div className={s.innerContainer}>
          <div className={s.titleContainer}>{opportunity.title}</div>
          <div className={s.dateTimePlaceContainer}>{startTime.format('ddd MMM Do, YYYY')}, {opportunity.city}, {opportunity.state}</div>

          <div className={s.contactContainer}>
            Contact Coordinator: {opportunity.owner.first_name} {opportunity.owner.last_name} 
            <Link to={'mailto:' + opportunity.owner.email} useAhref={true}>
              {opportunity.owner.email}
            </Link>
          </div>

          <div className={s.descriptionContainer}>{opportunity.description}</div>

          <div className={s.locationContainer}>
            <div className={s.header}>
              Location Details
            </div>
            <div className={s.detailLine}>{opportunity.location_name}</div>
            <div className={s.detailLine}>{opportunity.street_address}</div>
            <div className={s.detailLine}>{opportunity.street_address2}</div>
            <div className={s.detailLine}>
              {opportunity.city}, {opportunity.state} {opportunity.zipcode}
            </div>
            <div className={s.detailLine}>{opportunity.location_notes}</div>
          </div>

          {issueAreas.length > 0 && (
            <div className={s.issueAreasContainer}>
              <div className={s.header}>
                Issue Areas:
              </div>
              <div>{issueAreas}</div>
            </div>
          )}

          {activities.length > 0 && (
            <div className={s.activitiesContainer}>
              <div className={s.header}>
                Activities and Skills Needed:
              </div>
              <div>{activities}</div>
            </div>
          )}

          {keywords.length > 0 && (
            <div className={s.keywordsContainer}>
              <div className={s.header}>
                Keywords:
              </div>
              <div>{keywords}</div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default connect()(OpportunityContainer);
