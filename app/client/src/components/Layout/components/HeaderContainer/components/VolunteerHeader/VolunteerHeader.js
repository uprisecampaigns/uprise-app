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
          <Link to="https://uprisecampaigns.org" external useAhref={false}>About</Link>
        </div>
        <div>
          <Link to="/" useAhref={false}>Home</Link>
        </div>
        <div>
          <Link to="/browse" useAhref={false}>Browse</Link>
        </div>
        <div>
          <Link to="/browse/campaigns" useAhref={false}>Follow</Link>
        </div>
      </div>
    </div>
  );
}

export default VolunteerHeader;
