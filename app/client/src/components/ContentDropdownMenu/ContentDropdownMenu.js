import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';

import Link from 'components/Link';

import s from './ContentDropdownMenu.scss';


class ContentDropdownMenu extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    dropdowns: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func,
      path: PropTypes.string,
      external: PropTypes.bool,
      sameTab: PropTypes.bool,
    })).isRequired,
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
    this.setState(prevState => (Object.assign({}, prevState, {
      menuOpen: false,
    })));
  }

  renderDropdown = (dropdown, index) => {
    const itemClicked = (event) => {
      typeof dropdown.action === 'function' && dropdown.action(event);

      this.setState({
        menuOpen: false,
      });
    };

    return (
      <Link
        to={dropdown.path}
        useAhref={false}
        onClick={itemClicked}
        preventDefault={dropdown.external}
        external={dropdown.external}
        sameTab={dropdown.sameTab}
      >
        <div
          key={index}
          className={s.dropdownItemText}
        >
          {dropdown.title}
        </div>
      </Link>
    );
  }

  render() {
    const { menuOpen, popoverAnchorEl } = this.state;
    const dropdownItems = this.props.dropdowns.map(this.renderDropdown);

    return (
      <div className={[s.container, menuOpen ? s.menuOpen : ''].join(' ')}>
        <Popover
          open={menuOpen}
          anchorEl={popoverAnchorEl}
          onRequestClose={this.handleCloseMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          className={s.dropdownItemsContainer}
        >
          <div className={s.dropdownMenu}>
            {dropdownItems}
          </div>
        </Popover>
        <div
          className={s.dropdownButton}
          onTouchTap={this.handleOpenMenu}
        >
          {this.props.title}
          { menuOpen ? <NavigationExpandLess /> : <NavigationExpandMore /> }
        </div>
      </div>
    );
  }
}

export default ContentDropdownMenu;
