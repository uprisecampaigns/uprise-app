import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import Link from 'components/Link';

import { 
  CampaignQuery, 
} from 'schemas/queries';

import s from 'styles/Campaign.scss';

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

class CampaignContainer extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    campaign: PropTypes.object.isRequired
  };

  render() {
    const { campaign } = this.props;

    const keywords = (typeof campaign.tags === 'object') ? 
      campaign.tags.map( (tag, index) => {
        return <div key={index} className={s.detailLine}>{tag}</div>;
      }) : [];

    return (
      <div className={s.outerContainer}>
        <Link to={'/campaign/' + campaign.slug}>
          <div className={s.campaignHeader}>{campaign.title}</div>
        </Link>
        <div className={s.innerContainer}>

          <div className={s.contactContainer}>
            Contact Coordinator: {campaign.owner.first_name} {campaign.owner.last_name} 
            <Link to={'mailto:' + campaign.owner.email} useAhref={true}>
              {campaign.owner.email}
            </Link>
          </div>

          <div className={s.descriptionContainer}>{campaign.description}</div>

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

export default connect()(CampaignContainer);
