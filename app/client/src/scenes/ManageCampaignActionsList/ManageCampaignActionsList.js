import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { 
  CampaignQuery, ActionsQuery
} from 'schemas/queries';

import s from 'styles/Organize.scss';


class ManageCampaignActionsList extends Component {

  static PropTypes = {
    campaign: PropTypes.object.isRequired
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

  render() {
    const actions = this.props.actions || [];
    const campaign = this.props.campaign || {
      slug: '',
      title: ''
    };

    const actionsList = actions.map( (action) => (
      <Link key={action.id} to={'/organize/' + campaign.slug + '/action/' + action.slug}>
        <ListItem 
          primaryText={action.title}
        />
      </Link>
    ));

    return (
      <div className={s.outerContainer}>

        <Link to={'/organize/' + campaign.slug}>
          <div className={s.campaignHeader}>
            {campaign.title}
          </div>
        </Link>

        <Link to={'/organize/' + campaign.slug + '/actions'}>
          <div className={s.navSubHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Actions
          </div>
        </Link>


        <div className={s.campaignSubHeader}>Calendar/List</div>

        <List>

          { actionsList }

        </List>
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

  graphql(ActionsQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          campaignIds: [ownProps.campaignId]
        }
      }
    }),
    props: ({ data }) => ({ 
      actions: data.actions
    })
  }),
)(ManageCampaignActionsList);
