import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import isEmail from 'validator/lib/isEmail';
import history from 'lib/history';

import { attemptChangePassword } from 'actions/AuthActions';

import ChangePasswordForm from 'components/ChangePasswordForm';

class ChangePasswordFormContainer extends Component {
  constructor(props) {
    super(props);
  }

  hasErrors = false

  state = {
    oldPassword: '',
    oldPasswordErrorText: null,
    newPassword1: '',
    newPassword1ErrorText: null,
    newPassword2: '',
    newPassword2ErrorText: null,
  }
 
  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  // TODO: this is used in SignupForm as well - DRY it out
  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state[prop] !== 'string' || 
        this.state[prop].trim() === '') {

      this.setState({ 
        [errorProp]: errorMsg 
      });

      this.hasErrors = true;

    } else {
      this.setState({ 
        [errorProp]: null 
      });
    }
  }

  validateNewPasswords = () => {
    this.setState({
      newPassword1ErrorText: null,
      newPassword2ErrorText: null,
    });

    this.validateString('newPassword1', 'newPassword1ErrorText', 'Please enter a password');

    if (this.state.newPassword1 !== this.state.newPassword2) {
      this.setState({
        newPassword1ErrorText: 'Passwords must match',
        newPassword2ErrorText: 'Passwords must match',
      });
      this.hasErrors = true;
    }
  }


  formSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    this.hasErrors = false;

    console.log(this.state);

    this.validateString('oldPassword', 'oldPasswordErrorText', 'Please enter your old password');
    this.validateNewPasswords();

    if (!this.hasErrors) {
      this.props.dispatch(attemptChangePassword({
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword1,
      }));
    }
  }

  cancelChange = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {
    return (
      <ChangePasswordForm
        data={this.state}
        handleInputChange={this.handleInputChange}
        passwordIsReset={this.props.passwordIsReset}
        formSubmit={this.formSubmit}
        cancel={this.cancelChange}
        error={this.props.changeError}
      /> 
    );
  }
}

const mapStateToProps = (state) => {
  return {
    changeError: state.userAuthSession.error,
    passwordIsReset: state.userAuthSession.userObject.passwordIsReset || false
  };
}


export default connect(mapStateToProps)(ChangePasswordFormContainer);
