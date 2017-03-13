import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import isURL from 'validator/lib/isURL';
import isMobilePhone from 'validator/lib/isMobilePhone';

import history from 'lib/history';
import states from 'lib/states-list';

import { MeQuery } from 'schemas/queries';
import { CreateCampaignMutation } from 'schemas/mutations';

import CreateCampaignForm from 'components/CreateCampaignForm';


const statesList = Object.keys(states);

class CreateCampaignContainer extends Component {

  static PropTypes = {
    createCampaignMutation: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    const initialState = {
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
      },
      errors: {},
      modalOpen: false,
      newCampaign: {
        title: '',
        slug: ''
      }
    };

    this.state = Object.assign({}, initialState, this.defaultErrorText);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        formData: Object.assign({}, this.state.formData, {
          email: nextProps.user.email
        })
      });
    }
  }

  hasErrors = false

  resetErrorText = () => {
    this.setState({ errors: this.defaultErrorText });
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

      this.setState( (prevState) => ({ 
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: errorMsg 
        })
      }));

      this.hasErrors = true;

    } else {
      this.setState( (prevState) => ({ 
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: null 
        })
      }));
    }
  }

  validateWebsiteUrl = () => {
    if (this.state.formData.websiteUrl.trim() !== '' && !isURL(this.state.formData.websiteUrl)) {
      this.hasErrors = true;
      this.setState( (prevState) => ({
        errors: Object.assign({}, prevState.errors, {
          websiteUrlErrorText: 'Please enter valid website url'
        })
      }));
    }
  }

  validateState = () => {
    if (this.state.formData.state.trim() !== '' && !statesList.includes(this.state.formData.state)) {
      this.hasErrors = true;
      this.setState( (prevState) => ({
        errors: Object.assign({}, prevState.errors, {
          stateErrorText: 'Please enter valid state'
        })
      }));
    }
  }

  validatePhone = () => {

    if (this.state.formData.phone.trim() === '') {
      this.hasErrors = true;
      this.setState( (prevState) => ({
        errors: Object.assign({}, prevState.errors, {
          phoneErrorText: 'Phone number is required'
        })
      }));
    } else if (this.state.formData.phone.match(/[^\(\d\s\)\-]/) || 
               !isMobilePhone(this.state.formData.phone.replace(/\D/g,''), 'en-US')) {

      this.hasErrors = true;
      this.setState( (prevState) => ({
        errors: Object.assign({}, prevState.errors, {
          phoneErrorText: 'Please enter valid phone number'
        })
      }));
    }
  }

  handleInputChange = (event, type, value) => {
    let valid = true;

    if (type === 'state') {
      valid = false;

      statesList.forEach( (state) => {
        if (state.toLowerCase().includes(value.toLowerCase())) {
          valid = true;
        }
      });
      value = value.toUpperCase();
      
      // Hack for AutoComplete
      if (!valid) {
        this.state.refs.stateInput.setState( (prevState) => ({ 
          searchText: prevState.formData.state 
        }));
      }
    } 

    if (valid) {
      this.setState( (prevState) => ({
        formData: Object.assign({},
          prevState.formData,
          { [type]: value }
        )
      }));
    } 
  }

  formSubmit = async (event) => {
    event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    this.validateString('title', 'titleErrorText', 'Campaign Name is Required');
    this.validateWebsiteUrl();
    this.validatePhone();
    this.validateState();

    if (!this.hasErrors) {

      try {
        const results = await this.props.createCampaignMutation({ 
          variables: {
            data: this.state.formData
          },
          // TODO: decide between refetch and update
          // refetchQueries: ['CampaignsQuery'],
          updateQueries: {
            CampaignsQuery: (prev, { mutationResult }) => {
              const newCampaign = mutationResult.data.createCampaign;
              return Object.assign({}, prev, {
                campaigns: prev.campaigns.concat(newCampaign)
              })
            }
          }
        });
        this.setState({
          modalOpen: true,
          newCampaign: results.data.createCampaign
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  cancel = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {

    const { state, cancel, formSubmit, handleInputChange } = this;
    const { user } = this.props;
    const { newCampaign, modalOpen, formData, errors, refs } = state;

    return (
      <CreateCampaignForm 
        handleInputChange={handleInputChange}
        cancel={cancel}
        formSubmit={formSubmit}
        data={formData}
        errors={errors}
        user={user}
        refs={refs}
        newCampaign={newCampaign}
        modalOpen={modalOpen}
      />
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    }, 
    data
  })
});

export default compose(
  withMeQuery, 
  graphql(CreateCampaignMutation, { name: 'createCampaignMutation' })
)(CreateCampaignContainer);
