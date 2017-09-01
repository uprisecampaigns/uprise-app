import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import CampaignLocationForm from 'components/CampaignLocationForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';

import {
  validateState,
  validateZipcodeList,
} from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import s from 'styles/Organize.scss';


const WrappedCampaignLocationForm = formWrapper(CampaignLocationForm);

class ManageCampaignLocation extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    editCampaignMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.initialState);
  }

  componentWillMount() {
    this.handleCampaignProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleCampaignProps(nextProps);
  }

  handleCampaignProps = (nextProps) => {
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

      campaign.zipcodeList = typeof campaign.zipcodeList === 'object' ? campaign.zipcodeList.join(',') : '';

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, campaign),
      }));
    }
  }

  initialState = {
    formData: {
      zipcodeList: '',
      locationType: null,
      legislativeDistrictType: null,
      locationDistrictNumber: '',
      locationState: '',
    },
  }

  defaultErrorText = {
    zipcodeListErrorText: null,
    locationDistrictNumberErrorText: null,
    stateErrorText: null,
  }

  formSubmit = async (data) => {
    // A little hackish to avoid an annoying rerender.
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    this.setState({
      formData: Object.assign({}, data),
    });

    const formData = Object.assign({}, data);

    formData.id = this.props.campaign.id;

    formData.zipcodeList = formData.zipcodeList.split(',').map(zip => zip.trim());

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
      const { formSubmit, defaultErrorText } = this;
      const { campaign } = this.props;
      const { formData } = this.state;

      const validators = [
        (component) => { validateState(component, 'locationState'); },
        validateZipcodeList,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}/settings`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
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
          />

        </div>

      );
    }
    return null;
  }
}

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
  withCampaignQuery,
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' }),
)(ManageCampaignLocation);
