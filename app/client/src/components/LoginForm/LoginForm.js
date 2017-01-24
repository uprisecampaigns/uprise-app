import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Link from '../Link';

import s from 'styles/Form.scss';

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    loginError: PropTypes.string,
  }

  render() {
    const { data, handleInputChange, formSubmit, loginError } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form 
                className={s.form}
                onSubmit={formSubmit}
              >
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    value={data.email}
                    errorText={data.emailErrorText || loginError}
                    onChange={ (event) => { handleInputChange(event, 'email', event.target.value) } }
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Password"
                    value={data.password}
                    errorText={data.passwordErrorText}
                    onChange={ (event) => { handleInputChange(event, 'password', event.target.value) } }
                    type="password"
                  />
                </div>
                <RaisedButton 
                  onTouchTap={formSubmit} 
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

export default LoginForm;
