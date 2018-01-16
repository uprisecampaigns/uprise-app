import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import s from 'styles/Form.scss';


class AccountForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
  }

  static defaultProps = {
    saving: false,
  }

  render() {
    const {
      data, formSubmit, errors, saving,
      handleInputChange, cancel, submitText,
    } = this.props;

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
                    floatingLabelText="First"
                    value={data.firstName}
                    onChange={(event) => { handleInputChange(event, 'firstName', event.target.value); }}
                    errorText={errors.firstNameErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Last"
                    value={data.lastName}
                    onChange={(event) => { handleInputChange(event, 'lastName', event.target.value); }}
                    errorText={errors.lastNameErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone Number"
                    value={data.phoneNumber}
                    onChange={(event) => { handleInputChange(event, 'phoneNumber', event.target.value); }}
                    errorText={errors.phoneNumberErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    onChange={(event) => { handleInputChange(event, 'zipcode', event.target.value); }}
                    errorText={errors.zipcodeErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    value={data.email}
                    onChange={(event) => { handleInputChange(event, 'email', event.target.value); }}
                    errorText={errors.emailErrorText}
                    fullWidth
                    type="email"
                  />
                </div>

                <div className={s.button}>
                  <RaisedButton
                    onClick={cancel}
                    primary={false}
                    label="Cancel"
                  />
                </div>

                { saving ? (

                  <div className={s.savingThrobberContainer}>
                    <CircularProgress
                      size={100}
                      thickness={5}
                    />
                  </div>
                ) : (

                  <div className={[s.organizeButton, s.button].join(' ')}>
                    <RaisedButton
                      onClick={formSubmit}
                      primary
                      type="submit"
                      label={submitText}
                    />
                  </div>
                )}
              </form>
            </div>
          </Paper>
        </div>

      </div>
    );
  }
}

export default AccountForm;
