import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';

import CsvUploader from 'components/CsvUploader';
import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import MeQuery from 'schemas/queries/MeQuery.graphql';

// import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignUploadActions extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.campaign) {
      const { campaign, user, ...props } = this.props;

      const config = {
        headers: [
          {
            title: 'title',
            processData: (item) => {
              console.log(item);
              return item;
            },
          }
        ],
        onSubmit: (data) => {
          console.log(data);
        }
      };

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Upload Actions</div>

          <CsvUploader 
            config={config}
          />
          
        </div>
      );
    } else {
      return null;
    }
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    }, 
  })
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        slug: ownProps.campaignSlug
      }
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign,
    graphqlLoading: data.loading
  })
});

export default compose(
  connect(),
  withMeQuery,
  withCampaignQuery,
  // graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignUploadActions);
