import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import history from 'lib/history';

import { CampaignQuery } from 'schemas/queries';

import { 
  DeleteCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Campaign.scss';


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

  confirmDelete = () => {
    console.log('gonna delete this campaign');
  }

  render() {
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
        <div className={s.campaignHeader}>{campaign.title}</div>

        <RaisedButton
          label="Delete Campaign"
          onTouchTap={this.handleDelete}
          primary={true}
        />

        {this.state.deleteModalOpen && (
          <Dialog
            title="Campaign Created"
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
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          slug: ownProps.campaign.slug
        }
      }
    })
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignSettingsContainer);
