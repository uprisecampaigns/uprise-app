import React, { Component, PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import Security from './components/Security';
import Privacy from './components/Privacy';

import s from 'styles/Settings.scss';


class PrivacySecurity extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);

  }

  render() {

    return (
      <div className={s.outerContainer}>

        <Link to={'/settings'}>
          <div className={s.navHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Settings
          </div>
        </Link>

        <div className={s.innerContainer}>

          <div className={s.settingsHeader}>Privacy and Security</div>

          <div className={s.sectionHeader}>Change Password</div>

          <Security />

          <div className={s.sectionHeader}>Privacy Policy</div>

          <Privacy />
        </div>
      </div>
    );
  }
}

export default PrivacySecurity;
