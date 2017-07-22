import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import { attemptSignup } from 'actions/AuthActions';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';
import history from 'lib/history';

import EmailAvailableQuery from 'schemas/queries/EmailAvailableQuery.graphql';

import SignupForm from './components/SignupForm';
import Terms from './components/Terms';


class SignupFormContainer extends Component {
  static propTypes = {
    termsContent: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      firstName: '',
      lastName: '',
      email: '',
      password1: '',
      password2: '',
      zipcode: '',
      firstNameErrorText: null,
      lastNameErrorText: null,
      emailErrorText: null,
      password1ErrorText: null,
      password2ErrorText: null,
      zipcodeErrorText: null,
    };
  }

  hasErrors = false

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

  formSubmit = async (event) => {
    event.preventDefault();

    this.hasErrors = false;

    this.validateString('firstName', 'firstNameErrorText', 'First Name is Required');
    this.validateString('lastName', 'lastNameErrorText', 'Last Name is Required');
    this.validateZipcode();
    this.validateEmail();

    this.validatePasswords();

    if (!this.hasErrors) {
      try {
        const response = await this.props.client.query({
          query: EmailAvailableQuery,
          variables: {
            email: this.state.email,
          },
          fetchPolicy: 'network-only',
        });


        if (response.data.emailAvailable) {
          this.setState({
            page: 1,
          });
        } else {
          this.setState({
            emailErrorText: 'Email already taken',
          });
        }
      } catch (err) {
        // TODO: error handling?!?!
        console.error(err);
      }
    }
  }

  agreeToTerms = (event) => {
    this.props.dispatch(attemptSignup({
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      zipcode: this.state.zipcode,
      password: this.state.password1,
    }));
  }

  cancelSignup = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {
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
      <SignupForm
        handleInputChange={this.handleInputChange}
        cancelSignup={this.cancelSignup}
        formSubmit={this.formSubmit}
        data={this.state}
      />
    );
  }
}

const SignupFormContainerWithApollo = withApollo(SignupFormContainer);

const mapStateToProps = state => ({
  signupError: state.userAuthSession.error,
  loggedIn: state.userAuthSession.isLoggedIn,
});


export default connect(mapStateToProps)(SignupFormContainerWithApollo);
