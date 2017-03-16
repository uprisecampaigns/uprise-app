import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Form.scss';

function OldPassword({show, data, handleInputChange, error}) {
  if(show) {
    return (
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="Old Password"
          value={data.oldPassword}
          errorText={data.oldPasswordErrorText || error}
          type="password"
          onChange={ (event) => { handleInputChange(event, 'oldPassword', event.target.value) } }
        />
      </div>
    );
  } else {
    return null;
  }
}

function ChangePasswordForm({data, handleInputChange, formSubmit, passwordBeingReset, cancel, error}) {

  return (
    <div className={s.outerContainer}>
      <div className={s.innerContainer}>
        <Paper zDepth={2}>
          <div className={s.formContainer}>
            <form 
              className={s.form}
              onSubmit={formSubmit}
            >
              <OldPassword 
                show={!passwordBeingReset}
                data={data}
                error={error}
                handleInputChange={handleInputChange}
              />
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
              <div className={s.button}>
                <RaisedButton 
                  onTouchTap={cancel} 
                  primary={false} 
                  label="Cancel" 
                />
              </div>
              <div className={s.button}>
                <RaisedButton 
                  onTouchTap={formSubmit} 
                  type="submit"
                  primary={true} 
                  label="Change" 
                />
              </div>
            </form>
          </div>
        </Paper>
      </div>
    </div>
  );
}

ChangePasswordForm.propTypes = {
  data: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  passwordBeingReset: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  error: PropTypes.string,
}


export default ChangePasswordForm;
