import React from 'react';

import Link from 'components/Link';

import s from 'styles/Header.scss';


function BrowseHeader(props) {
  return (
    <div className={s.browseHeader}>
      <div className={s.linksContainer}>
        <div>
          <Link to="/browse/events" useAhref={false}>Events</Link>
        </div>
        <div>
          <Link to="/browse/roles" useAhref={false}>Roles</Link>
        </div>
        <div>
          <Link to="/browse/campaigns" useAhref={false}>Campaigns</Link>
        </div>
      </div>
    </div>
  );
}

export default BrowseHeader;
