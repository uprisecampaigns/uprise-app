import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

import CampaignProfileForm from 'components/CampaignProfileForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';

import { validateString, validateWebsiteUrl } from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import s from 'styles/Organize.scss';

const WrappedCampaignProfileForm = formWrapper(CampaignProfileForm);

class ManageCampaignProfileEdit extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    editCampaignMutation: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
  };

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        websiteUrl: '',
        profileSubheader: '',
        description: '',
        profileImageUrl: '',
      },
    };

    this.state = Object.assign({}, initialState);
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
      const campaign = Object.assign(
        ...Object.keys(nextProps.campaign).map((k) => {
          if (nextProps.campaign[k] !== null) {
            return { [camelCase(k)]: nextProps.campaign[k] };
          }
          return undefined;
        }),
      );

      Object.keys(campaign).forEach((k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      this.setState((prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign),
      }));
    }
  };

  defaultErrorText = {
    titleErrorText: null,
    websiteUrlErrorText: null,
    descriptionErrorText: null,
  };

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
  };

  render() {
    if (this.props.campaign) {
      const { campaign } = this.props;
      const { formData } = this.state;
      const { formSubmit, defaultErrorText } = this;

      const validators = [
        (component) => {
          validateString(component, 'title', 'titleErrorText', 'Campaign Name is Required');
        },
        (component) => {
          validateWebsiteUrl(component);
        },
      ];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`/organize/${campaign.slug}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Campaign Profile
              </div>
            </div>

            <WrappedCampaignProfileForm
              initialState={formData}
              initialErrors={defaultErrorText}
              validators={validators}
              submit={formSubmit}
              campaignId={campaign.id}
              submitText="Save Changes"
            />
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: (ownProps) => ({
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
  }),
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' }),
)(ManageCampaignProfileEdit);
