import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import LoginFormContainer from 'containers/LoginFormContainer';


class Login extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <LoginFormContainer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default connect(mapStateToProps)(Login);
