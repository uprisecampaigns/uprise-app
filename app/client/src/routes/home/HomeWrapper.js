import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Home from 'scenes/Home';
import Page from 'components/Page';


function HomeWrapper(props) {
  const { fetchingUpdate, loggedIn } = props;

  if (!fetchingUpdate && loggedIn) {
    return (
      <Page {...props} />
    );
  }
  return (
    <Home {...props} />
  );
}

HomeWrapper.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  fetchingUpdate: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(HomeWrapper);
