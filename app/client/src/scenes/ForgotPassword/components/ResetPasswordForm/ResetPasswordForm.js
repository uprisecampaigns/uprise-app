import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Form.scss';


class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    cancelReset: PropTypes.func.isRequired,
    resetError: PropTypes.string,
  }

  render() {
    const { data, handleInputChange, formSubmit, cancelReset, resetError } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={0}>
            <div className={s.formContainer}>
              <form
                className={s.form}
                onSubmit={formSubmit}
              >
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    type="email"
                    value={data.email}
                    errorText={data.emailErrorText || resetError}
                    fullWidth
                    onChange={(event) => { handleInputChange(event, 'email', event.target.value); }}
                  />
                </div>
                <div className={s.button}>
                  <RaisedButton
                    onTouchTap={cancelReset}
                    primary={false}
                    label="Cancel"
                  />
                </div>
                <div className={[s.button, s.secondaryButton].join(' ')}>
                  <RaisedButton
                    onTouchTap={formSubmit}
                    type="submit"
                    primary
                    label="Reset"
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

export default ResetPasswordForm;
