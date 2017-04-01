import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import Link from 'components/Link';

import history from 'lib/history';
import organizeFormWrapper from 'lib/organizeFormWrapper';
import { 
  validateString,
  validateWebsiteUrl,
  validateState,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import { MeQuery } from 'schemas/queries';
import { CreateCampaignMutation } from 'schemas/mutations';

import CampaignInfoForm from 'components/CampaignInfoForm';


const WrappedCampaignInfoForm = organizeFormWrapper(CampaignInfoForm);

class CreateCampaignContainer extends Component {

  static PropTypes = {
    createCampaignMutation: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    const initialState = {
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
      modalOpen: false,
      newCampaign: {
        title: '',
        slug: ''
      }
    };

    this.state = Object.assign({}, initialState);

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

  defaultErrorText = { 
    titleErrorText: null,
    streetAddressErrorText: null,
    websiteUrlErrorText: null,
    phoneNumberErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
  }

  formSubmit = async (data) => {

    const formData = Object.assign({}, data);

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

  render() {

    const { formSubmit, defaultErrorText } = this;
    const { user, ...props } = this.props;
    const { newCampaign, modalOpen, formData, ...state } = this.state;

    const modalActions = [
      <RaisedButton
        label="Set Preferences"
        primary={true}
        onTouchTap={ () => { history.push('/organize/' + newCampaign.slug + '/preferences') }}
      />
    ];

    const validators = [
      (component) => validateString(component, 'title', 'titleErrorText', 'Campaign Name is Required'),
      (component) => validateWebsiteUrl(component),
      (component) => validatePhoneNumber(component),
      (component) => validateState(component),
    ];

    return (
      <div>

        <WrappedCampaignInfoForm
          initialState={formData}
          initialErrors={defaultErrorText}
          validators={validators}
          submit={formSubmit}
          submitText="Create"
          user={user}
        />

        {modalOpen && (
          <Dialog
            title="Campaign Created"
            modal={true}
            actions={modalActions}
            open={modalOpen}
          >
            <p>
              Congratulations, you have created the campaign '{newCampaign.title}'.
            </p>
            <p>
              You can find and edit your campaign's public profile at 
              <Link to={'/campaign/' + newCampaign.slug} useAhref={true}>uprise.org/campaign/{newCampaign.slug}</Link>
            </p>
            <p>
              Please feel free to contact us at<Link to="mailto:help@uprise.org" external={true} useAhref={true}>help@uprise.org</Link>for assistance.
            </p>
          </Dialog>
        )}
      </div>
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
