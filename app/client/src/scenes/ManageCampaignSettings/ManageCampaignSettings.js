import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import history from 'lib/history';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import DeleteCampaignMutation from 'schemas/mutations/DeleteCampaignMutation.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignSettingsContainer extends Component {

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

  confirmDelete = async () => {
    try {
      const results = await this.props.deleteCampaignMutation({ 
        variables: {
          data: {
            id: this.props.campaign.id
          }
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
  }

  render() {

    if (this.props.campaign) {
      const { campaign, ...props } = this.props;

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

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug}>
            <div className={[s.navHeader, s.campaignNavHeader].join(' ')}>

              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>

              {campaign.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Settings</div>

          <List className={s.navList}>

            <Divider />

            <Link to={'/organize/' + campaign.slug + '/info'}>
              <ListItem 
                primaryText="Info"
              />
            </Link>

            <Divider />

            <Link to={'/organize/' + campaign.slug + '/preferences'}>
              <ListItem 
                primaryText="Preferences"
              />
            </Link>

            <Divider />

            <Link to={'/organize/' + campaign.slug + '/location'}>
              <ListItem 
                primaryText="Location"
              />
            </Link>

            <Divider />

            <Link to={'/organize/' + campaign.slug + '/profile'}>
              <ListItem 
                primaryText="Profile"
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
              modal={true}
              actions={modalActions}
              open={this.state.deleteModalOpen}
            >
              <p>
                Are you sure you want to delete this campaign?
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
          slug: ownProps.campaignSlug
        }
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      campaign: data.campaign
    })
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignSettingsContainer);
