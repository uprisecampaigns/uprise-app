import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import EmailAvailableQuery from 'schemas/queries/EmailAvailableQuery.graphql';

import s from 'styles/Form.scss';

class RegisterLoginForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    setFormType: PropTypes.func.isRequired,
    formType: PropTypes.string.isRequired,
    page: PropTypes.number,
    client: PropTypes.instanceOf(ApolloClient).isRequired,
  };

  static defaultProps = {
    page: 0,
  };

  handleEmailChange = async (event, value) => {
    const { setFormType, handleInputChange, client } = this.props;

    handleInputChange(event, 'email', value);

    const response = await client.query({
      query: EmailAvailableQuery,
      variables: {
        email: value,
      },
      fetchPolicy: 'network-only',
    });

    if (!response.data.emailAvailable) {
      setFormType('login');
      // handleInputChange(event, 'formType', 'login');
    } else {
      setFormType('register');
      // handleInputChange(event, 'formType', 'register');
    }
  };

  render() {
    const { data, formSubmit, errors, page, handleInputChange, formType } = this.props;

    if (formType === 'register') {
      return (
        <form onSubmit={formSubmit} className={s.flexForm}>
          {page === 0 ? (
            <div>
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Email"
                  type="email"
                  value={data.email}
                  onChange={(event) => {
                    this.handleEmailChange(event, event.target.value);
                  }}
                  errorText={errors.emailErrorText}
                  fullWidth
                />
              </div>

              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Create a Password"
                  type="password"
                  value={data.password1}
                  onChange={(event) => {
                    handleInputChange(event, 'password1', event.target.value);
                  }}
                  errorText={errors.password1ErrorText}
                  fullWidth
                />
              </div>
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Confirm your Password"
                  type="password"
                  value={data.password2}
                  onChange={(event) => {
                    handleInputChange(event, 'password2', event.target.value);
                  }}
                  errorText={errors.password2ErrorText}
                  fullWidth
                />
              </div>
            </div>
          ) : (
            <div>
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="First Name"
                  value={data.firstName}
                  onChange={(event) => {
                    handleInputChange(event, 'firstName', event.target.value);
                  }}
                  errorText={errors.firstNameErrorText}
                  fullWidth
                />
              </div>
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Last Name"
                  value={data.lastName}
                  onChange={(event) => {
                    handleInputChange(event, 'lastName', event.target.value);
                  }}
                  errorText={errors.lastNameErrorText}
                  fullWidth
                />
              </div>
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Zipcode"
                  value={data.zipcode}
                  pattern="[0-9]{5}"
                  type="text"
                  onChange={(event) => {
                    handleInputChange(event, 'zipcode', event.target.value);
                  }}
                  errorText={errors.zipcodeErrorText}
                />
              </div>
            </div>
          )}

          <button className={s.darkButton} onClick={formSubmit} onKeyPress={formSubmit} type="submit" tabIndex="0">
            Create Account
          </button>
        </form>
      );
    }
    return (
      <form onSubmit={formSubmit} className={s.flexForm}>
        <div>
          <div className={s.textFieldContainer}>
            <TextField
              floatingLabelText="Email"
              type="email"
              value={data.email}
              onChange={(event) => {
                this.handleEmailChange(event, event.target.value);
              }}
              errorText={errors.emailErrorText}
              fullWidth
            />
          </div>

          <div className={s.textFieldContainer}>
            <TextField
              floatingLabelText="Password"
              type="password"
              value={data.password}
              onChange={(event) => {
                handleInputChange(event, 'password', event.target.value);
              }}
              errorText={errors.passwordErrorText}
              fullWidth
            />
          </div>
        </div>
        <div className={s.darkButton} onClick={formSubmit} onKeyPress={formSubmit} role="button" tabIndex="0">
          Login
        </div>
      </form>
    );
  }
}

export default withApollo(RegisterLoginForm);
