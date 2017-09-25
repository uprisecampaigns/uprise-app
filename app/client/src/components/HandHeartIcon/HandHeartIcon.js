import React, { PureComponent, PropTypes } from 'react';
import SvgIcon from 'material-ui/SvgIcon';

import s from './HandHeartIcon.scss';


class HandHeartIcon extends PureComponent {
  render() {
    return (
      <SvgIcon 
        {...this.props}
        viewBox="0 0 100 100"
      >
        <path className={s.outline} d="m32.9 64.1v-45.4c0.8-3.3 3.2-5.9 6.3-6.7 3.3-0.8 6 0.7 6.5 1.1 0.2-5 4.7-8.4 8.8-7.8 3.5 0.5 6.3 3.9 6.4 7.9 3.2-1.9 7.1-1.7 9.9 0.5 3.5 2.8 3.2 7.3 3.2 7.6v7c0.2-0.2 3.5-3 7.8-1.9s5.8 5.2 5.9 5.5v45.8c-0.5 2.1-2.1 6.7-6.3 10.8-4.4 4.3-9.2 5.7-11.2 6.2-8.8 0-17.6 0-26.4 0.1-10-10.2-20-20.3-29.9-30.5-3-3.2-2.5-8.1 0.4-10.5 2.5-2 6.4-1.8 9.1 0.6l9.5 9.7z"/>
        <line className={s.fingers} y2="13.5" x2="45.6" y1="45.8" x1="45.6"/>
        <line className={s.fingers} y2="13.2" x2="60.8" y1="45.5" x1="60.8"/>
        <line className={s.fingers} y2="23.7" x2="73.9" y1="45.2" x1="73.9"/>
        <path className={s.heart} d="m59.5 62.2c0.2-3.7 2.9-6.8 6.4-7.4 3.3-0.6 6.4 1.1 8.1 3.6 1.9 3 1.5 7-0.9 9.9l-13.5 13.5-14-14c-2.5-3.2-2.4-7.7 0.2-10.6 2.4-2.7 6.6-3.5 9.8-1.7 3.5 2.1 3.9 6.4 3.9 6.7z"/>
      </SvgIcon>
    );
  }
}

export default HandHeartIcon;
