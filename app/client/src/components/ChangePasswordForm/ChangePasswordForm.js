import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Form.scss';

function OldPassword({show, data, errors, handleInputChange, error}) {
  if(show) {
    return (
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="Current Password"
          value={data.oldPassword}
          errorText={errors.oldPasswordErrorText || error}
          type="password"
          onChange={ (event) => { handleInputChange(event, 'oldPassword', event.target.value) } }
          fullWidth={true}
        />
      </div>
    );
  } else {
    return null;
  }
}

function ChangePasswordForm({data, errors, handleInputChange, formSubmit, passwordBeingReset, cancel, error}) {

  return (
    <form 
      className={s.form}
      onSubmit={formSubmit}
    >
      <OldPassword 
        show={!passwordBeingReset}
        data={data}
        errors={errors}
        error={error}
        handleInputChange={handleInputChange}
      />
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="New Password"
          value={data.newPassword1}
          errorText={errors.newPassword1ErrorText}
          type="password"
          onChange={ (event) => { handleInputChange(event, 'newPassword1', event.target.value) } }
          fullWidth={true}
        />
      </div>
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="Confirm New Password"
          value={data.newPassword2}
          errorText={errors.newPassword2ErrorText}
          type="password"
          onChange={ (event) => { handleInputChange(event, 'newPassword2', event.target.value) } }
          fullWidth={true}
        />
      </div>
      <div className={s.primaryButton}>
        <RaisedButton 
          onTouchTap={formSubmit} 
          type="submit"
          primary={true} 
          label="Save Changes" 
        />
      </div>
    </form>
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
