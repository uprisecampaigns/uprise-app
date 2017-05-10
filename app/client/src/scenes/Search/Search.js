import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Search.scss';


class Search extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={s.outerContainer}>

        <div className={s.pageHeader}>
          Search
        </div>

        <List className={s.navList}>

          <Divider/>

          <Link to={'/search/search-actions'}>
            <ListItem 
              primaryText="Actions"
            />
          </Link>

          <Divider/>

          <Link to={'/search/search-campaigns'}>
            <ListItem 
              primaryText="Campaigns"
            />
          </Link>

          <Divider/>

        </List>
      </div>
    );
  }
}

export default Search;
