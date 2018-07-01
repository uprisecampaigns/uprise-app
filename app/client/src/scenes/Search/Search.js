import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Search.scss';

function Search(props) {
  return (
    <div className={s.outerContainer}>
      <div className={s.innerContainer}>
        <div className={s.sectionHeaderContainer}>
          <div className={s.pageHeader}>Search</div>
        </div>

        <List className={s.navList}>
          <Divider />

          <Link to={'/search'}>
            <ListItem primaryText="Opportunities" />
          </Link>

          <Divider />

          <Link to={'/search/search-campaigns'}>
            <ListItem primaryText="Campaigns" />
          </Link>

          <Divider />
        </List>
      </div>
    </div>
  );
}

export default Search;
