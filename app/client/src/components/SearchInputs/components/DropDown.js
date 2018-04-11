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
  }

  static defaultProps = {
    showExpandCaret: true,
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

  render() {
    const { title, showExpandCaret, content } = this.props;
    const { menuOpen, popoverAnchorEl } = this.state;

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
            { content }
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
