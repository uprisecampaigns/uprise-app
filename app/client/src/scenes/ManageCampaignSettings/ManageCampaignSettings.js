import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import CampaignSettingsForm from 'components/CampaignSettingsForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateWebsiteUrl,
  validateState,
  validateZipcode,
  validateZipcodeList,
  validateEmail,
  validatePhoneNumber,
} from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import MeQuery from 'schemas/queries/MeQuery.graphql';

import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import s from 'styles/Organize.scss';


const WrappedCampaignSettingsForm = formWrapper(CampaignSettingsForm);

class ManageCampaignInfoContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    user: PropTypes.object.isRequired,
    editCampaignMutation: PropTypes.func.isRequired,
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        streetAddress: '',
        streetAddress2: '',
        websiteUrl: '',
        phoneNumber: '',
        email: '',
        city: '',
        state: '',
        zipcode: '',
        legalOrg: false,
        orgWebsite: '',
        orgName: '',
        orgStatus: '',
        orgContactName: '',
        orgContactPosition: '',
        orgContactEmail: '',
        orgContactPhone: '',
        tags: [],
        zipcodeList: '',
        locationType: null,
        legislativeDistrictType: null,
        locationDistrictNumber: '',
        locationState: '',
      },
    };

    this.state = Object.assign({}, initialState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map((k) => {
        if (nextProps.campaign[k] !== null) {
          return { [camelCase(k)]: nextProps.campaign[k] };
        }
        return undefined;
      }));

      Object.keys(campaign).forEach((k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, campaign),
      }));
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
    orgNameErrorText: null,
    orgWebsiteErrorText: null,
    orgStatusErrorText: null,
    orgContactPositionErrorText: null,
    orgContactEmailErrorText: null,
    orgContactPhoneErrorText: null,
    zipcodeListErrorText: null,
    locationDistrictNumberErrorText: null,
  }

  formSubmit = async (data) => {
    // A little hackish to avoid an annoying rerender with previous form data
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data),
    });

    const formData = Object.assign({}, data);

    formData.id = this.props.campaign.id;

    try {
      await this.props.editCampaignMutation({
        variables: {
          data: formData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });

      return { success: true, message: 'Changes Saved' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {
    if (this.props.campaign) {
      const { state, formSubmit, defaultErrorText } = this;
      const { campaign, user } = this.props;
      const { formData } = state;

      const validators = [
        component => validateString(component, 'title', 'titleErrorText', 'Campaign Name is Required'),
        component => validateZipcode(component),
        component => validateWebsiteUrl(component),
        component => validatePhoneNumber(component),
        component => validateState(component),
        (component) => {
          if (component.state.formData.legalOrg) {
            validateString(component, 'orgWebsite', 'orgWebsiteErrorText', 'Organization Website is required');
            validateString(component, 'orgName', 'orgNameErrorText', 'Organization Name is required');
            validateString(component, 'orgStatus', 'orgStatusErrorText', 'Organization Status is required');
            validateWebsiteUrl(component, 'orgWebsite', 'orgWebsiteErrorText');
            validatePhoneNumber(component, 'orgContactPhone', 'orgContactPhoneErrorText');
            validateEmail(component, 'orgContactEmail', 'orgContactEmailErrorText');
          }
        },
        (component) => { validateState(component, 'locationState', 'locationStateErrorText'); },
        validateZipcodeList,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              { campaign.title }
            </div>
          </Link>

          <div className={s.pageSubHeader}>Settings</div>

          <WrappedCampaignSettingsForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            submitText="Save Changes"
            user={user}
          />

        </div>
      );
    }
    return null;
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    },
  }),
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        slug: ownProps.campaignSlug,
      },
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
    graphqlLoading: data.loading,
  }),
});

export default compose(
  connect(),
  withMeQuery,
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' }),
)(ManageCampaignInfoContainer);
