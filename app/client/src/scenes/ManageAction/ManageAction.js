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
  }

  static defaultProps = {
    campaign: undefined,
    action: undefined,
  }

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
  }

  confirmDelete = async (event) => {
    event.preventDefault();

    const {
      actionId, campaignId, campaign, action,
      deleteActionMutation, dispatch,
    } = this.props;

    if (!this.deleting) {
      try {
        this.deleting = true;

        const results = await deleteActionMutation({
          variables: {
            data: {
              id: action.id,
            },
          },
          refetchQueries: [{
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
          }],
        });

        this.deleting = false;

        if (results.data.deleteAction) {
          dispatch(notify('Opportunity deleted'));
          history.push(`/organize/${campaign.slug}/opportunities`);
        } else {
          console.error(results);
          dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
        }
      } catch (e) {
        console.error(e);
        this.deleting = false;
        dispatch(notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'));
      }
    }
  }

  render() {
    if (this.props.campaign && this.props.action) {
      const { campaign, action } = this.props;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={(event) => { event.preventDefault(); this.setState({ deleteModalOpen: false }); }}
        />,
        <RaisedButton
          label="I'm sure"
          primary
          onTouchTap={this.confirmDelete}
          className={s.primaryButton}
        />,
      ];

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              {campaign.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>{action.title}</div>

          <List className={s.navList}>

            <Divider />

            <Link to={`${baseActionUrl}/volunteers`}>
              <ListItem
                primaryText="Volunteers"
              />
            </Link>

            <Divider />

            <Link to={`${baseActionUrl}/settings`}>
              <ListItem
                primaryText="Settings"
              />
            </Link>

            <Divider />

            <Link to={`/opportunity/${action.slug}`}>
              <ListItem
                primaryText="View Profile"
              />
            </Link>

            <Divider />

            <Link to={`${baseActionUrl}/profile/edit`}>
              <ListItem
                primaryText="Edit Profile"
              />
            </Link>

            <Divider />

            <ListItem
              primaryText="Delete"
              onTouchTap={this.handleDelete}
            />

            <Divider />

          </List>

          {this.state.deleteModalOpen && (
            <Dialog
              title="Are You Sure?"
              modal
              actions={modalActions}
              actionsContainerClassName={s.modalActionsContainer}
              open={this.state.deleteModalOpen}
            >
              <p>
                Are you sure you want to delete this opportunity?
              </p>
            </Dialog>
          )}

        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
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
  }),
  graphql(ActionQuery, {
    options: ownProps => ({
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
