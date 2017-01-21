import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import SignupFormContainer from 'containers/SignupFormContainer';

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
        <SignupFormContainer />
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
