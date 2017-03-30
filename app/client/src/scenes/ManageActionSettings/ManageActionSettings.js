import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { 
  CampaignQuery, ActionQuery 
} from 'schemas/queries';

import { 
  DeleteActionMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


class ManageActionSettings extends Component {

  static PropTypes = {
    deleteActionMutation: PropTypes.func.isRequired,
    campaignSlug: PropTypes.string.isRequired,
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
    try {
      const results = await this.props.deleteActionMutation({ 
        variables: {
          data: {
            id: this.props.action.id
          }
        },
        refetchQueries: ['ActionsQuery', 'ActionQuery'],
      });

      if (results.data.deleteAction) {
        history.push('/organize/' + this.props.campaign.slug + '/actions');
      } else {
        // TODO: Handle error!
        console.error(results);
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    const campaign = this.props.campaign || {
      title: '',
      slug: ''
    }

    const action = this.props.action || {
      title: '',
      slug: ''
    }

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

        <Link to={'/organize/' + campaign.slug}>
          <div className={s.campaignHeader}>{campaign.title}</div>
        </Link>

        <Link to={baseActionUrl}>
          <div className={s.actionHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            {action.title}
          </div>
        </Link>

        <div className={s.pageSubHeader}>Settings</div>

        <List>

          <Link to={baseActionUrl + '/info' }>
            <ListItem 
              primaryText="Info"
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
      }
    }),
    props: ({ data }) => ({ 
      action: data.action
    })
  }),
  graphql(DeleteActionMutation, { name: 'deleteActionMutation' })
)(ManageActionSettings);
