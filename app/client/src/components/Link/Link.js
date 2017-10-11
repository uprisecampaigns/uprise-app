import PropTypes from 'prop-types';
import React from 'react';
import history from 'lib/history';

import s from 'styles/Link.scss';

function isTouchTap(event) {
  return (typeof event.nativeEvent === 'object' && event.type === 'touchend');
}

function isLeftClickEvent(event) {
  return isTouchTap(event) || event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    useAhref: PropTypes.bool,
    external: PropTypes.bool,
    sameTab: PropTypes.bool,
    mailTo: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    preventDefault: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    preventDefault: true,
    sameTab: false,
    useAhref: false,
    external: false,
    children: null,
    onClick: undefined,
    mailTo: undefined,
  };

  handleClick = (event, url) => {
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

    if (this.props.external && !this.props.mailTo && !this.props.sameTab) {
      const newWindow = window.open();
      newWindow.opener = null;
      newWindow.location = url;
    } else if (this.props.mailTo || (this.props.external && this.props.sameTab)) {
      window.location = url;
    } else {
      history.push(url);
    }
  };

  render() {
    const {
      to, children, external, mailTo, useAhref, className, ...props
    } = this.props;

    // If link is external and not mailTo no 'http' is included at beginning, add it

    function addHttp(url) {
      let newUrl = url;
      if (url && !/^(f|ht)tps?:\/\//i.test(url)) {
        newUrl = `http://${url}`;
      }
      return newUrl;
    }

    const url = (external && !mailTo) ? addHttp(to) : to;

    if (useAhref) {
      return (
        <a
          href={url}
          {...props}
          onTouchTap={e => this.handleClick(e, url)}
          onClick={e => this.handleClick(e, url)}
          className={[className].concat([s.link]).join(' ')}
        >
          {children}
        </a>
      );
    }
    return (
      <span
        {...props}
        onTouchTap={e => this.handleClick(e, url)}
        onClick={e => this.handleClick(e, url)}
        className={[className].concat([s.link]).join(' ')}
        role="link"
        tabIndex="0"
      >
        {children}
      </span>
    );
  }
}

export default Link;
