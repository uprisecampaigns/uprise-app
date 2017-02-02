import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Link from '../Link';

import s from 'styles/Form.scss';
import b from 'styles/Base.scss';

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    passwordIsReset: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    error: PropTypes.string,
  }

  render() {
    const { data, handleInputChange, formSubmit, cancel, error } = this.props;
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
                    floatingLabelText="Old Password"
                    value={data.oldPassword}
                    errorText={data.oldPasswordErrorText || error}
                    type="password"
                    onChange={ (event) => { handleInputChange(event, 'oldPassword', event.target.value) } }
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="New Password"
                    value={data.newPassword1}
                    errorText={data.newPassword1ErrorText}
                    type="password"
                    onChange={ (event) => { handleInputChange(event, 'newPassword1', event.target.value) } }
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Please Enter your Password Again"
                    value={data.newPassword2}
                    errorText={data.newPassword2ErrorText}
                    type="password"
                    onChange={ (event) => { handleInputChange(event, 'newPassword2', event.target.value) } }
                  />
                </div>
                <RaisedButton 
                  onTouchTap={formSubmit} 
                  type="submit"
                  primary={true} 
                  label="Change" 
                />
                <div className={s.cancelButton}>
                  <RaisedButton 
                    onTouchTap={cancel} 
                    primary={false} 
                    label="Cancel" 
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

export default ChangePasswordForm;
