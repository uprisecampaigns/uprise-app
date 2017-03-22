import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';

import history from 'lib/history';
import states from 'lib/states-list';
import { 
  validateString,
  validateWebsiteUrl,
  validateState,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import { MeQuery } from 'schemas/queries';
import { CreateCampaignMutation } from 'schemas/mutations';

import CreateCampaignForm from './components/CreateCampaignForm';


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
        phoneNumber: '',
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
    phoneNumberErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
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
        this.state.refs.stateInput.setState({ searchText: this.state.formData.state });
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

    validateString(this, 'title', 'titleErrorText', 'Campaign Name is Required');
    validateWebsiteUrl(this);
    validatePhoneNumber(this);
    validateState(this);

    if (!this.hasErrors) {

      const { formData } = this.state;

      try {
        const addCampaign = (prev, { mutationResult }) => {
          const newCampaign = mutationResult.data.createCampaign;
          return Object.assign({}, prev, {
            campaigns: prev.campaigns.concat(newCampaign)
          })
        };

        const results = await this.props.createCampaignMutation({ 
          variables: {
            data: formData
          },
          // TODO: decide between refetch and update
          refetchQueries: ['CampaignsQuery', 'MyCampaignsQuery'],
          // updateQueries: {
          //   CampaignsQuery: addCampaign,
          //   MyCampaignsQuery: addCampaign
          // }
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
