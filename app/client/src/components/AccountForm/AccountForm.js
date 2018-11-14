import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Link from 'components/Link';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

import s from 'styles/Form.scss';

import Security from './components/Security';
import Privacy from './components/Privacy';
import Terms from './components/Terms';

class AccountForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
    privacyContent: PropTypes.object.isRequired,
    termsContent: PropTypes.object.isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
  }

  render() {
    const {
      data,
      formSubmit,
      errors,
      saving,
      handleInputChange,
      submitText,
      privacyContent,
      termsContent,
    } = this.props;
    const { modalOpen } = this.state;

    const modalActions = [
      <div
        className={[s.button, s.inlineButton].join(' ')}
        onClick={(event) => {
          event.preventDefault();
          this.setState({ modalOpen: false });
        }}
        onKeyPress={(event) => {
          event.preventDefault();
          this.setState({ modalOpen: false });
        }}
        role="button"
        tabIndex="0"
      >
        Close
      </div>,
    ];

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <div className={s.settingsHeader}>Account Details</div>
              <form className={s.form} onSubmit={formSubmit}>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="First"
                    value={data.firstName}
                    onChange={(event) => {
                      handleInputChange(event, 'firstName', event.target.value);
                    }}
                    errorText={errors.firstNameErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Last"
                    value={data.lastName}
                    onChange={(event) => {
                      handleInputChange(event, 'lastName', event.target.value);
                    }}
                    errorText={errors.lastNameErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone Number"
                    value={data.phoneNumber}
                    onChange={(event) => {
                      handleInputChange(event, 'phoneNumber', event.target.value);
                    }}
                    errorText={errors.phoneNumberErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Zipcode"
                    value={data.zipcode}
                    onChange={(event) => {
                      handleInputChange(event, 'zipcode', event.target.value);
                    }}
                    errorText={errors.zipcodeErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    value={data.email}
                    onChange={(event) => {
                      handleInputChange(event, 'email', event.target.value);
                    }}
                    errorText={errors.emailErrorText}
                    fullWidth
                    type="email"
                  />
                </div>

                {saving ? (
                  <div className={s.savingThrobberContainer}>
                    <CircularProgress size={100} thickness={5} />
                  </div>
                ) : (
                  <div
                    className={[s.organizeButton, s.button].join(' ')}
                    onClick={formSubmit}
                    onKeyPress={formSubmit}
                    role="button"
                    tabIndex="0"
                  >
                    {submitText}
                  </div>
                )}
              </form>

              <div className={s.settingsHeader}>Security</div>

              <Security />

              <div className={s.settingsHeader}>Your Privacy Matters: Our Policy</div>
              <div className={s.formText}>
                At UpRise, we believe in empowering volunteers to engage civically. That mission starts by putting
                volunteers in control of their own personal information. Our aim is for you to always feel informed and
                empowered with respect to your privacy on UpRise.
              </div>
              <div className={s.formText}>
                <Link
                  to=""
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({ modalOpen: 'privacy' });
                  }}
                  useAhref={false}
                  className={s.link}
                >
                  Read our privacy policy
                </Link>
              </div>

              <div className={s.settingsHeader}>Terms of Use</div>
              <div className={s.formText}>Use of the UpRise Platforms implies you agree to our Terms of Use.</div>
              <div className={s.formText}>
                <Link
                  to=""
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({ modalOpen: 'terms' });
                  }}
                  useAhref={false}
                  className={s.link}
                >
                  Read our Terms of Use
                </Link>
              </div>
            </div>
          </Paper>
        </div>
        <Dialog
          modal
          autoScrollBodyContent
          actions={modalActions}
          actionsContainerClassName={s.modalActionsContainer}
          open={modalOpen}
        >
          {modalOpen === 'privacy' ? <Privacy content={privacyContent} /> : <Terms content={termsContent} />}
        </Dialog>
      </div>
    );
  }
}

export default AccountForm;
