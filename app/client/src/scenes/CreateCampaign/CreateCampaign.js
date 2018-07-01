import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import history from 'lib/history';
import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateWebsiteUrl,
  validateZipcode,
  validateState,
  validateEmail,
  validatePhoneNumber,
} from 'lib/validateComponentForms';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import CreateCampaignMutation from 'schemas/mutations/CreateCampaignMutation.graphql';

import CreateCampaignForm from 'components/CreateCampaignForm';
import ConfirmEmailPrompt from 'components/ConfirmEmailPrompt';

import s from 'styles/Organize.scss';

const WrappedCreateCampaignForm = formWrapper(CreateCampaignForm);

class CreateCampaignContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    createCampaignMutation: PropTypes.func.isRequired,
  };

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
        slug: '',
      },
    };

    this.state = Object.assign({}, initialState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        formData: Object.assign({}, this.state.formData, {
          email: nextProps.user.email,
        }),
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
  };

  formSubmit = async (data) => {
    try {
      const formData = Object.assign({}, data);

      // eslint-disable-next-line no-unused-vars
      const addCampaign = (prev, { mutationResult }) => {
        const newCampaign = mutationResult.data.createCampaign;
        return Object.assign({}, prev, {
          campaigns: prev.campaigns.concat(newCampaign),
        });
      };

      const results = await this.props.createCampaignMutation({
        variables: {
          data: formData,
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
        newCampaign: results.data.createCampaign,
      });

      return { success: true, message: 'Campaign Added' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  render() {
    const { formSubmit, defaultErrorText } = this;
    const { user } = this.props;
    const { newCampaign, modalOpen, formData } = this.state;

    const modalActions = [
      <div
        className={s.primaryButton}
        onClick={(event) => {
          event.preventDefault();
          history.push(`/organize/${newCampaign.slug}`);
        }}
        onKeyPress={(event) => {
          event.preventDefault();
          history.push(`/organize/${newCampaign.slug}`);
        }}
        role="button"
        tabIndex="0"
      >
        Manage Campaign
      </div>,
    ];

    const validators = [
      (component) => validateString(component, 'title', 'titleErrorText', 'Campaign Name is Required'),
      (component) => validateString(component, 'phoneNumber', 'phoneNumberErrorText', 'Phone Number is Required'),
      (component) => validateZipcode(component),
      (component) => validateWebsiteUrl(component),
      (component) => validatePhoneNumber(component),
      (component) => validateState(component),
      (component) => {
        if (component.state.formData.legalOrg) {
          validateString(component, 'orgWebsite', 'orgWebsiteErrorText', 'Organization Website is required');
          validateString(component, 'orgName', 'orgNameErrorText', 'Organization Name is required');
          validateString(component, 'orgStatus', 'orgStatusErrorText', 'Organization Status is required');
          validateString(component, 'orgContactPhone', 'orgContactPhoneErrorText', 'Phone Number is Required');
          validateWebsiteUrl(component, 'orgWebsite', 'orgWebsiteErrorText');
          validatePhoneNumber(component, 'orgContactPhone', 'orgContactPhoneErrorText');
          validateEmail(component, 'orgContactEmail', 'orgContactEmailErrorText');
        }
      },
    ];

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <div className={s.sectionHeaderContainer}>
            <div className={s.pageHeader}>Create Campaign</div>
          </div>

          {user.email_confirmed ? (
            <div>
              <WrappedCreateCampaignForm
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
                  modal
                  actions={modalActions}
                  open={modalOpen}
                  actionsContainerClassName={s.modalActionsContainer}
                >
                  <p>Congratulations, you have created the campaign &apos;{newCampaign.title}&apos;.</p>
                  <p>
                    You can find your campaign&apos;s public profile at {window.location.origin}/campaign/{
                      newCampaign.slug
                    }
                  </p>
                  <p>You can manage your campaign here:</p>
                </Dialog>
              )}
            </div>
          ) : (
            <ConfirmEmailPrompt handleResend={() => history.push('/organize')} />
          )}
        </div>
      </div>
    );
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user:
      !data.loading && data.me
        ? data.me
        : {
            email: '',
            email_confirmed: true,
          },
    data,
  }),
  options: (ownProps) => ({
    fetchPolicy: 'cache-and-network',
  }),
});

export default compose(connect(), withMeQuery, graphql(CreateCampaignMutation, { name: 'createCampaignMutation' }))(
  CreateCampaignContainer,
);
