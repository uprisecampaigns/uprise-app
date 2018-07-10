import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import history from 'lib/history';

import Link from 'components/Link';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import SearchActionsQuery from 'schemas/queries/SearchActionsQuery.graphql';

import DeleteActionMutation from 'schemas/mutations/DeleteActionMutation.graphql';

import { notify } from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';

class ManageAction extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
    deleteActionMutation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
    action: undefined,
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

    const { actionId, campaignId, campaign, action, deleteActionMutation, dispatch } = this.props;

    if (!this.deleting) {
      try {
        this.deleting = true;

        const results = await deleteActionMutation({
          variables: {
            data: {
              id: action.id,
            },
          },
          refetchQueries: [
            {
              query: SearchActionsQuery,
              variables: {
                search: { campaignIds: [campaignId] },
              },
            },
            {
              query: ActionQuery,
              variables: {
                search: { id: actionId },
              },
            },
          ],
        });

        this.deleting = false;

        if (results.data.deleteAction) {
          dispatch(notify('Opportunity deleted'));
          history.push(`/organize/${campaign.slug}/opportunities`);
        } else {
          console.error(results);
          dispatch(
            notify(
              'There was an error with your request. Please reload the page or contact help@uprise.org for support.',
            ),
          );
        }
      } catch (e) {
        console.error(e);
        this.deleting = false;
        dispatch(
          notify(
            'There was an error with your request. Please reload the page or contact help@uprise.org for support.',
          ),
        );
      }
    }
  };

  render() {
    if (this.props.campaign && this.props.action) {
      const { campaign, action } = this.props;

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
          I'm Sure
        </div>,
      ];

      const campaignUrl = `/organize/${campaign.slug}`;
      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>

            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`${campaignUrl}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                {action.title}
              </div>
            </div>


            <div className={s.sectionSubHeader}>Manage Volunteers</div>
            <div className={s.sectionInnerContent}>
              <Link to={`${baseActionUrl}/volunteers`} className={s.flatButton}>
                Contact <span>Message followers of this opportunity</span>
              </Link>
            </div>

            <div className={s.sectionSubHeader}>Opportunity Settings</div>
            <div className={s.sectionInnerContent}>
              <Link to={`${baseActionUrl}/settings`} className={s.flatButton}>
                Opportunity Settings <span>Edit your opportunity profile</span>
              </Link>
              <div
                className={[s.flatButton, s.primaryButton].join(' ')}
                onClick={this.handleDelete}
                onKeyPress={this.handleDelete}
                role="button"
                tabIndex="0"
              >
                Delete Opportunity
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
                <p>Are you sure you want to delete this opportunity?</p>
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
          id: ownProps.campaignId,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
  graphql(ActionQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          id: ownProps.actionId,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      action: data.action,
    }),
  }),
  graphql(DeleteActionMutation, { name: 'deleteActionMutation' }),
)(ManageAction);
