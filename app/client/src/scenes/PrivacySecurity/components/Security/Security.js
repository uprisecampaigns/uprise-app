import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import history from 'lib/history';

import formWrapper from 'lib/formWrapper';

import {
  validateString,
  validatePasswords,
} from 'lib/validateComponentForms';

import {
  cleanForm,
} from 'actions/NotificationsActions';

import ChangePasswordForm from 'components/ChangePasswordForm';

import { attemptChangePassword } from 'actions/AuthActions';


const WrappedChangePasswordForm = formWrapper(ChangePasswordForm);

class Security extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    passwordBeingReset: PropTypes.bool,
    changeError: PropTypes.string,
  }

  static defaultProps = {
    changeError: undefined,
    passwordBeingReset: false,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
    };

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
      newPassword: data.newPassword1,
    };


    const result = await new Promise((resolve, reject) => {
      this.props.dispatch(attemptChangePassword(formData, (r) => {
        resolve(r);
      }));
    });

    if (result.success) {
      this.props.dispatch(cleanForm());
      history.push('/settings');
    }

    return result;
  }

  render() {
    const { state, formSubmit, defaultErrorText } = this;
    const { passwordBeingReset, changeError } = this.props;
    const { formData } = state;

    const validators = [
      (component) => { passwordBeingReset || validateString(component, 'oldPassword', 'oldPasswordErrorText', 'Please enter your password'); },
      component => validateString(component, 'newPassword1', 'newPassword1ErrorText', 'Please enter a password'),
      component => validatePasswords(component),
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

const mapStateToProps = state => ({
  changeError: state.userAuthSession.error,
  passwordBeingReset: state.userAuthSession.userObject.passwordBeingReset || false,
});

export default compose(
  connect(mapStateToProps),
)(Security);
