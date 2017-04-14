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
    preventDefault: PropTypes.bool
  };

  defaultProps = {
    preventDefault: true
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

    if (this.props.preventDefault) {
      event.preventDefault();
    }

    if (this.props.external) {
      window.location = this.props.to;
    } else {
      history.push(this.props.to);
    }
  };

  render() {
    const { to, children, external, useAhref, preventDefault, className, ...props } = this.props;

    // If link is external and no 'http' is included at beginning, add it

    function addHttp(url) {
      if (url && !/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
      }
      return url;
    }

    const url = addHttp(to);

    if (useAhref) {
      return (
        <a 
          href={url} 
          {...props} 
          onTouchTap={(e) => this.handleClick(e, url)} 
          className={[className].concat([s.link]).join(' ')}
        >
          {children}
        </a>
      );
    } else {
      return (
        <span 
          {...props} 
          onTouchTap={(e) => this.handleClick(e, url)} 
          className={[className].concat([s.link]).join(' ')}
        >
          {children}
        </span>
      );
    }
  }
}

export default Link;
