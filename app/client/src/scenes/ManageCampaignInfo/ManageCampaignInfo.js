import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import ManageCampaignInfoForm from './components/ManageCampaignInfoForm';
import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';
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


const statesList = Object.keys(states);

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
      errors: {},
      refs: {},
      saving: false
    }

    this.state = Object.assign({}, initialState, this.defaultErrorText);
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
    if (nextProps.campaign) {

      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => ({
          [camelCase(k)]: nextProps.campaign[k] || ''
      })));

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

  resetErrorText = () => {
    this.setState({ errors: this.defaultErrorText });
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
      // TODO: Refactor - this is shared across several components!
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
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    validateString(this, 'title', 'titleErrorText', 'Campaign Name is Required');
    validateWebsiteUrl(this);
    validatePhoneNumber(this);
    validateState(this);

    if (!this.hasErrors) {

      const formData = Object.assign({}, this.state.formData);

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
  }

  render() {
    const { state, formSubmit, handleInputChange } = this;
    const { user, ...props } = this.props;
    const { formData, errors, refs, saving } = state;

    const campaign = props.campaign || {
      title: '',
      slug: ''
    };

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

        <ManageCampaignInfoForm
          handleInputChange={handleInputChange}
          formSubmit={formSubmit}
          campaign={campaign}
          data={formData}
          errors={errors}
          user={user}
          refs={refs}
          saving={saving}
        />
      </div>
    );
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
    campaign: data.campaign
  })
});

export default compose(
  connect(),
  withMeQuery,
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignInfoContainer);
