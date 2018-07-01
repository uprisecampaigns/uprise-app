import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Dialog from 'material-ui/Dialog';

import FontIcon from 'material-ui/FontIcon';
import Link from 'components/Link';

import { setPage } from 'actions/PageNavActions';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import DeleteCampaignMutation from 'schemas/mutations/DeleteCampaignMutation.graphql';

import history from 'lib/history';

import s from 'styles/Organize.scss';

class ManageCampaignContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    deleteCampaignMutation: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      deleteModalOpen: false,
    };
  }

  handleDelete = () => {
    this.setState({
      deleteModalOpen: true,
    });
  };

  confirmDelete = async (event) => {
    event.preventDefault();

    try {
      const results = await this.props.deleteCampaignMutation({
        variables: {
          data: {
            id: this.props.campaign.id,
          },
        },
        refetchQueries: ['CampaignsQuery', 'MyCampaignsQuery'],
      });

      if (results.data.deleteCampaign) {
        history.push('/organize');
      } else {
        // TODO: Handle error!
        console.error(results);
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (this.props.campaign) {
      const { campaign, dispatch } = this.props;

      const modalActions = [
        <div
          className={[s.button, s.inlineButton].join(' ')}
          onClick={(event) => {
            event.preventDefault();
            this.setState({ deleteModalOpen: false });
          }}
          onKeyPress={(event) => {
            event.preventDefault();
            this.setState({ deleteModalOpen: false });
          }}
          role="button"
          tabIndex="0"
        >
          Cancel
        </div>,
        <div
          className={[s.primaryButton, s.inlineButton].join(' ')}
          onClick={this.confirmDelete}
          onKeyPress={this.confirmDelete}
          role="button"
          tabIndex="0"
        >
          Delete Campaign
        </div>,
      ];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>
              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <span>{campaign.title}</span>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Manage Campaign
              </div>
            </div>

            <div className={s.sectionSubHeader}>Manage Volunteers</div>
            <div className={s.sectionInnerContent}>
              <Link to={`/organize/${campaign.slug}/volunteers`} className={s.flatButton}>
                Contact <span>Message people who follow you</span>
              </Link>
              <Link to="/search/search-volunteers" className={s.flatButton}>
                Recruit <span>Search and contact new volunteers</span>
              </Link>
            </div>

            <div className={s.sectionSubHeader}>Manage Volunteer Opportunities</div>
            <div className={s.sectionInnerContent}>
              <Link to={`/organize/${campaign.slug}/opportunities`} className={s.flatButton}>
                Volunteer Needs <span>Manage volunteer opportunities</span>
              </Link>
            </div>

            <div className={s.sectionSubHeader}>Campaign Settings</div>
            <div className={s.sectionInnerContent}>
              <Link to={`/organize/${campaign.slug}/settings`} className={s.flatButton}>
                Campaign Settings <span>Edit your campaign profile</span>
              </Link>
              <div
                className={[s.flatButton, s.primaryButton].join(' ')}
                onClick={this.handleDelete}
                onKeyPress={this.handleDelete}
                role="button"
                tabIndex="0"
              >
                Delete Campaign
                <span>Note: This cannot be undone</span>
              </div>
            </div>

            {this.state.deleteModalOpen && (
              <Dialog
                title="Are You Sure?"
                modal
                actions={modalActions}
                actionsContainerClassName={s.modalActionsContainer}
                open={this.state.deleteModalOpen}
              >
                <p>Are you sure you want to delete this campaign?</p>
              </Dialog>
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          slug: ownProps.campaignSlug,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' }),
)(ManageCampaignContainer);
