
const path = require('path');
import React, { Component, PropTypes } from 'react';

import Link from 'components/Link';
import s from './ContentNavigation.scss';

class ContentNavigation extends Component {
  static propTypes = {
    selections: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    baseUrl: PropTypes.string.isRequired
  };

  render() {
    const navContainers = this.props.selections.map( (selection, index) => {
      if (index === this.props.selected) {
        return (
          <Link 
            to={path.resolve(this.props.baseUrl, selection)}
            useAhref={false}
            className={[s.selected, s.navItem].join(' ')}
            key={index}
          >{selection}</Link>
        );
      } else {
        return (
          <Link 
            to={path.resolve(this.props.baseUrl, selection)}
            useAhref={false}
            className={[s.notSelected, s.navItem].join(' ')}
            key={index}
          >{selection}</Link>
        );
      }
    });

    return (
      <div>
        <div className={s.navContainer}>
          {navContainers}
        </div>
      </div>
    );
  }
}

export default ContentNavigation;
