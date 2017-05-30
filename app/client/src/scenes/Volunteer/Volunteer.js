import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Volunteer.scss';


class Volunteer extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={s.outerContainer}>

        <div className={s.pageHeader}>
          Volunteer
        </div>

        <List className={s.navList}>

          <Divider/>

          <Link to={'/volunteer/action-commitments'}>
            <ListItem 
              primaryText="Action Commitments"
            />
          </Link>

          <Divider/>

          <Link to={'/volunteer/campaign-subscriptions'}>
            <ListItem 
              primaryText="Campaign Subscriptions"
            />
          </Link>

          <Divider/>

        </List>
      </div>
    );
  }
}

export default Volunteer;
