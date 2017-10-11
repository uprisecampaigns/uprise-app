import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import s from 'styles/Form.scss';


function OldPassword({ show, data, errors, handleInputChange, error }) {
  if (show) {
    return (
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="Current Password"
          value={data.oldPassword}
          errorText={errors.oldPasswordErrorText || error}
          type="password"
          onChange={(event) => { handleInputChange(event, 'oldPassword', event.target.value); }}
          fullWidth
        />
      </div>
    );
  }
  return null;
}

OldPassword.propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    oldPassword: PropTypes.string,
  }).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

OldPassword.defaultProps = {
  error: null,
};

function ChangePasswordForm({
  data, errors, handleInputChange, formSubmit,
  passwordBeingReset, cancel, error,
}) {
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
          onChange={(event) => { handleInputChange(event, 'newPassword1', event.target.value); }}
          fullWidth
        />
      </div>
      <div className={s.textFieldContainer}>
        <TextField
          floatingLabelText="Confirm New Password"
          value={data.newPassword2}
          errorText={errors.newPassword2ErrorText}
          type="password"
          onChange={(event) => { handleInputChange(event, 'newPassword2', event.target.value); }}
          fullWidth
        />
      </div>
      <div className={s.primaryButton}>
        <RaisedButton
          onTouchTap={formSubmit}
          type="submit"
          primary
          label="Save Changes"
        />
      </div>
    </form>
  );
}

ChangePasswordForm.propTypes = {
  data: PropTypes.shape({
    newPassword1: PropTypes.string,
    newPassword2: PropTypes.string,
    oldPassword: PropTypes.string,
  }).isRequired,
  formSubmit: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  passwordBeingReset: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  error: PropTypes.string,
};

ChangePasswordForm.defaultProps = {
  error: null,
};


export default ChangePasswordForm;
