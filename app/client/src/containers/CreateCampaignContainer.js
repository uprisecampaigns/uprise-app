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
      formData: {
        email: props.user.email,
        title: '',
        streetAddress: '',
        streetAddress2: '',
        websiteUrl: '',
        phone: '',
        city: '',
        state: '',
        zipcode: '',
      }
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
    websiteUrlErrorText: null,
    phoneErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
  }

  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state.formData[prop] !== 'string' || 
        this.state.formData[prop].trim() === '') {

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

  validateWebsiteUrl = () => {
    if (this.state.formData.websiteUrl.trim() !== '' && !isURL(this.state.formData.websiteUrl)) {
      this.hasErrors = true;
      this.setState({
        websiteUrlErrorText: 'Please enter valid website url'
      });
    }
  }

  validatePhone = () => {

    if (this.state.formData.phone.trim() === '') {
      this.hasErrors = true;
      this.setState({
        phoneErrorText: 'Phone number is required'
      });
    } else if (this.state.formData.phone.match(/[^\(\d\s\)\-]/) || 
               !isMobilePhone(this.state.formData.phone.replace(/\D/g,''), 'en-US')) {

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
        this.state.refs.stateInput.setState({ searchText: this.state.formData.state });
      }
    } 

    if (valid) {
      this.setState({
        formData: Object.assign({},
          this.state.formData,
          { [type]: value }
        )
      });
    } 
  }

  formSubmit = async (event) => {
    event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    this.validateString('title', 'titleErrorText', 'Campaign Name is Required');
    this.validateWebsiteUrl();
    this.validatePhone();

    if (!this.hasErrors) {

      try {
        const results = await this.props.createCampaignMutation({ 
          variables: {
            data: this.state.formData
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
        data={this.state.formData}
        user={this.props.user}
        refs={this.state.refs}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    }
  })
});

export default compose(
  withMeQuery, 
  graphql(CreateCampaignMutation, { name: 'createCampaignMutation' })
)(CreateCampaignContainer);
