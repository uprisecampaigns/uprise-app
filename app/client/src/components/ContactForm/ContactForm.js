import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import s from 'styles/Form.scss';

class ContactForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    submitText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const { data, formSubmit, errors, saving, handleInputChange, cancel, submitText } = this.props;

    return (
      <div className={s.formContainer}>
        <form className={s.form} onSubmit={formSubmit}>
          <div className={s.textFieldContainer}>
            <TextField
              floatingLabelText="Subject"
              value={data.subject}
              onChange={(event) => {
                handleInputChange(event, 'subject', event.target.value);
              }}
              errorText={errors.subjectErrorText}
              fullWidth
            />
          </div>

          <div className={s.textareaContainer}>
            <TextField
              name="description"
              hintText="Compose message"
              value={data.body}
              multiLine
              rows={4}
              onChange={(event) => {
                handleInputChange(event, 'body', event.target.value);
              }}
              errorText={errors.bodyErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={s.button} onClick={cancel} onKeyPress={cancel} role="button" tabIndex="0">
            Cancel
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
      </div>
    );
  }
}

export default ContactForm;
