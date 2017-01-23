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
import TextField from 'material-ui/TextField';
import Link from '../Link';
import { clickedSignUp, attemptLogout } from 'actions/AuthActions';

import upriseLogo from 'img/uprise-logo.png';
import s from './Header.scss';


const iconButtonStyle = {
  fontSize: '3rem'
}

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
        iconButtonElement={
          <IconButton 
            iconStyle={iconButtonStyle}
            iconClassName='material-icons'
            className={s.iconButton}
          >account_box</IconButton>}
        className={s.accountMenuContainer}
      >
        <MenuItem value="1" primaryText="Profile" />
        <MenuItem value="2" primaryText="Preferences" />
        <MenuItem value="3" primaryText="Settings" />
        <MenuItem value="4" primaryText="Help" />
        <MenuItem value="5" primaryText="Log out" onTouchTap={props.logout}/>
      </IconMenu>
    )
  }
}

function AuthenticatedIcons(props) {
  if (props.loggedIn) {
    return (
      <div className={s.authenticatedIconsContainer}>
        <div className={s.searchContainer}>
          <TextField
            hintText="Search by name or keyword"
            value={''}
            errorText={''}
            onChange={ (event) => { console.log(event.target.value) } }
          />
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
          >search</IconButton>
        </div>
        <Link useAhref={false} to='/calendar'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >event</IconButton>
        </Link>
        <Link useAhref={false} to='/friends'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >group</IconButton>
        </Link>
        <Link useAhref={false} to='/about'>
          <IconButton 
            iconClassName='material-icons'
            className={s.iconButton}
            iconStyle={iconButtonStyle}
          >work</IconButton>
        </Link>
      </div>
    )
  } else {
    return null;
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
        iconStyleRight={{
          marginTop: '0px'
        }}
        iconElementRight={
          <div className={s.flexContainer}>
            <AuthenticatedIcons 
              loggedIn={this.props.loggedIn}
            />
            <LoginButton 
              loggedIn={this.props.loggedIn}
              logout={this.clickedLogout}
              userObject={this.props.userObject}/>
          </div>
        }
        iconStyleRight={{
          marginTop: '0px',
          display: 'flex',
          alignItems: 'center'
        }}
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
