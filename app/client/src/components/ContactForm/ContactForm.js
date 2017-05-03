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


class ContactForm extends Component {
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
                    floatingLabelText="Subject"
                    value={data.subject}
                    onChange={ (event) => { handleInputChange(event, 'subject', event.target.value) } }
                    errorText={errors.subjectErrorText}
                    fullWidth={true}
                  />
                </div>
                
                <div className={s.textareaContainer}>
                  <TextField
                    name="description"
                    hintText="Compose message"
                    value={data.body}
                    multiLine={true}
                    rows={4}
                    onChange={ (event) => { handleInputChange(event, 'body', event.target.value) } }
                    errorText={errors.bodyErrorText}
                    fullWidth={true}
                    underlineShow={false}
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

export default ContactForm;
