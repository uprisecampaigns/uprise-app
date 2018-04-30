import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import FontIcon from 'material-ui/FontIcon';

import SearchUsers from 'components/SearchUsers';

import Link from 'components/Link';

import s from 'styles/Organize.scss';


import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

function ManageCampaignRecruit(props) {
  if (props.campaign) {
    const { campaign } = props;

    return (
      <div className={s.outerContainer}>

        <Link to={`/organize/${campaign.slug}`}>
          <div className={s.navHeader}>

            <FontIcon
              className={['material-icons', s.backArrow].join(' ')}
            >arrow_back
            </FontIcon>

            { campaign.title }
          </div>
        </Link>

        <div className={s.pageSubHeader}>Volunteers</div>

        <SearchUsers />

      </div>
    );
  }
  return null;
}

ManageCampaignRecruit.propTypes = {
  campaign: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  campaignId: PropTypes.string.isRequired,
};

ManageCampaignRecruit.defaultProps = {
  campaign: undefined,
};

export default compose(graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        id: ownProps.campaignId,
      },
    },
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
  }),
}))(ManageCampaignRecruit);
