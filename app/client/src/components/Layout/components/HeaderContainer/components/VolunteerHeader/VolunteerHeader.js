import React from 'react';

import Link from 'components/Link';

import s from 'styles/Header.scss';


function VolunteerHeader(props) {
  return (
    <div className={s.volunteerHeader}>
      <div className={s.logoContainer}>
        <span>UpRise</span>
      </div>
      <div className={s.linksContainer}>
        <div>
          <Link to="/" useAhref={false}>Home</Link>
        </div>
        <div>
          <Link to="/volunteer" useAhref={false}>Profile</Link>
        </div>
        <div>
          <Link to="/volunteer/opportunity-commitments" useAhref={false}>My Signups</Link>
        </div>
      </div>
    </div>
  );
}

export default VolunteerHeader;
