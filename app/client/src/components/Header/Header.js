import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Link from '../Link';

import s from './Header.scss';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <AppBar
        title="Uprise Campaigns"
        iconElementRight={
          <div>
            <FlatButton>
              <Link useAhref={false} to='/'>Home</Link>
            </FlatButton>
            <FlatButton>
              <Link useAhref={false} to='/about'>About</Link>
            </FlatButton>
          </div>
        }
      />
    );
  }
}

export default Header;
