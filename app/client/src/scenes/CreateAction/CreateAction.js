import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';
import ActionSettingsContainer from 'components/ActionSettingsContainer';

import { notify } from 'actions/NotificationsActions';

import history from 'lib/history';

import CreateActionMutation from 'schemas/mutations/CreateActionMutation.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import s from 'styles/Organize.scss';

class CreateAction extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    createActionMutation: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
  };

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

      this.props.dispatch(notify('Opportunity successfully created'));

      this.setState({
        modalOpen: true,
        newAction: results.data.createAction,
      });
    } catch (e) {
      console.error(e);
      this.props.dispatch(
        notify('There was an error with your request. Please reload the page or contact help@uprise.org for support.'),
      );
    }
  };

  render() {
    if (this.props.campaign) {
      const { newAction, modalOpen } = this.state;
      const { campaign, type } = this.props;
      const { createAction } = this;

      const modalActions = [
        <div
          className={[s.primaryButton, s.inlineButton].join(' ')}
          onClick={(event) => {
            event.preventDefault();
            history.push(`/organize/${campaign.slug}/opportunity/${newAction.slug}`);
          }}
          onKeyPress={(event) => {
            event.preventDefault();
            history.push(`/organize/${campaign.slug}/opportunity/${newAction.slug}`);
          }}
          role="button"
          tabIndex="0"
        >
          Manage Opportunity
        </div>,
        <div
          className={[s.inlineButton, s.button].join(' ')}
          onClick={(event) => {
            event.preventDefault();
            window.location.reload(true);
          }}
          onKeyPress={(event) => {
            event.preventDefault();
            window.location.reload(true);
          }}
        >
          Create New Opportunity
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
                <Link to={`/organize/${campaign.slug}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Create Opportunity
              </div>
            </div>

            <ActionSettingsContainer campaign={campaign} type={type} submit={createAction} />

            {modalOpen && (
              <Dialog title="Opportunity Created" modal actions={modalActions} open={modalOpen}>
                <p>Congratulations, you have created the opportunity &apos;{newAction.title}&apos;.</p>
                <p>
                  You can find your opportunity&apos;s public profile at {window.location.origin}/opportunity/
                  {newAction.slug}
                </p>
                <p>You can manage your opportunity here:</p>
              </Dialog>
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
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
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CreateActionMutation, { name: 'createActionMutation' }),
)(CreateAction);
