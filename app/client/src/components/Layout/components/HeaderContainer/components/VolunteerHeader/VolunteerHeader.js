import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/Link';

import s from 'styles/Header.scss';

function VolunteerHeader(props) {
  const { loggedIn } = props;
  return (
    <div className={s.subHeader}>
      <div className={s.logoContainer}>
        <Link to="/" useAhref>
          UpRise
        </Link>
      </div>
      <div className={s.linksContainer}>
        {loggedIn && (
          <div>
            <Link to="/volunteer">Home</Link>
          </div>
        )}
        <div>
          <Link to="/search">Opportunities</Link>
        </div>
        <div>
          <Link to="/search/search-campaigns">Campaigns</Link>
        </div>
      </div>
    </div>
  );
}

VolunteerHeader.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default VolunteerHeader;
