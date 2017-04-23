import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';
import isNumeric from 'validator/lib/isNumeric';

import CampaignLocationForm from 'components/CampaignLocationForm';
import Link from 'components/Link';

import organizeFormWrapper from 'lib/organizeFormWrapper';

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


const WrappedCampaignLocationForm = organizeFormWrapper(CampaignLocationForm);

class ManageCampaignLocation extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.initialState);
  }

  initialState = {
    formData: {
      zipcodeList: '',
      locationType: null,
      legislativeDistrictType: null,
      locationDistrictNumber: '',
      locationState: '',
    },
    saving: false
  }

  defaultErrorText = { 
    zipcodeListErrorText: null,
    locationDistrictNumberErrorText: null,
    stateErrorText: null
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

      campaign.zipcodeList = campaign.zipcodeList.join(',');

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign)
      }));
    }
  }

  formSubmit = async (data) => {

    // A little hackish to avoid an annoying rerender.
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data)
    });

    const formData = Object.assign({}, data);

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

  render() {
    if (this.props.campaign) {

      const { formSubmit, cancel, defaultErrorText } = this;
      const { campaign, ...props } = this.props;
      const { formData, saving } = this.state;

      const validators = [
        (component) => { validateState(component, 'locationState') },
        validateZipcodeList
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Location</div>

          <WrappedCampaignLocationForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            submitText="Save Changes"
            saving={saving}
          />

        </div>

      );
    } else {
      return null
    }
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        slug: ownProps.campaignSlug
      }
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign,
    graphqlLoading: data.loading
  })
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignLocation);
