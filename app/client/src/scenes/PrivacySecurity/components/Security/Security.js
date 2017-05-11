import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import history from 'lib/history';

import formWrapper from 'lib/formWrapper';

import { 
  validateString,
  validateNewPasswords,
} from 'lib/validateComponentForms';

import Link from 'components/Link';
import ChangePasswordForm from 'components/ChangePasswordForm';

import { attemptChangePassword } from 'actions/AuthActions';

import s from 'styles/Settings.scss';


const WrappedChangePasswordForm = formWrapper(ChangePasswordForm);

class Security extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
    }

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = { 
    oldPasswordErrorText: null,
    newPassword1ErrorText: null,
    newPassword2ErrorText: null,
  }

  formSubmit = async (data) => {
      
    const formData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword1
    };
    
    this.props.dispatch(attemptChangePassword(formData, () => {
      history.push('/settings');
    }));
  }

  render() {

    const { state, formSubmit, defaultErrorText } = this;
    const { passwordBeingReset, changeError, ...props } = this.props;
    const { formData } = state;

    const validators = [
      (component) => { passwordBeingReset || validateString(component, 'oldPassword', 'oldPasswordErrorText', 'Please enter your password') },
      (component) => validateString(component, 'newPassword1', 'newPassword1ErrorText', 'Please enter a password'),
      (component) => validateNewPasswords(component),
    ];

    return (

      <WrappedChangePasswordForm
        initialState={formData}
        initialErrors={defaultErrorText}
        passwordBeingReset={passwordBeingReset}
        validators={validators}
        submit={formSubmit}
        error={changeError}
      />

    );
  }
}

const mapStateToProps = (state) => {
  return {
    changeError: state.userAuthSession.error,
    passwordBeingReset: state.userAuthSession.userObject.passwordBeingReset || false
  };
}

export default compose(
  connect(mapStateToProps),
)(Security);
