import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Link from '../Link';
import { attemptLogin } from '../../actions/AuthActions';

import s from './LoginForm.scss';

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: '',
    password: '',
  }
 
  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  formSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    console.log(this.state);

    this.props.dispatch(attemptLogin({
      email: this.state.email,
      password: this.state.password,
    }));
  }


  render() {
    const { dispatch } = this.props;
    return (
      <div className={s.formContainer}>
        <Paper zDepth={2}>
          { this.props.loginError }
          <form 
            className={s.form}
            onSubmit={this.formSubmit}
          >
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Email"
                value={this.state.email}
                onChange={ (event) => { this.handleInputChange(event, 'email', event.target.value) } }
              />
            </div>
            <Divider />
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Password"
                value={this.state.password}
                onChange={ (event) => { this.handleInputChange(event, 'password', event.target.value) } }
                type="password"
              />
            </div>
            <Divider />
            <RaisedButton 
              onTouchTap={this.formSubmit} 
              type="submit"
              primary={true} 
              label="Login" 
            />
          </form>
        </Paper>

        <Link useAhref={false} to='/signup'>
          <RaisedButton secondary={true} label="Signup" />
        </Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginError: state.userAuthSession.error
  };
}


export default connect(mapStateToProps)(LoginForm);
