import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import states from 'lib/states-list';

import s from 'styles/Form.scss';

class NGPForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    campaign: PropTypes.object.isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const {
      data,
      refs,
      formSubmit,
      campaignId,
      errors,
      saving,
      uploading,
      handleInputChange,
      addItem,
      removeItem,
      cancel,
      submitText,
      campaign,
    } = this.props;

    const statesList = Object.keys(states);

    return (
      <div>
        <div className={s.section}>
          <div className={s.sectionContent}>
            <div className={s.formContainer}>
              <form onSubmit={formSubmit}>
                <div className={s.formHeader}>VAN Info</div>
                <div className={s.formBody}>
                  In order to sync your volunteer information to your VAN <em>MyCampaign</em> account, we need the API
                  key provided to you by VAN.
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Application Name"
                    value={data.ngpName}
                    onChange={(event) => {
                      handleInputChange(event, 'ngpName', event.target.value);
                    }}
                    errorText={errors.ngpNameErrorText}
                    fullWidth
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="NGP API Key"
                    className={s.textField}
                    value={data.ngpKey}
                    onChange={(event) => {
                      handleInputChange(event, 'ngpKey', event.target.value);
                    }}
                    errorText={errors.ngpKeyErrorText}
                    fullWidth
                  />
                </div>
                <div className={s.centerButtons}>
                  {saving || uploading ? (
                    <div className={s.savingThrobberContainer}>
                      <CircularProgress size={100} thickness={5} />
                    </div>
                  ) : (
                    <div
                      className={[s.organizeButton, s.button, s.inlineButton].join(' ')}
                      onClick={formSubmit}
                      onKeyPress={formSubmit}
                      role="button"
                      tabIndex="0"
                    >
                      {submitText}
                    </div>
                  )}
                </div>
                <div className={s.formBody}>
                  Don't have an API key? An Admin or Voter File Manager can request an API key directly from VAN
                  support.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(NGPForm);
