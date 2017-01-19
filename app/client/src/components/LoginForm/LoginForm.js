import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Link from '../Link';
import { clickedSignUp } from '../../actions/AuthActions';

import s from './LoginForm.scss';

class LoginForm extends Component {
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
      <div className={s.formContainer}>
        <Paper zDepth={2}>
          <form className={s.form}>
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="User Name"
              />
            </div>
            <Divider />
            <div className={s.textFieldContainer}>
              <TextField
                floatingLabelText="Password"
                type="password"
              />
            </div>
            <Divider />
            <RaisedButton primary={true} label="Go" />
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
    showSignup: state.userAuthSession.displaySignup
  };
}


export default connect(mapStateToProps)(LoginForm);
