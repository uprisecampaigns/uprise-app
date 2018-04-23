import React from 'react';

import Link from 'components/Link';

import s from 'styles/Header.scss';


function UserHeader(props) {
  return (
    <div className={s.volunteerHeader}>
      <div className={s.logoContainer}>
        <span>UpRise</span>
      </div>
      <div className={s.linksContainer}>
        <div>
          <Link to="/user/profile" useAhref={false}>Profile</Link>
        </div>
        <div>
          <Link to="/user/settings" useAhref={false}>Settings</Link>
        </div>
        <div>
          <Link to="/logout" useAhref={false}>Logout</Link>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
