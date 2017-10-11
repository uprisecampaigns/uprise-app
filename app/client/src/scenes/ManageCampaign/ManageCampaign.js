import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import DeleteCampaignMutation from 'schemas/mutations/DeleteCampaignMutation.graphql';

import history from 'lib/history';

import s from 'styles/Organize.scss';


class ManageCampaignContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    deleteCampaignMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
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
  }

  render() {
    if (this.props.campaign) {
      const { campaign } = this.props;

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

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize'}>
            <div className={[s.navHeader, s.organizeNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Organize
            </div>
          </Link>

          <div className={s.campaignHeader}>{campaign.title}</div>

          <List className={s.navList}>

            <Divider />

            <Link to={`/organize/${campaign.slug}/opportunities`}>
              <ListItem
                primaryText="Campaign Opportunities"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/volunteers`}>
              <ListItem
                primaryText="Subscribers"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/settings`}>
              <ListItem
                primaryText="Settings"
              />
            </Link>

            <Divider />

            <Link to={`/organize/${campaign.slug}/profile/edit`}>
              <ListItem
                primaryText="Edit Profile"
              />
            </Link>

            <Divider />

            <Link to={`/campaign/${campaign.slug}`}>
              <ListItem
                primaryText="View Profile"
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
                Are you sure you want to delete this campaign?
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
  graphql(CampaignQuery, {
    options: ownProps => ({
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
