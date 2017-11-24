import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

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
  static propTypes = {
    user: PropTypes.object,
    editAccountMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    user: undefined,
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
        subheader: '',
        description: '',
        profileImageUrl: '',
      },
    };

    this.state = Object.assign({}, initialState);
  }

  componentWillMount() {
    this.handleUserProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleUserProps(nextProps);
  }

  handleUserProps = (nextProps) => {
    if (nextProps.user && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null/undefined
      const user = Object.assign(...Object.keys(nextProps.user).map((k) => {
        if (nextProps.user[k] !== null) {
          return { [camelCase(k)]: nextProps.user[k] };
        }
        return undefined;
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

  defaultErrorText = {
    firstNameErrorText: null,
    lastNameErrorText: null,
    zipcodeErrorText: null,
    phoneNumberErrorText: null,
    emailErrorText: null,
    subheaderErrorText: null,
    descriptionErrorText: null,
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
      await this.props.editAccountMutation({
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
      const { user } = this.props;
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

          <Link to="/settings">
            <div className={[s.navHeader, s.settingsNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
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
            userId={user.id}
          />

        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
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
