import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Link from '../Link';
import { clickedSignUp, attemptLogout } from 'actions/AuthActions';

import upriseLogo from 'img/uprise-logo.png';
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
        iconElementLeft={
          <Link useAhref={true} to='/'>
            <img 
              src={upriseLogo}
              className={s.upriseLogo}
            />
          </Link>
        }
        iconElementRight={
          <div>
            <Link useAhref={true} to='/'>
              <FontIcon 
                className={[s.headerIcon, 'material-icons'].join(' ')} 
              >home</FontIcon>
            </Link>
            <Link useAhref={true} to='/search'>
              <FontIcon 
                className={[s.headerIcon, 'material-icons'].join(' ')} 
              >search</FontIcon>
            </Link>
            <Link useAhref={true} to='/calendar'>
              <FontIcon 
                className={[s.headerIcon, 'material-icons'].join(' ')} 
              >event</FontIcon>
            </Link>
            <Link useAhref={false} to='/about'>
              <FlatButton label="About" />
            </Link>
            <Link useAhref={false} to='/welcome'>
              <FlatButton label="Welcome" />
            </Link>
            <LoginButton 
              loggedIn={this.props.loggedIn}
              logout={this.clickedLogout}
              userObject={this.props.userObject}/>
          </div>
        }
        style={{
          'backgroundColor': 'rgb(255, 255, 255)'
        }}
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
