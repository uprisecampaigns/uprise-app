import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import history from 'history';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';
import ActionSettingsContainer from 'components/ActionSettingsContainer';

import CreateActionMutation from 'schemas/mutations/CreateActionMutation.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import s from 'styles/Organize.scss';


class CreateAction extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    createActionMutation: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      newAction: {
        title: '',
        slug: '',
      },
    };
  }

  createAction = async (data) => {
    const actionData = { ...data, campaignId: this.props.campaignId };

    try {
      const results = await this.props.createActionMutation({
        variables: {
          data: actionData,
        },
        refetchQueries: ['SearchActionsQuery'],
      });
      this.setState({
        modalOpen: true,
        newAction: results.data.createAction,
      });
      return { success: true, message: 'Opportunity Created' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {
    if (this.props.campaign) {
      const { newAction, modalOpen } = this.state;
      const { campaign, type } = this.props;
      const { createAction } = this;

      const modalActions = [
        <RaisedButton
          label="Manage Opportunity"
          primary
          className={s.primaryButton}
          onTouchTap={(event) => { event.preventDefault(); history.push(`/organize/${campaign.slug}/opportunity/${newAction.slug}`); }}
        />,
      ];

      return (

        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}/opportunities`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              Opportunities
            </div>
          </Link>

          <div className={s.pageSubHeader}>Create Opportunity</div>

          <ActionSettingsContainer
            campaignId={campaign.id}
            type={type}
            submit={createAction}
          />

          {modalOpen && (
            <Dialog
              title="Opportunity Created"
              modal
              actions={modalActions}
              actionsContainerClassName={s.modalActionsContainer}
              open={modalOpen}
            >
              <p>
                Congratulations, you have created the opportunity &apos;{newAction.title}&apos;.
              </p>
              <p>
                You can find your opportunity&apos;s public profile at {window.location.origin}/opportunity/{newAction.slug}
              </p>
              <p>
                You can manage your opportunity here:
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

const withCampaignQuery = graphql(CampaignQuery, {
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
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CreateActionMutation, { name: 'createActionMutation' }),
)(CreateAction);
