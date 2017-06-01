import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';

import CampaignSubscriptionsQuery from 'schemas/queries/CampaignSubscriptionsQuery.graphql';

import s from 'styles/Volunteer.scss';


class CampaignSubscriptions extends Component {

  static PropTypes = {
    campaignSubscriptions: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.campaignSubscriptions) {
      const { campaignSubscriptions, ...props } = this.props;

      const campaignsList = campaignSubscriptions.map( (campaign) => (
        <Link key={campaign.id} to={'/campaign/' + campaign.slug}>
          <ListItem>

            <div className={s.listTitle}>
              {campaign.title}
            </div>

            {(campaign.city && campaign.state) && (
              <div className={s.listDetailLine}>
                {campaign.city}, {campaign.state}
              </div>
            )}

            {(campaign.owner) && (
              <div className={s.listDetailLine}>
                Coordinator: {campaign.owner.first_name} {campaign.owner.last_name} <Link to={"mailto:" + campaign.owner.email} mailTo={true} external={true} useAhref={true}>{campaign.owner.email}</Link>
              </div>
            )}

          </ListItem>
        </Link>
      ));

      return (
        <div className={s.outerContainer}>

          <Link to={'/volunteer'}>
            <div className={[s.navHeader, s.organizeNavHeader].join(' ')}>
              <FontIcon
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Volunteer
            </div>
          </Link>


          <div className={s.pageSubHeader}>Campaign Subscriptions</div>

          <List>

            { campaignsList }

          </List>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(CampaignSubscriptionsQuery, {
    props: ({ data }) => ({ 
      campaignSubscriptions: data.campaignSubscriptions
    })
  }),
)(CampaignSubscriptions);
