import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import LoginForm from 'components/LoginForm';

import checkRedirect from 'lib/checkRedirect';


class Login extends React.Component {
  static propTypes = {
  };

  componentWillMount = () => {
    checkRedirect(this.props);
  }

  componentWillReceiveProps = (nextProps) => {
    checkRedirect(nextProps);
  }

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
