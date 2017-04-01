import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import CampaignInfoForm from 'components/CampaignInfoForm';
import Link from 'components/Link';

import organizeFormWrapper from 'lib/organizeFormWrapper';
import { 
  validateString,
  validateWebsiteUrl,
  validateState,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import { 
  MeQuery,
  CampaignQuery 
} from 'schemas/queries';

import { 
  EditCampaignMutation
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


const WrappedCampaignInfoForm = organizeFormWrapper(CampaignInfoForm);

class ManageCampaignInfoContainer extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
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
      },
      saving: false
    }

    this.state = Object.assign({}, initialState);
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign && !nextProps.graphqlLoading) {

      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => {
        if (nextProps.campaign[k] !== null) {
          return { [camelCase(k)]: nextProps.campaign[k] };
        }
      }));

      Object.keys(campaign).forEach( (k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign)
      }));
    }
  }

  formSubmit = async (data) => {
      
    // A little hackish to avoid an annoying rerender with previous form data
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data)
    });

    const formData = Object.assign({}, data);

    formData.id = this.props.campaign.id;

    this.setState({ saving: true });

    try {

      const results = await this.props.editCampaignMutation({ 
        variables: {
          data: formData
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });

      this.props.dispatch(notify('Changes Saved'));
      this.setState({ saving: false });
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    if (this.props.campaign) {
      const { state, formSubmit, defaultErrorText } = this;
      const { campaign, user, ...props } = this.props;
      const { formData, saving } = state;

      const validators = [
        (component) => validateString(component, 'title', 'titleErrorText', 'Campaign Name is Required'),
        (component) => validateWebsiteUrl(component),
        (component) => validatePhoneNumber(component),
        (component) => validateState(component),
      ];

      return (
        <div className={s.outerContainer}>
          <div className={s.campaignHeader}>{campaign.title}</div>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Info</div>

          <WrappedCampaignInfoForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            saving={saving}
            submitText="Save Changes"
            user={user}
          />
          
        </div>
      );
    } else {
      return null;
    }
  }
}

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    user: !data.loading && data.me ? data.me : {
      email: '',
    }, 
  })
});

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        slug: ownProps.campaignSlug
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign,
    graphqlLoading: data.loading
  })
});

export default compose(
  connect(),
  withMeQuery,
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignInfoContainer);
