import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class AccountForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired
  }

  render() {
    const { 
      data, formSubmit, errors, saving,
      handleInputChange, cancel, submitText 
    } = this.props;

    const statesList = Object.keys(states);


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
                    onChange={ (event) => { handleInputChange(event, 'firstName', event.target.value) } }
                    errorText={errors.firstNameErrorText}
                    fullWidth={true}
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Last"
                    value={data.lastName}
                    onChange={ (event) => { handleInputChange(event, 'lastName', event.target.value) } }
                    errorText={errors.lastNameErrorText}
                    fullWidth={true}
                  />
                </div>
 
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone Number"
                    value={data.phoneNumber}
                    onChange={ (event) => { handleInputChange(event, 'phoneNumber', event.target.value) } }
                    errorText={errors.phoneNumberErrorText}
                    fullWidth={true}
                  />
                </div>
 
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    onChange={ (event) => { handleInputChange(event, 'zipcode', event.target.value) } }
                    errorText={errors.zipcodeErrorText}
                    fullWidth={true}
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
                      onTouchTap={formSubmit} 
                      primary={true} 
                      type="submit"
                      label={submitText} 
                    />
                  </div>
                )}

                <div className={s.button}>
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

export default AccountForm;
