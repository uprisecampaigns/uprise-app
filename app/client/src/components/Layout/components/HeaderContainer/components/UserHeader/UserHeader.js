import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/Link';

import { attemptLogout } from 'actions/AuthActions';

import s from 'styles/Header.scss';


function UserHeader(props) {
  return (
    <div className={s.volunteerHeader}>
      <div className={s.logoContainer}>
        <span>UpRise</span>
      </div>
      <div className={s.linksContainer}>
        <div>
          <Link to="/account/view-profile" useAhref={false}>Profile</Link>
        </div>
        <div>
          <Link to="/account/settings" useAhref={false}>Settings</Link>
        </div>
        <div>
          <Link to="" onClick={() => props.dispatch(attemptLogout())} useAhref={false}>Logout</Link>
        </div>
      </div>
    </div>
  );
}

UserHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UserHeader);
