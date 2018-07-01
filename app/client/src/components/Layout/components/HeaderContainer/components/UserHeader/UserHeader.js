import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/Link';

import { attemptLogout } from 'actions/AuthActions';

import s from 'styles/Header.scss';


function UserHeader(props) {
  const { userObject } = props;
  return (
    <div className={s.subHeader}>
      <div className={s.logoContainer}>
        <Link to="/" useAhref>UpRise</Link>
      </div>
      <div className={s.linksContainer}>
        <div>
          <Link to={`/user/${userObject.id}`} useAhref={false}>Profile</Link>
        </div>
        <div>
          <Link to="/settings/account" useAhref={false}>Settings</Link>
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
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
};

export default connect()(UserHeader);
