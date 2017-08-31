import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import history from 'lib/history';
import { attemptSignup } from 'actions/AuthActions';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';

import formWrapper from 'lib/formWrapper';

import {
  validateString,
  validateZipcode,
  validateEmail,
  validateEmailAvailable,
  validatePhoneNumber,
  validatePasswords,
} from 'lib/validateComponentForms';

import SignupForm from './components/SignupForm';
import Terms from './components/Terms';

const WrappedSignupForm = formWrapper(SignupForm);

class Signup extends Component {
  static propTypes = {
    termsContent: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    signupError: PropTypes.string.isRequired,
    handleCancel: PropTypes.func,
  }

  static defaultProps = {
    handleCancel: (event) => {
      (typeof event.preventDefault === 'function') && event.preventDefault();
      history.push('/login');
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password1: '',
        password2: '',
        phoneNumber: '',
        zipcode: '',
      },
    };
  }

  defaultErrorText = {
    firstNameErrorText: null,
    lastNameErrorText: null,
    zipcodeErrorText: null,
    phoneNumberErrorText: null,
    emailErrorText: null,
  }

  handleInputChange = (event, type, value) => {
    if (!(typeof type === 'string' && type === 'zipcode' && (value.length > 5 || !isNumeric(value)))) {
      this.setState(Object.assign({},
        this.state,
        { [type]: value },
      ));
    }
  }

  formSubmit = async (data) => {
    this.setState({
      formData: Object.assign({}, data),
      page: 1,
    });

    return { success: true, message: 'Please read and agree to terms' };
  }

  agreeToTerms = (event) => {
    this.props.dispatch(attemptSignup({
      email: this.state.formData.email,
      firstName: this.state.formData.firstName,
      lastName: this.state.formData.lastName,
      zipcode: this.state.formData.zipcode,
      phoneNumber: this.state.formData.phoneNumber,
      password: this.state.formData.password1,
    }));
  }

  render() {
    const validators = [
      component => validateString(component, 'firstName', 'firstNameErrorText', 'First Name is Required'),
      component => validateString(component, 'lastName', 'lastNameErrorText', 'Last Name is Required'),
      component => validateString(component, 'email', 'emailErrorText', 'Please enter an email'),
      component => validateString(component, 'password1', 'password1ErrorText', 'Please enter a password'),
      component => validateZipcode(component),
      component => validateEmail(component),
      component => validateEmailAvailable(component),
      component => validatePhoneNumber(component),
      component => validatePasswords(component, 'password1', 'password2', 'password1ErrorText', 'password2ErrorText'),
    ];

    if (this.state.page === 1) {
      return (
        <Terms
          agreeToTerms={this.agreeToTerms}
          cancel={event => this.setState({ page: 0 })}
          content={this.props.termsContent}
        />
      );
    }

    return (
      <WrappedSignupForm
        initialState={this.state.formData}
        initialErrors={this.defaultErrorText}
        validators={validators}
        submit={this.formSubmit}
        signupError={this.props.signupError}
        cancel={this.props.handleCancel}
      />
    );
  }
}

const SignupWithApollo = withApollo(Signup);

const mapStateToProps = state => ({
  signupError: state.userAuthSession.error,
  loggedIn: state.userAuthSession.isLoggedIn,
});


export default connect(mapStateToProps)(SignupWithApollo);
