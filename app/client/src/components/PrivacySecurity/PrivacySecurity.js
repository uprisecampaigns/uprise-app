import React, { PureComponent } from 'react';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import s from 'styles/Settings.scss';

import Security from './components/Security';
import Privacy from './components/Privacy';


class PrivacySecurity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const privacyContent = await import(/* webpackChunkName: "privacy" */ 'content/privacy.md');

    this.setState({ privacyContent });
  }

  render() {
    if (typeof this.state.privacyContent !== 'undefined') {
      const { privacyContent } = this.state;

      return (
        <div className={s.outerContainer}>

          <Link to="/settings">
            <div className={[s.navHeader, s.settingsNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
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
    return null;
  }
}

export default PrivacySecurity;
