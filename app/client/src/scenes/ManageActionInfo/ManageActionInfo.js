import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import ManageActionInfoForm from './components/ManageActionInfoForm';
import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';
import { 
  validateString,
  validateState,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import { 
  ActionQuery,
  CampaignQuery
} from 'schemas/queries';

import { 
  EditActionMutation
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


const statesList = Object.keys(states);

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
        locationNotes: ''
      },
      errors: {},
      refs: {},
      saving: false
    }

    this.state = Object.assign({}, initialState, this.defaultErrorText);
  }

  defaultErrorText = { 
    titleErrorText: null,
    streetAddressErrorText: null,
    websiteUrlErrorText: null,
    phoneNumberErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action) {

      // Just camel-casing property keys and checking for null/undefined
      const action = Object.assign(...Object.keys(nextProps.action).map(k => ({
          [camelCase(k)]: nextProps.action[k] || ''
      })));

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

  resetErrorText = () => {
    this.setState({ errors: this.defaultErrorText });
  }

  handleInputChange = (event, type, value) => {
    let valid = true;

    if (type === 'state') {
      valid = false;

      statesList.forEach( (state) => {
        if (state.toLowerCase().includes(value.toLowerCase())) {
          valid = true;
        }
      });
      value = value.toUpperCase();
      
      // Hack for AutoComplete
      if (!valid) {
        this.state.refs.stateInput.setState( (prevState) => ({ 
          searchText: prevState.formData.state 
        }));
      }
    } 

    if (valid) {
      this.setState( (prevState) => ({
        formData: Object.assign({},
          prevState.formData,
          { [type]: value }
        )
      }));
    } 
  }

  formSubmit = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    validateString(this, 'title', 'titleErrorText', 'Action Name is Required');
    validateState(this);

    if (!this.hasErrors) {

      const { formData } = this.state;

      formData.id = this.props.action.id;

      this.setState({ saving: true });

      try {

        const results = await this.props.editActionMutation({ 
          variables: {
            data: formData
          },
          // TODO: decide between refetch and update
          refetchQueries: ['ActionQuery', 'ActionsQuery'],
        });

        this.props.dispatch(notify('Changes Saved'));
        this.setState({ saving: false });
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    const { state, formSubmit, handleInputChange } = this;
    const { ...props } = this.props;
    const { formData, errors, refs, saving } = state;

    const action = props.action || {
      title: '',
      slug: ''
    };

    const campaign = props.campaign || {
      title: '',
      slug: ''
    };

    const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

    return (
      <div className={s.outerContainer}>

        <Link to={'/organize/' + campaign.slug}>
          <div className={s.campaignHeader}>{campaign.title}</div>
        </Link>

        <Link to={baseActionUrl}>
          <div className={s.actionHeader}>{action.title}</div>
        </Link>

        <Link to={baseActionUrl + '/settings'}>
          <div className={s.navSubHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Settings
          </div>
        </Link>

        <div className={s.pageSubHeader}>Info</div>

        <ManageActionInfoForm
          handleInputChange={handleInputChange}
          formSubmit={formSubmit}
          action={action}
          data={formData}
          errors={errors}
          refs={refs}
          saving={saving}
        />
      </div>
    );
  }
}

const withActionQuery = graphql(ActionQuery, {
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
    campaign: data.campaign
  })
})

export default compose(
  connect(),
  withActionQuery,
  withCampaignQuery,
  graphql(EditActionMutation, { name: 'editActionMutation' })
)(ManageActionInfoContainer);
