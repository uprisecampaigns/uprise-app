import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Link from 'components/Link';

import { attemptSignup } from 'actions/AuthActions';

import s from 'styles/Form.scss';


class SignupForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    formSubmit: PropTypes.func.isRequired,
    cancelSignup: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  render() {
    const { data, formSubmit, handleInputChange, cancelSignup } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form 
                className={s.form}
                onSubmit={formSubmit}
              >
                <div> {this.props.signupError} </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="First Name"
                    value={data.firstName}
                    onChange={ (event) => { handleInputChange(event, 'firstName', event.target.value) } }
                    errorText={data.firstNameErrorText}
                    fullWidth={true}
                  />
                  <TextField
                    floatingLabelText="Last Name"
                    value={data.lastName}
                    onChange={ (event) => { handleInputChange(event, 'lastName', event.target.value) } }
                    errorText={data.lastNameErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    type="email"
                    value={data.email}
                    onChange={ (event) => { handleInputChange(event, 'email', event.target.value) } }
                    errorText={data.emailErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Create a Password"
                    type="password"
                    value={data.password1}
                    onChange={ (event) => { handleInputChange(event, 'password1', event.target.value) } }
                    errorText={data.password1ErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Confirm your Password"
                    type="password"
                    value={data.password2}
                    onChange={ (event) => { handleInputChange(event, 'password2', event.target.value) } }
                    errorText={data.password2ErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    type="number"
                    onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
                    errorText={data.zipcodeErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={cancelSignup} 
                    primary={false} 
                    label="Cancel" 
                  />
                </div>
                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={formSubmit} 
                    primary={true} 
                    type="submit"
                    label="Signup" 
                  />
                </div>
              </form>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default SignupForm;
