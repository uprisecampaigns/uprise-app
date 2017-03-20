import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import Link from 'components/Link';

import { 
  CampaignQuery, 
} from 'schemas/queries';

import s from 'styles/Campaign.scss';


class Campaign extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    campaign: PropTypes.object,
    campaignId: PropTypes.string.isRequired
  };

  render() {

    const campaign = this.props.campaign || {
      first_name: '',
      last_name: '',
      description: '',
      slug: '',
      title: '',
      tags: [],
      owner: {
        first_name: '',
        last_name: '',
        email: '',
      }
    };

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
            <Link to={'mailto:' + campaign.owner.email} external={true} useAhref={true}>
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

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        id: ownProps.campaignId
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign
  })
});

export default compose(
  connect(),
  withCampaignQuery
)(Campaign);
