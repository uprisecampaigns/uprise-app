import React, { PureComponent, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import CampaignSubscriptionsQuery from 'schemas/queries/CampaignSubscriptionsQuery.graphql';

import s from 'styles/Volunteer.scss';


class CampaignSubscriptions extends PureComponent {
  static propTypes = {
    campaignSubscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    if (this.props.campaignSubscriptions) {
      const { campaignSubscriptions } = this.props;

      const campaignsList = campaignSubscriptions.map(campaign => (
        <Link key={campaign.id} to={`/campaign/${campaign.slug}`}>
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
                Coordinator: {campaign.owner.first_name} {campaign.owner.last_name}&nbsp;
                <Link to={`mailto:${campaign.owner.email}`} mailTo external useAhref>
                  {campaign.owner.email}
                </Link>
              </div>
            )}

          </ListItem>
        </Link>
      ));

      return (
        <div className={s.outerContainer}>

          <Link to={'/volunteer'}>
            <div className={[s.navHeader, s.volunteerNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Volunteer
            </div>
          </Link>


          <div className={s.pageSubHeader}>My Subscriptions</div>

          <List>

            { campaignsList }

          </List>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(CampaignSubscriptionsQuery, {
    props: ({ data }) => ({
      campaignSubscriptions: data.campaignSubscriptions,
    }),
  }),
)(CampaignSubscriptions);
