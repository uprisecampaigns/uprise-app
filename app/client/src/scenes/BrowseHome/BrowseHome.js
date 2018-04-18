import React from 'react';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import s from 'styles/Volunteer.scss';


function BrowseHome(props) {
  return (
    <div className={s.outerContainer}>

      <BrowseHeader />

      <hr />

      <SearchActions />

    </div>
  );
}

export default BrowseHome;
