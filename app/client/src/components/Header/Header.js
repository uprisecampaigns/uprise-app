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
import { clickedSignUp } from '../../actions/AuthActions';

import s from './Header.scss';

function SignupButton(props) {
  if (props.show) {
    return <FlatButton label="Signup" onClick={props.onClick}/>;
  } else {
    return <FlatButton label="Clicked" onClick={props.onClick}/>;
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
            <Link useAhref={false} to='/login'>
              <FlatButton label="Login" />
            </Link>
            <SignupButton show={!this.props.showSignup} onClick={this.clickedSignup} />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showSignup: state.userAuthSession.displaySignup
  };
}


export default connect(mapStateToProps)(Header);
