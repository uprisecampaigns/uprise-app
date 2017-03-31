import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

import CampaignProfileForm from 'components/CampaignProfileForm';
import Link from 'components/Link';

import history from 'lib/history';

import { 
  validateString,
  validateWebsiteUrl,
} from 'lib/validateComponentForms';

import { CampaignQuery } from 'schemas/queries';

import { 
  EditCampaignMutation,
} from 'schemas/mutations';

import { 
  notify
} from 'actions/NotificationsActions';

import s from 'styles/Organize.scss';


class ManageCampaignProfileContainer extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        websiteUrl: '',
        description: ''
      },
      errors: {},
      refs: {},
      saving: false
    }

    this.state = Object.assign({}, initialState, this.defaultErrorText);
  }

  defaultErrorText = { 
    titleErrorText: null,
    websiteUrlErrorText: null,
    descriptionErrorText: null,
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

    this.setState( (prevState) => ({
      formData: Object.assign({},
        prevState.formData,
        { [type]: value }
      )
    }));
  }

  formSubmit = async (event) => {
    (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    validateString(this, 'title', 'titleErrorText', 'Campaign Name is Required');
    validateWebsiteUrl(this);

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

    if (this.props.campaign) {

      const { campaign, ...props } = this.props;
      const { formData, errors, saving, ...state } = this.state;
      const { handleInputChange, formSubmit } = this;

      return (
        <div className={s.outerContainer}>
          <Link to={'/organize/' + campaign.slug}>
            <div className={s.campaignHeader}>{campaign.title}</div>
          </Link>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <div className={s.navSubHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Profile</div>

          <CampaignProfileForm
            data={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            formSubmit={formSubmit}
            saving={saving}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
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
  }),
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' })
)(ManageCampaignProfileContainer);
