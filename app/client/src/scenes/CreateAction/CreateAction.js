import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import history from 'lib/history';
import organizeFormWrapper from 'lib/organizeFormWrapper';
import { 
  validateString,
  validateWebsiteUrl,
  validateState,
  validateZipcode,
  validatePhoneNumber,
  validateStartEndTimes
} from 'lib/validateComponentForms';

import { CampaignQuery } from 'schemas/queries';
import { CreateActionMutation } from 'schemas/mutations';

import ActionInfoForm from 'components/ActionInfoForm';

import s from 'styles/Organize.scss';


const WrappedActionInfoForm = organizeFormWrapper(ActionInfoForm);

class CreateAction extends Component {

  static PropTypes = {
    createActionMutation: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object
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
        date: undefined,
        startTime: undefined,
        endTime: undefined
      },
      modalOpen: false,
      newAction: {
        title: '',
        slug: ''
      }
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
    endTimeErrorText: null
  }

  formSubmit = async (data) => {

    const formData = Object.assign({}, data, { campaignId: this.props.campaignId });

    const startTime = moment(formData.date);
    startTime.minutes(moment(formData.startTime).minutes());
    startTime.hours(moment(formData.startTime).hours());

    const timeDiff = moment(formData.endTime).diff(moment(formData.startTime));

    const endTime = moment(startTime).add(timeDiff, 'milliseconds');

    formData.startTime = startTime.format();
    formData.endTime = endTime.format();
    delete formData.date;

    try {
      const results = await this.props.createActionMutation({ 
        variables: {
          data: formData
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionsQuery'], //, 'CampaignActions'],
        // updateQueries: {
        //   ActionsQuery: addAction,
        //   MyActionsQuery: addAction
        // }
      });
      this.setState({
        modalOpen: true,
        newAction: results.data.createAction
      });
    } catch (e) {
      this.props.dispatch(notify('There was an error creating the event'));
      console.error(e);
    }
  }

  render() {

    if (this.props.campaign) {

      const { defaultErrorText, formSubmit } = this;
      const { campaign, ...props } = this.props;
      const { newAction, modalOpen, formData, ...state } = this.state;

      const modalActions = [
        <RaisedButton
          label="Set Preferences"
          primary={true}
          onTouchTap={ () => { history.push('/organize/' + campaign.slug + '/action/' + newAction.slug + '/preferences') }}
        />
      ];

      const validators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Action Name is Required') },
        (component) => { validateString(component, 'internalTitle', 'internalTitleErrorText', 'Internal Name is Required') },
        (component) => { validateState(component) }, //TODO: error is confusing if virtual is set and state input is invalid
        (component) => { validateZipcode(component) },
        (component) => { validateStartEndTimes(component) },
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug + '/actions'}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Actions
            </div>
          </Link>

          <div className={s.campaignSubHeader}>Create Action</div>

          <WrappedActionInfoForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            campaignTitle={campaign.title}
            submitText="Create"
          />

          {modalOpen && (
            <Dialog
              title="Action Created"
              modal={true}
              actions={modalActions}
              open={modalOpen}
            >
              <p>
                Congratulations, you have created the action '{newAction.title}'.
              </p>
              <p>
                You can find and edit your action's public profile at 
                <Link to={'/action/' + newAction.slug} useAhref={true}>uprise.org/action/{newAction.slug}</Link>
              </p>
              <p>
                Please feel free to contact us at<Link to="mailto:help@uprise.org" mailTo={true} external={true} useAhref={true}>help@uprise.org</Link>for assistance.
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
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CreateActionMutation, { name: 'createActionMutation' })
)(CreateAction);
