import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import history from 'lib/history';
import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateState,
  validateZipcode,
  validateStartEndTimes,
} from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import CreateActionMutation from 'schemas/mutations/CreateActionMutation.graphql';

import ActionSettingsForm from 'components/ActionSettingsForm';

import s from 'styles/Organize.scss';


const WrappedActionSettingsForm = formWrapper(ActionSettingsForm);

class CreateAction extends Component {
  static propTypes = {
    createActionMutation: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        internalTitle: '',
        virtual: false,
        locationName: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        zipcode: '',
        locationNotes: '',
        ongoing: false,
        date: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      modalOpen: false,
      newAction: {
        title: '',
        slug: '',
      },
    };

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = {
    titleErrorText: null,
    internalTitleErrorText: null,
    locationNameErrorText: null,
    locationNotesErrorText: null,
    streetAddressErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
    dateErrorText: null,
    startTimeErrorText: null,
    endTimeErrorText: null,
  }

  formSubmit = async (data) => {
    const formData = Object.assign({}, data, { campaignId: this.props.campaignId });

    if (formData.ongoing) {
      formData.startTime = null;
      formData.endTime = null;
    } else {
      const startTime = moment(formData.date);
      startTime.minutes(moment(formData.startTime).minutes());
      startTime.hours(moment(formData.startTime).hours());

      const timeDiff = moment(formData.endTime).diff(moment(formData.startTime));

      const endTime = moment(startTime).add(timeDiff, 'milliseconds');

      formData.startTime = startTime.format();
      formData.endTime = endTime.format();
    }
    delete formData.date;

    try {
      const results = await this.props.createActionMutation({
        variables: {
          data: formData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['SearchActionsQuery'], // , 'CampaignActions'],
        // updateQueries: {
        //   ActionsQuery: addAction,
        //   MyActionsQuery: addAction
        // }
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
      const { defaultErrorText, formSubmit } = this;
      const { campaign } = this.props;
      const { newAction, modalOpen, formData } = this.state;

      const modalActions = [
        <RaisedButton
          label="Manage Opportunity"
          primary
          className={s.primaryButton}
          onTouchTap={(event) => { event.preventDefault(); history.push(`/organize/${campaign.slug}/opportunity/${newAction.slug}`); }}
        />,
      ];

      const validators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Opportunity Name is Required'); },
        (component) => { validateState(component); }, // TODO: error is confusing if virtual is set and state input is invalid
        (component) => { validateZipcode(component); },
        (component) => { component.state.formData.ongoing || validateStartEndTimes(component); },
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

          <WrappedActionSettingsForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            campaignTitle={campaign.title}
            submitText="Create"
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
    }
    return null;
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
