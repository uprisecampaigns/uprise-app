import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { 
  CampaignQuery, ActionQuery, ActionsQuery
} from 'schemas/queries';

import { 
  DeleteActionMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


class ManageActionSettings extends Component {

  static PropTypes = {
    deleteActionMutation: PropTypes.func.isRequired,
    actionId: PropTypes.string.isRequired,
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      deleteModalOpen: false
    }
  }

  handleDelete = () => {
    this.setState({
      deleteModalOpen: true
    });
  }

  confirmDelete = async () => {

    const { actionId, campaignId, campaign, action, ...props } = this.props;

    try {
      const results = await props.deleteActionMutation({ 
        variables: {
          data: {
            id: action.id
          }
        },
        refetchQueries: [{
          query: ActionsQuery,
          variables: {
            search: { campaignIds: [campaignId] }
          }
        },
        {
          query: ActionQuery,
          variables: {
            search: { id: actionId }
          }
        }]
      });

      if (results.data.deleteAction) {
        history.push('/organize/' + campaign.slug + '/actions');
      } else {
        // TODO: Handle error!
        console.error(results);
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    if (this.props.campaign && this.props.action) {
      const { campaign, action, ...props } = this.props;

      const modalActions = [
        <RaisedButton
          label="I'm sure"
          primary={true}
          onTouchTap={this.confirmDelete}
        />,
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={ () => this.setState({ deleteModalOpen: false }) }
        />
      ];

      const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

      return (
        <div className={s.outerContainer}>

          <Link to={baseActionUrl}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Dashboard
            </div>
          </Link>

          <div className={s.pageSubHeader}>Settings</div>

          <List>

            <Link to={baseActionUrl + '/info' }>
              <ListItem 
                primaryText="Info"
              />
            </Link>

            <Link to={baseActionUrl + '/profile' }>
              <ListItem 
                primaryText="Profile"
              />
            </Link>

            <Link to={baseActionUrl + '/preferences' }>
              <ListItem 
                primaryText="Preferences"
              />
            </Link>

            <ListItem 
              primaryText="Delete"
              onTouchTap={this.handleDelete}
            />

          </List>

          {this.state.deleteModalOpen && (
            <Dialog
              title="Are You Sure?"
              modal={true}
              actions={modalActions}
              open={this.state.deleteModalOpen}
            >
              <p>
                Are you sure you want to delete this action?
              </p>
            </Dialog>
          )}

        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.campaignId
        }
      }
    }),
    props: ({ data }) => ({ 
      campaign: data.campaign
    })
  }),
  graphql(ActionQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.actionId
        }
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      action: data.action
    })
  }),
  graphql(DeleteActionMutation, { name: 'deleteActionMutation' })
)(ManageActionSettings);
