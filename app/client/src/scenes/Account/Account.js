import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import formWrapper from 'lib/formWrapper';

import { 
  validateString,
  validateZipcode,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import Link from 'components/Link';
import AccountForm from 'components/AccountForm';

import { MeQuery } from 'schemas/queries';

import { 
  EditAccountMutation
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';


import s from 'styles/Settings.scss';


const WrappedAccountForm = formWrapper(AccountForm);

class Account extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        firstName: '',
        lastName: '',
      },
      saving: false
    }

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = { 
    firstNameErrorText: null,
    lastNameErrorText: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign && !nextProps.graphqlLoading) {

      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => {
        if (nextProps.campaign[k] !== null) {
          return { [camelCase(k)]: nextProps.campaign[k] };
        }
      }));

      Object.keys(campaign).forEach( (k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign)
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

    formData.id = this.props.user.id;

    this.setState({ saving: true });

    try {

      const results = await this.props.editCampaignMutation({ 
        variables: {
          data: formData
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });

      this.props.dispatch(notify('Changes Saved'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    if (this.props.user) {
      const { state, formSubmit, defaultErrorText } = this;
      const { user, ...props } = this.props;
      const { formData, saving } = state;

      const validators = [
        (component) => validateString(component, 'firstName', 'firstNameErrorText', 'First Name is Required'),
        (component) => validateString(component, 'lastName', 'lastNameErrorText', 'Last Name is Required'),
        (component) => validateZipcode(component),
        (component) => validatePhoneNumber(component),
        (component) => validateState(component),
      ];


      return (
        <div className={s.outerContainer}>

          <Link to={'/settings'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.settingsHeader}>Account</div>

          <WrappedAccountForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            saving={saving}
            submitText="Save Changes"
            user={user}
          />

        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(MeQuery, {
    options: (ownProps) => ({ 
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      user: data.me,
      graphqlLoading: data.loading
    })
  }),
  graphql(EditAccountMutation, { name: 'editAccountMutation' })
)(Account);
