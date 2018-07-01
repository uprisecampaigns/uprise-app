import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import s from 'styles/Form.scss';

class ResetPasswordForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    cancelReset: PropTypes.func.isRequired,
    resetError: PropTypes.string,
  };

  static defaultProps = {
    resetError: undefined,
  };

  render() {
    const { data, handleInputChange, formSubmit, cancelReset, resetError } = this.props;
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={0}>
            <div className={s.formContainer}>
              <form className={s.form} onSubmit={formSubmit}>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    type="email"
                    value={data.email}
                    errorText={data.emailErrorText || resetError}
                    fullWidth
                    onChange={(event) => {
                      handleInputChange(event, 'email', event.target.value);
                    }}
                  />
                </div>
                <div className={s.button} onClick={cancelReset} onKeyPress={cancelReset} role="button" tabIndex="0">
                  Cancel
                </div>

                <div
                  className={s.secondaryButton}
                  onClick={formSubmit}
                  onKeyPress={formSubmit}
                  role="button"
                  tabIndex="0"
                >
                  Reset
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
