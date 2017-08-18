import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import s from 'styles/Form.scss';


class LoginForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    loginError: PropTypes.string,
    message: PropTypes.string,
  }

  static defaultProps = {
    loginError: undefined,
    message: undefined,
  }

  render() {
    const { data, handleInputChange, formSubmit, loginError, message } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>

          <Paper zDepth={0}>
            <div className={s.loginHeader}>Log In</div>
            <div className={s.formContainer}>
              <div
                className={s.messageContainer}
              >
                {message}
              </div>
              <form
                className={s.form}
                onSubmit={formSubmit}
              >
                <div className={[s.textFieldContainer, s.centered].join(' ')}>
                  <TextField
                    floatingLabelText="Email"
                    value={data.email}
                    type="email"
                    errorText={data.emailErrorText || loginError}
                    onChange={(event) => { handleInputChange(event, 'email', event.target.value); }}
                  />
                </div>
                <div className={[s.textFieldContainer, s.centered].join(' ')}>
                  <TextField
                    floatingLabelText="Password"
                    value={data.password}
                    errorText={data.passwordErrorText}
                    onChange={(event) => { handleInputChange(event, 'password', event.target.value); }}
                    type="password"
                  />
                </div>
                <div className={[s.button, s.primaryButton].join(' ')}>
                  <RaisedButton
                    className={s.secondaryButton}
                    onTouchTap={formSubmit}
                    type="submit"
                    primary
                    label="Go"
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

export default LoginForm;
