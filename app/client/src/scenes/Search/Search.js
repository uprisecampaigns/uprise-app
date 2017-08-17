import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Search.scss';


function Search(props) {
  return (
    <div className={s.outerContainer}>

      <div className={s.pageHeader}>
        Search
      </div>

      <List className={s.navList}>

        <Divider />

        <Link to={'/search/search-opportunities'}>
          <ListItem
            primaryText="Opportunities"
          />
        </Link>

        <Divider />

        <Link to={'/search/search-campaigns'}>
          <ListItem
            primaryText="Campaigns"
          />
        </Link>

        <Divider />

      </List>
    </div>
  );
}

export default Search;
