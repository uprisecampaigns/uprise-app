import React from 'react';
import Divider from 'material-ui/Divider';

import AccountSettings from 'components/AccountSettings';
import PrivacySecurity from 'components/PrivacySecurity';

import s from 'styles/Volunteer.scss';


function AccountSettingsScene(props) {
  return (
    <div className={s.outerContainer}>

      <AccountSettings />

      <Divider />

      <PrivacySecurity />

    </div>
  );
}

export default AccountSettingsScene;
