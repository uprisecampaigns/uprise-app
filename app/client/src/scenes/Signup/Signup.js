import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

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

  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state[prop] !== 'string' ||
        this.state[prop].trim() === '') {
      this.setState({
        [errorProp]: errorMsg,
      });

      this.hasErrors = true;
    } else {
      this.setState({
        [errorProp]: null,
      });
    }
  }

  validateZipcode = () => {
    this.setState({
      zipcodeErrorText: null,
    });

    this.validateString('zipcode', 'zipcodeErrorText', 'Zipcode is Required');

    if (typeof this.state.zipcode === 'string' &&
        this.state.zipcode.length !== 5) {
      this.setState({
        zipcodeErrorText: 'Zipcode must be 5 digits long',
      });

      this.hasErrors = true;
    }
  }

  validateEmail = () => {
    this.setState({
      emailErrorText: null,
    });

    this.validateString('email', 'emailErrorText', 'Email is Required');

    if (typeof this.state.email === 'string' &&
        !isEmail(this.state.email)) {
      this.setState({
        emailErrorText: 'Please enter a valid email',
      });
      this.hasErrors = true;
    }
  }

  validatePasswords = () => {
    this.setState({
      password1ErrorText: null,
      password2ErrorText: null,
    });

    this.validateString('password1', 'password1ErrorText', 'Please enter a password');

    if (this.state.password1 !== this.state.password2) {
      this.setState({
        password1ErrorText: 'Passwords must match',
        password2ErrorText: 'Passwords must match',
      });
      this.hasErrors = true;
    }
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
