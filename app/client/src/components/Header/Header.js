import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Link from '../Link';
import { clickedSignUp, attemptLogout } from 'actions/AuthActions';

import s from './Header.scss';

function LoginButton(props) {
  if (!props.loggedIn) {
    return (
      <Link useAhref={false} to='/login'>
        <FlatButton label="Login" />
      </Link>
    )
  } else {
    return (
      <IconMenu
        iconButtonElement={<FlatButton label={props.userObject.email} />}
      >
        <MenuItem value="1" primaryText="Send feedback" />
        <MenuItem value="2" primaryText="Settings" />
        <MenuItem value="3" primaryText="Help" />
        <MenuItem value="4" primaryText="Sign out" onTouchTap={props.logout}/>
      </IconMenu>
    )
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event, index, value) => this.setState({value});

  clickedSignup = (event) => {
    console.log(event);
    this.props.dispatch(clickedSignUp());
  }

  clickedLogout = (event) => {
    this.props.dispatch(attemptLogout());
  }

  render() {
    const { dispatch } = this.props;
    return (
      <AppBar
        title="Uprise Campaigns"
        iconElementRight={
          <div>
            <Link useAhref={false} to='/'>
              <FlatButton label="Home" />
            </Link>
            <Link useAhref={false} to='/about'>
              <FlatButton label="About" />
            </Link>
            <LoginButton 
              loggedIn={this.props.loggedIn}
              logout={this.clickedLogout}
              userObject={this.props.userObject}/>
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
    userObject: state.userAuthSession.userObject
  };
}


export default connect(mapStateToProps)(Header);
