import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import moment from 'moment';

import CampaignProfile from 'components/CampaignProfile';
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

    if (this.props.campaign) { 

      const { campaign, ...props } = this.props;

      const keywords = (typeof campaign.tags === 'object') ? 
        campaign.tags.map( (tag, index) => {
          return <div key={index} className={s.detailLine}>{tag}</div>;
        }) : [];

      return (
        <div>
          <CampaignProfile
            campaign={campaign}
          />
        </div>
      );
    } else {
      return null;
    }
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
