import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import history from 'lib/history';

import Link from 'components/Link';

import { MeQuery } from 'schemas/queries';

import s from 'styles/Settings.scss';


class Settings extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.user) {
      const { user, ...props } = this.props;

      return (
        <div className={s.outerContainer}>

          <div className={s.pageHeader}>
            Settings
          </div>

          <List className={s.navList}>

            <Divider/>

            <Link to={'/settings/account'}>
              <ListItem 
                primaryText="Account"
              />
            </Link>

            <Divider/>

            <Link to={'/settings/privacy-security'}>
              <ListItem 
                primaryText="Privacy & Security"
              />
            </Link>

            <Divider/>

            <Link to={'/settings/contact'}>
              <ListItem 
                primaryText="Contact"
              />
            </Link>

            <Divider/>

          </List>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(MeQuery, {
    props: ({ data }) => ({ 
      user: data.me
    })
  }),
)(Settings);
