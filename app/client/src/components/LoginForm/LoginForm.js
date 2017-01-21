import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Link from '../Link';
import { attemptLogin } from '../../actions/AuthActions';

import s from './LoginForm.scss';

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  hasErrors = false

  state = {
    email: '',
    password: '',
    emailErrorText: null,
    passwordErrorText: null,
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


  formSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    this.hasErrors = false;

    this.validateString('email', 'emailErrorText', 'Email is Required');
    this.validateString('password', 'passwordErrorText', 'Password is Required');
    console.log(this.state);

    if (!this.hasErrors) {
      this.props.dispatch(attemptLogin({
        email: this.state.email,
        password: this.state.password,
      }));
    }
  }


  render() {
    const { dispatch } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              { this.props.loginError }
              <form 
                className={s.form}
                onSubmit={this.formSubmit}
              >
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    value={this.state.email}
                    errorText={this.state.emailErrorText || this.props.loginError}
                    onChange={ (event) => { this.handleInputChange(event, 'email', event.target.value) } }
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Password"
                    value={this.state.password}
                    errorText={this.state.passwordErrorText}
                    onChange={ (event) => { this.handleInputChange(event, 'password', event.target.value) } }
                    type="password"
                  />
                </div>
                <RaisedButton 
                  onTouchTap={this.formSubmit} 
                  type="submit"
                  primary={true} 
                  label="Login" 
                />
              </form>
            </div>
          </Paper>

          <Link 
            useAhref={false} 
            to='/signup'
            className={s.signupButton}
          >
            <RaisedButton secondary={true} label="Signup" />
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginError: state.userAuthSession.error
  };
}


export default connect(mapStateToProps)(LoginForm);
