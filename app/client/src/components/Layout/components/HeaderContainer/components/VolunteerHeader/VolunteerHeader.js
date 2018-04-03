import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/Link';

import upriseLogo from 'img/uprise-logo.png';
import s from 'styles/Header.scss';


function VolunteerHeader(props) {
  return (
    <div>
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
      <div className={s.volunteerNavHeader}>
        <div className={s.linksContainer}>
          <div>
            <Link to="/search/search-opportunities" useAhref={false}>Events</Link>
          </div>
          <div>
            <Link to="/search/search-opportunities" useAhref={false}>Roles</Link>
          </div>
          <div>
            <Link to="/search/search-campaigns" useAhref={false}>Campaigns</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

VolunteerHeader.propTypes = {
};

VolunteerHeader.defaultProps = {
};

export default VolunteerHeader;
