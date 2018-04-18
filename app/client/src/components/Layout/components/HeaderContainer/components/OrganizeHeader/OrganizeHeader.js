import React from 'react';

import Link from 'components/Link';

import s from 'styles/Header.scss';


function OrganizeHeader(props) {
  return (
    <div className={s.volunteerHeader}>
      <div className={s.logoContainer}>
        <span>UpRise</span>
      </div>
      <div className={s.linksContainer}>
        <div>
          <Link to="/organize" useAhref={false}>Home</Link>
        </div>
        <div>
          <Link to="/organize/my-campaigns" useAhref={false}>My Campaigns</Link>
        </div>
        <div>
          <Link to="/organize/create-campaign" useAhref={false}>New Campaign</Link>
        </div>
      </div>
    </div>
  );
}

export default OrganizeHeader;
