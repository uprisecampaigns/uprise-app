import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Volunteer.scss';


function Volunteer(props) {
  return (
    <div className={s.outerContainer}>

      <div className={s.pageHeader}>
        Volunteer
      </div>

      <List className={s.navList}>

        <Divider />

        <Link to={'/volunteer/action-commitments'}>
          <ListItem
            primaryText="My Actions"
          />
        </Link>

        <Divider />

        <Link to={'/volunteer/campaign-subscriptions'}>
          <ListItem
            primaryText="My Subscriptions"
          />
        </Link>

        <Divider />

      </List>
    </div>
  );
}

export default Volunteer;
