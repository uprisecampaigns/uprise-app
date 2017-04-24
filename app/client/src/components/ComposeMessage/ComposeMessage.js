import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

import { notify } from 'actions/NotificationsActions';

import { 
  validateString,
} from 'lib/validateComponentForms';

import s from 'styles/ComposeMessage.scss';


class ComposeMessage extends React.Component {
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
 
  static propTypes = {
    fromEmail: PropTypes.string.isRequired,
    detailLines: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired,
    sendMessage: PropTypes.func.isRequired
  };

  clickedSend = (event) => {
    this.hasErrors = false;

    validateString(this, 'subject', 'subjectErrorText', 'Subject is Required');
    validateString(this, 'body', 'bodyErrorText', 'Please enter some content');

    if (!this.hasErrors) {
      this.setState({modalOpen: true});
    }
  };

  confirmSend = (event) => {
    const { body, subject } = this.state.formData;

    this.props.sendMessage({ subject, body });

    this.setState({modalOpen: false});
  }

  handleInputChange = (event, type, value) => {
    this.setState( (prevState) => ({
      formData: Object.assign({},
        prevState.formData,
        { [type]: value }
      )
    }));
  }

  render() {
    const { recipients, detailLines, fromEmail, ...props } = this.props;
    const { modalOpen, formData, errors, ...state } = this.state;
    const { handleInputChange } = this;

    const modalActions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        onTouchTap={ () => { this.setState({modalOpen: false}) }}
      />,
      <RaisedButton
        label="Confirm"
        primary={true}
        onTouchTap={this.confirmSend}
      />
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
            onChange={ (event) => { handleInputChange(event, 'subject', event.target.value) } }
            errorText={errors.subjectErrorText}
            multiLine={true}
            rows={1}
            fullWidth={false}
          />
        </div>
        <div className={s.innerContainer}>

          { detailLines.map( (detailLine, index) => (
            <div className={s.detailLine} key={index}>
              {detailLine}
            </div>
          ))}

          <TextField 
            className={s.contentContainer}
            underlineShow={false}
            hintText="Content (text only)"
            value={formData.body}
            onChange={ (event) => { handleInputChange(event, 'body', event.target.value) } }
            errorText={errors.bodyErrorText}
            fullWidth={true}
            multiLine={true}
            rows={4}
          />

          <div className={s.sendButtonContainer}>
            <RaisedButton
              onTouchTap={this.clickedSend}
              primary={true}
              label="Send"
            />
          </div>
        </div>

        <Dialog
          title="Are You Sure?"
          modal={true}
          actions={modalActions}
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
