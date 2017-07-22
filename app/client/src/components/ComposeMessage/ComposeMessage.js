import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';


import {
  validateString,
} from 'lib/validateComponentForms';

import s from 'styles/ComposeMessage.scss';


class ComposeMessage extends React.Component {
  static propTypes = {
    fromEmail: PropTypes.string.isRequired,
    detailLines: PropTypes.arrayOf(PropTypes.string).isRequired,
    recipients: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string,
    })).isRequired,
    handleSend: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        subject: '',
        body: '',
      },
      errors: {
        subjectErrorText: null,
        bodyErrorText: null,
      },
      modalOpen: false,
    };

    this.state = Object.assign({}, initialState);
  }

  clickedSend = (event) => {
    this.hasErrors = false;

    validateString(this, 'subject', 'subjectErrorText', 'Subject is Required');
    validateString(this, 'body', 'bodyErrorText', 'Please enter some content');

    if (!this.hasErrors) {
      this.setState({ modalOpen: true });
    }
  };

  confirmSend = (event) => {
    event.preventDefault();

    const { body, subject } = this.state.formData;

    this.props.handleSend({ subject, body });

    this.setState({ modalOpen: false });
  }

  handleInputChange = (event, type, value) => {
    this.setState(prevState => ({
      formData: Object.assign({},
        prevState.formData,
        { [type]: value },
      ),
    }));
  }

  render() {
    const { recipients, detailLines, fromEmail } = this.props;
    const { modalOpen, formData, errors } = this.state;
    const { handleInputChange } = this;

    const modalActions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        onTouchTap={(event) => { event.preventDefault(); this.setState({ modalOpen: false }); }}
      />,
      <RaisedButton
        label="Confirm"
        primary
        onTouchTap={this.confirmSend}
        className={s.primaryButton}
      />,
    ];

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <div className={s.detailLine}>
            Send From: {fromEmail}
          </div>
          <div className={s.detailLine}>
            Recipients: {recipients.map(r => r.email).join(', ')}
          </div>

          <TextField
            className={s.subjectContainer}
            hintText="Subject"
            underlineShow={false}
            value={formData.subject}
            onChange={(event) => { handleInputChange(event, 'subject', event.target.value); }}
            errorText={errors.subjectErrorText}
            multiLine
            rows={1}
            fullWidth={false}
          />
        </div>
        <div className={s.innerContainer}>

          { detailLines.map((detailLine, index) => (
            <div className={s.detailLine} key={JSON.stringify(detailLine)}>
              {detailLine}
            </div>
          ))}

          <TextField
            className={s.contentContainer}
            underlineShow={false}
            hintText="Content (text only)"
            value={formData.body}
            onChange={(event) => { handleInputChange(event, 'body', event.target.value); }}
            errorText={errors.bodyErrorText}
            fullWidth
            multiLine
            rows={4}
          />

          <div className={s.sendButtonContainer}>
            <RaisedButton
              onTouchTap={this.clickedSend}
              primary
              label="Send"
            />
          </div>
        </div>

        <Dialog
          title="Are You Sure?"
          modal
          actions={modalActions}
          actionsContainerClassName={s.modalActionsContainer}
          open={modalOpen}
        >
          <p>
            Are you sure you want to send this email?
          </p>
          <p>
            Please double check that subject, recipients, and content are all correct.
          </p>
          <p>
            Pressing send here is final!
          </p>
        </Dialog>
      </div>
    );
  }
}

export default connect()(ComposeMessage);
