import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { attemptSignup } from 'actions/AuthActions';

import SignupForm from 'components/SignupForm';
import PrivacyTerms from 'components/PrivacyTerms';


class SignupFormContainer extends Component {
  constructor(props) {
    super(props);
  }

  hasErrors = false

  state = {
    page: 0,
    firstName: '',
    lastName: '',
    email: '',
    password1: '',
    password2: '',
    zip: '',
    firstNameErrorText: null,
    lastNameErrorText: null,
    emailErrorText: null,
    password1ErrorText: null,
    password2ErrorText: null,
    zipErrorText: null,
  }

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
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  formSubmit = async (event) => {
    console.log(event);
    event.preventDefault();
    console.log(this.state.firstName);

    this.hasErrors = false;

    this.validateString('firstName', 'firstNameErrorText', 'First Name is Required');
    this.validateString('lastName', 'lastNameErrorText', 'Last Name is Required');
    this.validateString('email', 'emailErrorText', 'Email is Required');
    this.validateString('zip', 'zipErrorText', 'Zip is Required');

    this.validatePasswords();

    console.log('has errors: ' + this.hasErrors);

    if (!this.hasErrors) {
      try {

        const response = await fetch('/api/checkEmailAvailability', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            "email": this.state.email
          }),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!json.error) {
          if (json.available) {
            this.setState({
              page: 1
            });
          } else {
            this.setState({
              emailErrorText: 'Email already taken'
            });
          }
        } else {
          //TODO: error handling?!?!
          console.error(json.error);
        }

      } catch(err) {
        //TODO: error handling?!?!
        console.error(err);
      }
    }
  }

  agreeToTerms = (event) => {
    this.props.dispatch(attemptSignup({
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      zip: this.state.zip,
      password: this.state.password1,
    }));
  }

  render() {
    if (this.state.page === 0) {
      return (
        <SignupForm 
          handleInputChange={this.handleInputChange}
          formSubmit={this.formSubmit}
          data={this.state}
        />
      );
    } else if (this.state.page === 1) {
      return (
        <PrivacyTerms
          agreeToTerms={this.agreeToTerms}
          cancel={(event) => this.setState({page:0})}
        />
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    signupError: state.userAuthSession.error
  };
}


export default connect(mapStateToProps)(SignupFormContainer);
