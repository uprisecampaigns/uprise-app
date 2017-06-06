import React, { PropTypes } from 'react';

import s from './Welcome.scss';


class Welcome extends React.PureComponent {

  render() {
    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <h1>Welcome to UpRise</h1>
          <h2>UpRise is a community based on fundamental progressive values.</h2>

          <p><h3><span>We believe in government.</span> We stand up for the idea and the institutions of government as we work to improve them, and we oppose efforts to weaken or destroy them.</h3></p>

          <p>Government is the tool that we as a society use to take care of each other through cooperative action. Through government, we serve the common good, invest in our future and protect everyone's rights. Government can only work when everyone involved respects the institutions and agrees to abide by the rules.</p>

          <p><h3><span>We believe in democracy.</span> We support the expansion of voting rights and oppose laws and practices designed to reduce participation or dilute the impact of people's votes.</h3></p>

          <p>In a democratic civil society, we choose to have rules that limit our own behavior so that we may have fairness and justice, fight cruelty and discrimination and protect each other. Our most fundamental freedom is the right to participate in the making of these rules: democracy, self-governance, the right to vote. Without the vote, we are not free.</p>

          <p><h3><span>We believe in one person, one vote.</span> We support efforts to reduce the influence of money in politics and make our political process more about people than money.</h3></p>

          <p>Every vote should carry the same amount of influence. The ability to run for office should not depend on your personal wealth or access to the wealth of others. We need campaign finance reform. We need campaigns based more on volunteer participation and less on paid advertising.</p>

          <p><h3><span>We believe in truth.</span> We support honest public dialogue and policy based in reality, and oppose efforts to dismiss science and deny verifiable facts.</h3></p>

          <p>Our society cannot function without a common respect for truth. We are facing unprecedented efforts in politics and in media to question verifiable reality for political and private gain.</p>

          <p><h3><span>We believe in basic human decency.</span> We campaign in a civil and respectful manner and provide a positive example to others.</h3></p>

          <p>Empathy is the foundational value which underlies all progressive values. We must practice empathy in our politics as well as our policy. Treating our opponents, voters and fellow activists with civility is the right thing to do, both morally and strategically.</p>

          <p><h3><span>We believe in equality.</span> We oppose discrimination of all kinds, both institutional and individual.</h3></p>

          <p>All human beings have inherent worth. We are infinitely diverse, yet all worth the same. We should not pre-judge, discriminate against or dehumanize anyone, for any reason, including but not limited to race, gender, sexual orientation, religion, citizenship status, ability, health, education, class or culture.</p>
        </div>
      </div>
    );
  }
}

export default Welcome;
