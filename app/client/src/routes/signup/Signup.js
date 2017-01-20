import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import SignupForm from 'components/SignupForm';

import checkRedirect from 'lib/checkRedirect';


class Signup extends React.Component {
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
        <SignupForm/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
  };
}

export default connect(mapStateToProps)(Signup);
