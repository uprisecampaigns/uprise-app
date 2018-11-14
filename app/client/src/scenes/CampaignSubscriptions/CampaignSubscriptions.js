import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import CampaignSubscriptionsQuery from 'schemas/queries/CampaignSubscriptionsQuery.graphql';

import s from 'styles/Volunteer.scss';

class CampaignSubscriptions extends PureComponent {
  static propTypes = {
    campaignSubscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    if (this.props.campaignSubscriptions) {
      const { campaignSubscriptions } = this.props;

      const campaignsList = campaignSubscriptions.map((campaign) => (
        <Link key={campaign.id} to={`/campaign/${campaign.slug}`}>
          <ListItem>
            <div className={s.listTitle}>{campaign.title}</div>

            {campaign.city && campaign.state && (
              <div className={s.listDetailLine}>
                {campaign.city}, {campaign.state}
              </div>
            )}

            {campaign.owner && (
              <div className={s.listDetailLine}>
                Coordinator: {campaign.owner.first_name} {campaign.owner.last_name}
                {/*&nbsp;
                <Link to={`mailto:${campaign.owner.email}`} mailTo external useAhref>
                  {campaign.owner.email}
                </Link>*/}
              </div>
            )}
          </ListItem>
        </Link>
      ));

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>Campaigns I Follow</div>
            </div>

            <div className={s.sectionsContainer}>
              <div className={s.section}>
                <div className={s.sectionInnerContent}>
                  {campaignsList.length === 0 ? (
                    <div className={s.searchPrompt}>
                      You have no current campaign subscriptions. You can search for campaigns&nbsp;
                      <Link to="/search/search-campaigns" useAhref>
                        here
                      </Link>
                      .
                    </div>
                  ) : (
                    <List>{campaignsList}</List>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(CampaignSubscriptionsQuery, {
    props: ({ data }) => ({
      campaignSubscriptions: !data.loading && data.campaignSubscriptions ? data.campaignSubscriptions : [],
    }),
    options: (ownProps) => ({
      fetchPolicy: 'network-only',
      ...ownProps,
    }),
  }),
)(CampaignSubscriptions);
