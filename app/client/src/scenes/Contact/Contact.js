import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import camelCase from 'camelcase';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import formWrapper from 'lib/formWrapper';

import { 
  validateString,
} from 'lib/validateComponentForms';

import Link from 'components/Link';
import ContactForm from 'components/ContactForm';

import { MeQuery } from 'schemas/queries';

import { ContactMutation } from 'schemas/mutations';

import s from 'styles/Settings.scss';


const WrappedContactForm = formWrapper(ContactForm);

class Contact extends Component {

  static PropTypes = {
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        subject: '',
        body: '',
      },
    }

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = { 
    subjectErrorText: null,
    bodyErrorText: null,
  }

  formSubmit = async (data) => {
      
    const formData = Object.assign({}, data);

    try {

      const results = await this.props.contactMutation({ 
        variables: {
          data: formData
        },
      });

      setTimeout( () => {
        history.goBack();
      }, 500);

      return { success: true, message: 'Message Sent!' };

    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {

    if (this.props.user) {
      const { state, formSubmit, defaultErrorText } = this;
      const { user, ...props } = this.props;
      const { formData } = state;

      const validators = [
        (component) => validateString(component, 'subject', 'subjectErrorText', 'Please enter a subject'),
        (component) => validateString(component, 'body', 'bodyErrorText', 'Please enter a message'),
      ];


      return (
        <div className={s.outerContainer}>

          <Link to={'/settings'}>
            <div className={[s.navHeader, s.settingsNavHeader].join(' ')}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.settingsHeader}>Contact</div>

          <div className={s.innerContainer}>
            <p>
              Email us at <Link to="mailto:help@uprise.org" useAhref={true} mailTo={true}>help@uprise.org</Link>
            </p>

            <p>
              Uprise Campaigns, SPC <br/>
              1442A Walnut St. #149 <br/>
              Berkeley, CA 94709
            </p>

            <p>
              Or send us a message:
            </p>

            <WrappedContactForm
              initialState={formData}
              initialErrors={defaultErrorText}
              validators={validators}
              submit={formSubmit}
              submitText="Send"
              user={user}
            />

          </div>

        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(MeQuery, {
    options: (ownProps) => ({ 
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      user: data.me,
      graphqlLoading: data.loading
    })
  }),
  graphql(ContactMutation, { name: 'contactMutation' })
)(Contact);
