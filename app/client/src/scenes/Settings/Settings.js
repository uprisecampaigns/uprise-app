import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import s from 'styles/Settings.scss';


function Settings(props) {
  return (
    <div className={s.outerContainer}>

      <div className={s.pageHeader}>
        Settings
      </div>

      <List className={s.navList}>

        <Divider />

        <Link to="/settings/account">
          <ListItem
            primaryText="Account"
          />
        </Link>

        <Divider />

        <Link to="/settings/privacy-security">
          <ListItem
            primaryText="Privacy & Security"
          />
        </Link>

        <Divider />

        <Link to="/settings/contact">
          <ListItem
            primaryText="Contact"
          />
        </Link>

        <Divider />

      </List>
    </div>
  );
}

export default Settings;
