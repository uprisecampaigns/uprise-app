import React, { PureComponent, PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import s from 'styles/Settings.scss';

import Security from './components/Security';
import Privacy from './components/Privacy';


class PrivacySecurity extends PureComponent {
  static propTypes = {
    privacyContent: PropTypes.object.isRequired,
  }

  render() {
    const { privacyContent } = this.props;

    return (
      <div className={s.outerContainer}>

        <Link to={'/settings'}>
          <div className={[s.navHeader, s.settingsNavHeader].join(' ')}>
            <FontIcon
              className={['material-icons', s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Settings
          </div>
        </Link>

        <div className={s.innerContainer}>

          <div className={s.settingsHeader}>Privacy and Security</div>

          <div className={s.sectionHeader}>Change Password</div>

          <Security />

          <div className={s.sectionHeader}>Privacy Policy</div>

          <Privacy content={privacyContent} />
        </div>
      </div>
    );
  }
}

export default PrivacySecurity;
