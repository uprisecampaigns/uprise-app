import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import moment from 'moment';
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import ActionInfoForm from 'components/ActionInfoForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';

import { 
  validateString,
  validateState,
  validateZipcode,
  validatePhoneNumber,
  validateStartEndTimes
} from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActionQuery from 'schemas/queries/ActionQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import s from 'styles/Organize.scss';


const WrappedActionInfoForm = formWrapper(ActionInfoForm);

class ManageActionInfoContainer extends Component {

  static PropTypes = {
    campaignId: PropTypes.string.isRequired,
    actionId: PropTypes.string.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object
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
    }

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = { 
    titleErrorText: null,
    streetAddressErrorText: null,
    locationNameErrorText: null,
    locationNotesErrorText: null,
    websiteUrlErrorText: null,
    phoneNumberErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
    dateErrorText: null,
    startTimeErrorText: null,
    endTimeErrorText: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && !nextProps.graphqlLoading) {

      // Just camel-casing property keys and checking for null
      const action = Object.assign(...Object.keys(nextProps.action).map(k => {
        if (nextProps.action[k] !== null) {
          return { [camelCase(k)]: nextProps.action[k] };
        }
      }));

      // Handle date/time
      const newDateTimes = {
        date: moment(action.startTime).isValid() ? moment(action.startTime).toDate() : undefined,
        startTime: moment(action.startTime).isValid() ? moment(action.startTime).toDate() : undefined,
        endTime: moment(action.endTime).isValid() ? moment(action.endTime).toDate() : undefined
      };

      delete action.startTime;
      delete action.endTime;

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, newDateTimes)
      }));

      Object.keys(action).forEach( (k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, action)
      }));

    }
  }

  formSubmit = async (data) => {
    
    // A little hackish to avoid an annoying rerender with previous form data
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data)
    });

    const formData = Object.assign({}, data);

    const startTime = moment(formData.date);
    startTime.minutes(moment(formData.startTime).minutes());
    startTime.hours(moment(formData.startTime).hours());

    const timeDiff = moment(formData.endTime).diff(moment(formData.startTime));

    const endTime = moment(startTime).add(timeDiff, 'milliseconds');

    formData.startTime = startTime.format();
    formData.endTime = endTime.format();
    delete formData.date;

    formData.id = this.props.action.id;

    try {

      const results = await this.props.editActionMutation({ 
        variables: {
          data: formData
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'SearchActionsQuery'],
      });

      return { success: true, message: 'Changes Saved' };

    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {

    if (this.props.action && this.props.campaign) {

      const { formSubmit, defaultErrorText } = this;
      const { action, campaign, ...props } = this.props;
      const { formData } = this.state;

      const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

      const validators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Action Name is Required') },
        (component) => { validateString(component, 'internalTitle', 'internalTitleErrorText', 'Internal Name is Required') },
        (component) => { validateState(component) }, //TODO: error is confusing if virtual is set and state input is invalid
        (component) => { validateZipcode(component) },
        (component) => { validateStartEndTimes(component) },
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={baseActionUrl + '/settings'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Info</div>

          <WrappedActionInfoForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            campaignTitle={campaign.title}
            submitText="Save Changes"
          />
  
        </div>
      );
    } else {
      return null;
    }
  }
}

const withActionQuery = graphql(ActionQuery, {
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
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        id: ownProps.campaignId
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign,
    graphqlLoading: data.loading
  })
})

export default compose(
  connect(),
  withActionQuery,
  withCampaignQuery,
  graphql(EditActionMutation, { name: 'editActionMutation' })
)(ManageActionInfoContainer);
