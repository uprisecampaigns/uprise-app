import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';

import s from 'styles/Search.scss';


class DropDown extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    showExpandCaret: PropTypes.bool,
    content: PropTypes.node.isRequired,
    closeEvent: PropTypes.func,
  }

  static defaultProps = {
    showExpandCaret: true,
    closeEvent: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  handleOpenMenu = (event) => {
    event.preventDefault();

    this.setState({
      menuOpen: true,
      popoverAnchorEl: event.currentTarget,
    });
  }

  handleCloseMenu = () => {
    this.setState(prevState => ({
      ...prevState,
      menuOpen: false,
    }));
  }

  render() {
    const {
      title, showExpandCaret,
      content, closeEvent,
    } = this.props;

    const { menuOpen, popoverAnchorEl } = this.state;

    const overRideContentHandler = props => (
      React.Children.map(content, (child) => {
        const handleCloseEvent = (...args) => {
          this.handleCloseMenu();
          child.props[closeEvent](...args);
        };

        if (typeof child.props[closeEvent] === 'function') {
          return React.cloneElement(child, {
            [closeEvent]: handleCloseEvent,
          });
        }
        return child;
      })
    );

    return (
      <div className={[s.dropdownContainer, menuOpen ? s.dropdownMenuOpen : ''].join(' ')}>
        <Popover
          open={menuOpen}
          anchorEl={popoverAnchorEl}
          onRequestClose={this.handleCloseMenu}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          canAutoPosition={false}
          className={s.dropdownItemsContainer}
        >
          <div className={s.dropdownMenu}>
            { closeEvent ? overRideContentHandler(content) : content }
          </div>
        </Popover>
        <div
          className={s.dropdownButton}
          onClick={this.handleOpenMenu}
          onKeyPress={this.handleOpenMenu}
          role="link"
          tabIndex="0"
        >
          {title}
          { showExpandCaret && (menuOpen ? <NavigationExpandLess /> : <NavigationExpandMore />) }
        </div>
        { menuOpen &&
          <div className={s.dropdownOverlay} />
        }
      </div>
    );
  }
}

export default DropDown;
