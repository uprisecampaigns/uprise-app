import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Link from '../Link';
import { attemptSignup } from '../../actions/AuthActions';

import s from './SignupForm.scss';

class SignupForm extends Component {
  constructor(props) {
    super(props);
  }

  hasErrors = false

  state = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password1: '',
    password2: '',
    zip: '',
    firstNameErrorText: null,
    lastNameErrorText: null,
    emailErrorText: null,
    usernameErrorText: null,
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

  formSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    console.log(this.state.firstName);

    this.hasErrors = false;

    this.validateString('firstName', 'firstNameErrorText', 'First Name is Required');
    this.validateString('lastName', 'lastNameErrorText', 'Last Name is Required');
    this.validateString('email', 'emailErrorText', 'Email is Required');
    this.validateString('username', 'usernameErrorText', 'Username is Required');
    this.validateString('zip', 'zipErrorText', 'Zip is Required');

    this.validatePasswords();

    console.log('has errors: ' + this.hasErrors);

    if (!this.hasErrors) {
      this.props.dispatch(attemptSignup({
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        zip: this.state.zip,
        password: this.state.password1,
      }));
    }
  }

  render() {
    const { dispatch } = this.props;
    return (
      <div className={s.signupFormContainer}>
        <Paper zDepth={2}>
          <form 
            className={s.form}
            onSubmit={this.formSubmit}
          >
            <div className={s.textFieldContainer}>
              <div> {this.props.signupError}</div>
              <TextField
                floatingLabelText="First Name"
                value={this.state.firstName}
                onChange={ (event) => { this.handleInputChange(event, 'firstName', event.target.value) } }
                errorText={this.state.firstNameErrorText}
              />
              <TextField
                floatingLabelText="Last Name"
                value={this.state.lastName}
                onChange={ (event) => { this.handleInputChange(event, 'lastName', event.target.value) } }
                errorText={this.state.lastNameErrorText}
              />
            </div>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Email"
                value={this.state.email}
                onChange={ (event) => { this.handleInputChange(event, 'email', event.target.value) } }
                errorText={this.state.emailErrorText}
              />
            </div>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Choose a Username"
                value={this.state.username}
                onChange={ (event) => { this.handleInputChange(event, 'username', event.target.value) } }
                errorText={this.state.usernameErrorText}
              />
            </div>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Create a Password"
                type="password"
                value={this.state.password1}
                onChange={ (event) => { this.handleInputChange(event, 'password1', event.target.value) } }
                errorText={this.state.password1ErrorText}
              />
            </div>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Confirm your Password"
                type="password"
                value={this.state.password2}
                onChange={ (event) => { this.handleInputChange(event, 'password2', event.target.value) } }
                errorText={this.state.password2ErrorText}
              />
            </div>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Zip"
                value={this.state.zip}
                onChange={ (event) => { this.handleInputChange(event, 'zip', event.target.value) } }
                errorText={this.state.zipErrorText}
              />
            </div>
            <RaisedButton 
              onTouchTap={this.formSubmit} 
              primary={true} 
              type="submit"
              label="Go" 
            />
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupError: state.userAuthSession.error
  };
}


export default connect(mapStateToProps)(SignupForm);
