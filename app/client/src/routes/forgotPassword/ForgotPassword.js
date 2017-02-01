import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import ResetPasswordFormContainer from 'containers/ResetPasswordFormContainer';


class ForgotPassword extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <ResetPasswordFormContainer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default connect(mapStateToProps)(ForgotPassword);
