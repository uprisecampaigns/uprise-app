import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import isURL from 'validator/lib/isURL';
import isMobilePhone from 'validator/lib/isMobilePhone';

import history from 'lib/history';
import states from 'lib/states-list';

import { MeQuery } from 'schemas/queries';
import { CreateCampaignMutation } from 'schemas/mutations';

import CreateCampaignForm from 'components/CreateCampaignForm';


class CreateCampaignContainer extends Component {

  static PropTypes = {
    createCampaignMutation: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      // TODO: should refs be in state?
      refs: {},
      title: '',
      streetAddress: '',
      streetAddress2: '',
      website: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
    };

    Object.assign(this.state, this.defaultErrorText);

  }

  hasErrors = false

  resetErrorText = () => {
    this.setState(this.defaultErrorText);
  }

  defaultErrorText = { 
    titleErrorText: null,
    streetAddressErrorText: null,
    websiteErrorText: null,
    phoneErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipErrorText: null,
  }

  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state[prop] !== 'string' || 
        this.state[prop].trim() === '') {

      this.setState({ 
        [errorProp]: errorMsg 
      });

      this.hasErrors = true;

    } else {
      this.setState({ 
        [errorProp]: null 
      });
    }
  }

  validateWebsite = () => {
    if (this.state.website.trim() !== '' && !isURL(this.state.website)) {
      this.hasErrors = true;
      this.setState({
        websiteErrorText: 'Please enter valid website url'
      });
    }
  }

  validatePhone = () => {

    if (this.state.phone.trim() === '') {
      this.hasErrors = true;
      this.setState({
        phoneErrorText: 'Phone number is required'
      });
    } else if (this.state.phone.match(/[^\(\d\s\)\-]/) || 
               !isMobilePhone(this.state.phone.replace(/\D/g,''), 'en-US')) {

      this.hasErrors = true;
      this.setState({
        phoneErrorText: 'Please enter valid phone number'
      });
    }
  }

  handleInputChange = (event, type, value) => {
    let valid = true;

    if (type === 'state') {
      valid = false;

      Object.keys(states).forEach( (state) => {
        if (state.toLowerCase().includes(value.toLowerCase())) {
          valid = true;
        }
      });
      value = value.toUpperCase();
      
      // Hack for AutoComplete
      if (!valid) {
        this.state.refs.stateInput.setState({ searchText: this.state.state });
      }
    } 

    if (valid) {
      this.setState(Object.assign({},
        this.state,
        { [type]: value }
      ));
    } 
  }

  formSubmit = async (event) => {
    event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    this.validateString('title', 'titleErrorText', 'Campaign Name is Required');
    this.validateWebsite();
    this.validatePhone();

    if (!this.hasErrors) {

      try {
        const results = await this.props.createCampaignMutation({ 
          variables: {
            data: {
              title: this.state.title
            }
          }
        });
        console.log(results);
      } catch (e) {
        console.log(e);
      }
    }
  }

  cancel = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {
    return (
      <CreateCampaignForm 
        handleInputChange={this.handleInputChange}
        cancel={this.cancel}
        formSubmit={this.formSubmit}
        data={this.state}
        user={this.props.userObject}
        refs={this.state.refs}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {
      email: '',
      zip: ''
    }
  })
});

export default compose(
  withMeQuery, 
  graphql(CreateCampaignMutation, { name: 'createCampaignMutation' })
)(CreateCampaignContainer);
