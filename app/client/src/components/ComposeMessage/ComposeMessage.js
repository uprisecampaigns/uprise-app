import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

import { notify } from 'actions/NotificationsActions';

import s from 'styles/ComposeMessage.scss';


class ComposeMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }
 
  static propTypes = {
    fromEmail: PropTypes.string.isRequired,
    detailLines: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired
  };

  clickedSend = (event) => {
    this.setState({modalOpen: true});
  };

  confirmSend = (event) => {
    console.log('sending email....');
  }

  render() {
    const { recipients, detailLines, fromEmail, ...props } = this.props;
    const { modalOpen, ...state } = this.state;

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
            Recipients: {recipients.map(r => r.email).join(',')}
          </div>

          <TextField 
            className={s.subjectContainer}
            hintText="Subject"
            underlineShow={false}
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
