import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import s from 'styles/Form.scss';

class SignupForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    signupError: PropTypes.string,
  };

  static defaultProps = {
    signupError: '',
  };

  render() {
    const { data, formSubmit, errors, handleInputChange, cancel } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={0}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.sectionHeader}>Register</div>
              <div className={s.sectionSubheader}>Create an account to get started on UpRise</div>
            </div>
            <div className={s.formContainer}>
              <form className={s.form} onSubmit={formSubmit}>
                <div className={s.errorMessage}> {this.props.signupError} </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="First Name"
                    value={data.firstName}
                    onChange={(event) => {
                      handleInputChange(event, 'firstName', event.target.value);
                    }}
                    errorText={errors.firstNameErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Last Name"
                    value={data.lastName}
                    onChange={(event) => {
                      handleInputChange(event, 'lastName', event.target.value);
                    }}
                    errorText={errors.lastNameErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    type="email"
                    value={data.email}
                    onChange={(event) => {
                      handleInputChange(event, 'email', event.target.value);
                    }}
                    errorText={errors.emailErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone Number (optional)"
                    value={data.phoneNumber}
                    onChange={(event) => {
                      handleInputChange(event, 'phoneNumber', event.target.value);
                    }}
                    errorText={errors.phoneNumberErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Create a Password"
                    type="password"
                    value={data.password1}
                    onChange={(event) => {
                      handleInputChange(event, 'password1', event.target.value);
                    }}
                    errorText={errors.password1ErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Confirm your Password"
                    type="password"
                    value={data.password2}
                    onChange={(event) => {
                      handleInputChange(event, 'password2', event.target.value);
                    }}
                    errorText={errors.password2ErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    pattern="[0-9]{5}"
                    type="text"
                    onChange={(event) => {
                      handleInputChange(event, 'zipcode', event.target.value);
                    }}
                    errorText={errors.zipcodeErrorText}
                  />
                </div>
                <div className={s.button} onClick={cancel} onKeyPress={cancel} role="button" tabIndex="0">
                  Cancel
                </div>
                <div className={s.secondaryButton} onClick={formSubmit} onKeyPress={formSubmit} role="button" tabIndex="0">
                  Create Account
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
