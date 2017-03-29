import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';
import isNumeric from 'validator/lib/isNumeric';

import CampaignLocationForm from 'components/CampaignLocationForm';
import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import { 
  validateString,
  validateState,
  validateZipcodeList,
} from 'lib/validateComponentForms';

import { 
  CampaignQuery ,
} from 'schemas/queries';

import { 
  EditCampaignMutation
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


const statesList = Object.keys(states);

class ManageCampaignLocation extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        zipcodeList: '',
        locationType: null,
        locationState: '',
        locationDistrictNumber: ''
      },
      errors: {},
      refs: {},
      saving: false
    }

    this.state = Object.assign({}, initialState, this.defaultErrorText);
  }

  defaultErrorText = { 
    zipcodeListErrorText: null,
    locationDistrictNumberErrorText: null,
    stateErrorText: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign) {

      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(...Object.keys(nextProps.campaign).map(k => ({
          [camelCase(k)]: nextProps.campaign[k] === null ? undefined : nextProps.campaign[k] || ''
      })));

      Object.keys(campaign).forEach( (k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      campaign.zipcodeList = campaign.zipcodeList.join(',');

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign)
      }));
    }
  }

  handleInputChange = (event, type, value) => {
    let valid = true;

    if (type === 'locationState') {
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
        this.state.refs.stateInput.setState({ searchText: this.state.formData.locationState });
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

  resetErrorText = () => {
    this.setState({ errors: this.defaultErrorText });
  }

  formSubmit = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    validateState(this, 'locationState');
    validateZipcodeList(this);


    if (!this.hasErrors) {

      const formData = Object.assign({}, this.state.formData);

      formData.id = this.props.campaign.id;

      formData.zipcodeList = formData.zipcodeList.split(',').map(zip => zip.trim());

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

  cancel = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {
    const { formSubmit, handleInputChange, cancel } = this;
    const { user, ...props } = this.props;
    const { formData, refs, errors, saving } = this.state;

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

        <div className={s.pageSubHeader}>Location</div>

        <p>Define the geographic area in which you will be operating, so volunteers can find you.</p>

        <CampaignLocationForm
          data={formData}
          errors={errors}
          refs={refs}
          formSubmit={formSubmit}
          cancel={cancel}
          handleInputChange={handleInputChange}
          submitText="Save Changes"
          saving={saving}
        />
      </div>
    );
  }
}

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
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignLocation);
