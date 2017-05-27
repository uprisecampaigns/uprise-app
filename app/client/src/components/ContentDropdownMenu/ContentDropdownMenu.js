import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import history from 'lib/history';

import Link from 'components/Link';

import s from './ContentDropdownMenu.scss';


class ContentDropdownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    dropdowns: PropTypes.array.isRequired,
  }

  renderDropdown = (dropdown, index) => {

    const itemClicked = (event) => {
      typeof dropdown.action === 'function' && dropdown.action(event);

      this.setState({
        menuOpen: false
      });
    }

    return (
      <div key={index}>
        <Link 
          to={dropdown.path}
          useAhref={false}
          onClick={itemClicked}
          preventDefault={false}
        >
          <MenuItem 
            className={s.dropdownItemText}
            value={index}
            primaryText={dropdown.title}
          />
        </Link>
        {(index < this.props.dropdowns.length - 1) && <Divider/>}
      </div>
    );
  }

  handleOpenMenu = (event) => {
    event.preventDefault();

    this.setState({
      menuOpen: true,
      popoverAnchorEl: event.currentTarget
    });
  }

  handleCloseMenu = (reason) => {
    this.setState((prevState) => (Object.assign({}, prevState, {
      menuOpen: false,
    })));
  }

  render() {

    const { menuOpen, popoverAnchorEl, ...state } = this.state;
    const dropdownItems = this.props.dropdowns.map(this.renderDropdown);

    return (
      <div className={[s.container, menuOpen ? s.menuOpen : ''].join(' ')}>
        <Popover
          open={menuOpen}
          anchorEl={popoverAnchorEl}
          onRequestClose={this.handleCloseMenu}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          className={s.dropdownItemsContainer}
        >
          <Menu className={s.dropdownMenu}>
            {dropdownItems}
          </Menu>
        </Popover>
        <div className={s.dropdownButton}>
          <FlatButton 
            label={this.props.title}
            onTouchTap={this.handleOpenMenu}
          />
        </div>
      </div>
    );
  }
}

export default ContentDropdownMenu;
