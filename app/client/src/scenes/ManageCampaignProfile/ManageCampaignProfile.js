import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignProfileContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.object.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  render() {
    if (this.props.campaign) {
      const { campaign } = this.props;

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}`}>
            <div className={[s.navHeader, s.campaignNavHeader].join(' ')}>

              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>

              {campaign.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Profile</div>

          <List className={s.navList}>

            <Divider />

            <Link to={`/campaign/${campaign.slug}`}>
              <ListItem
                primaryText="View"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/profile/edit`}>
              <ListItem
                primaryText="Edit"
              />
            </Link>

            <Divider />

          </List>

        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: ownProps => ({
      variables: {
        search: {
          slug: ownProps.campaignSlug,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
)(ManageCampaignProfileContainer);
