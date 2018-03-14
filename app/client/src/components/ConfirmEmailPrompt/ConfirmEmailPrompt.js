import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import ResendEmailVerificationMutation from 'schemas/mutations/ResendEmailVerificationMutation.graphql';

import { notify } from 'actions/NotificationsActions';


class ConfirmEmailPrompt extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    resendEmailVerification: PropTypes.func.isRequired,
    handleResend: PropTypes.func.isRequired,
    handleError: PropTypes.func,
    modal: PropTypes.bool,
  }

  static defaultProps = {
    modal: true,
    handleError: () => {},
  }

  resendEmailVerification = async (data) => {
    const {
      dispatch, resendEmailVerification,
      handleResend, handleError,
    } = this.props;

    try {
      const results = await resendEmailVerification();

      if (results) {
        dispatch(notify('Email resent'));
        handleResend();
      } else {
        // eslint-disable-next-line max-len
        dispatch(notify('Error resending email. Please check that your address is valid and can recieve emails. You can change your email address on the accounts settings page.'));
        handleError();
      }
    } catch (e) {
      // eslint-disable-next-line max-len
      dispatch(notify('Error resending email. Please check that your address is valid and can recieve emails. You can change your email address on the accounts settings page.'));
      handleError(e);
    }
  }

  render() {
    const { resendEmailVerification } = this;
    const { modal } = this.props;

    return (
      <Dialog
        title="Confirm Email Address to Proceed"
        modal={modal}
        actions={[
          <RaisedButton
            label="Resend"
            primary
            onClick={(event) => { event.preventDefault(); resendEmailVerification(); }}
          />]}
        open
      >
        <p>
          Please check your inbox for an email verification message.
          Please check your spam folder.
          If you don&apos;t see it, you can have it resent.
        </p>
      </Dialog>
    );
  }
}


export default compose(
  connect(),
  graphql(ResendEmailVerificationMutation, { name: 'resendEmailVerification' }),
)(ConfirmEmailPrompt);
