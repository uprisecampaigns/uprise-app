import React, { PropTypes } from 'react';
import history from 'lib/history';

import s from 'styles/Link.scss';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    useAhref: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();

    if (this.props.external) {
      window.location = this.props.to;
    } else {
      history.push(this.props.to);
    }
  };

  render() {
    const { to, children, external, useAhref, className, ...props } = this.props;
    if (useAhref) {
      return (
        <a 
          href={to} 
          {...props} 
          onTouchTap={this.handleClick} 
          onClick={this.handleClick}
          className={[className].concat([s.link]).join(' ')}
        >
          {children}
        </a>
      );
    } else {
      return (
        <span 
          {...props} 
          onTouchTap={this.handleClick} 
          onClick={this.handleClick}
          className={[className].concat([s.link]).join(' ')}
        >
          {children}
        </span>
      );
    }
  }
}

export default Link;
