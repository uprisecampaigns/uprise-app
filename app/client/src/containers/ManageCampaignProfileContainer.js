import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {Tabs, Tab} from 'material-ui/Tabs';

import history from 'lib/history';

import { CampaignQuery } from 'schemas/queries';

import { 
  DeleteCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Campaign.scss';


class ManageCampaignProfileContainer extends Component {

  static PropTypes = {
    campaign: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { campaign, ...props } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.campaignHeader}>{campaign.title}</div>
        <Tabs>
          <Tab label="View">
            <div>View Campaign</div>
          </Tab>
          <Tab label="Edit">
            <div>Edit Campaign</div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          slug: ownProps.campaign.slug
        }
      }
    })
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignProfileContainer);
