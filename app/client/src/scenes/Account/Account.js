import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import camelCase from 'camelcase';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import formWrapper from 'lib/formWrapper';

import {
  validateString,
  validateZipcode,
  validateEmail,
  validateEmailAvailable,
  validatePhoneNumber,
} from 'lib/validateComponentForms';

import Link from 'components/Link';
import AccountForm from 'components/AccountForm';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import EditAccountMutation from 'schemas/mutations/EditAccountMutation.graphql';

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
        phoneNumber: '',
        zipcode: '',
        email: '',
      },
    };

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = {
    firstNameErrorText: null,
    lastNameErrorText: null,
    zipcodeErrorText: null,
    phoneNumberErrorText: null,
    emailErrorText: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null/undefined
      const user = Object.assign(...Object.keys(nextProps.user).map((k) => {
        if (nextProps.user[k] !== null) {
          return { [camelCase(k)]: nextProps.user[k] };
        }
      }));

      Object.keys(user).forEach((k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete user[k];
        }
      });

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, user),
      }));
    }
  }

  formSubmit = async (data) => {
    // A little hackish to avoid an annoying rerender with previous form data
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data),
    });

    const formData = Object.assign({}, data);

    formData.id = this.props.user.id;

    try {
      const results = await this.props.editAccountMutation({
        variables: {
          data: formData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['MeQuery'],
      });

      return { success: true, message: 'Changes Saved' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  render() {
    if (this.props.user) {
      const { state, formSubmit, defaultErrorText } = this;
      const { user, ...props } = this.props;
      const { formData } = state;

      const validators = [
        component => validateString(component, 'firstName', 'firstNameErrorText', 'First Name is Required'),
        component => validateString(component, 'lastName', 'lastNameErrorText', 'Last Name is Required'),
        component => validateString(component, 'email', 'emailErrorText', 'Please enter an email'),
        component => validateZipcode(component),
        component => validateEmail(component),
        component => validateEmailAvailable(component, user.email),
        component => validatePhoneNumber(component),
        // (component) => validateState(component),
      ];


      return (
        <div className={s.outerContainer}>

          <Link to={'/settings'}>
            <div className={[s.navHeader, s.settingsNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
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
            submitText="Save Changes"
            user={user}
          />

        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(MeQuery, {
    options: ownProps => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      user: data.me,
      graphqlLoading: data.loading,
    }),
  }),
  graphql(EditAccountMutation, { name: 'editAccountMutation' }),
)(Account);
