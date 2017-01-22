import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import LoginForm from 'components/LoginForm';


class Login extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <div>
        <LoginForm/>
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
