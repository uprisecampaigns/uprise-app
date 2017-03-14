import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
const camelCase = require('camelcase');

import ManageCampaignInfoForm from 'components/ManageCampaignInfoForm';
import Link from 'components/Link';

import history from 'lib/history';

import { 
  MeQuery,
  CampaignQuery 
} from 'schemas/queries';

import { 
  DeleteCampaignMutation
} from 'schemas/mutations';

import s from 'styles/Organize.scss';


class ManageCampaignInfoContainer extends Component {

  static PropTypes = {
    campaign: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        streetAddress: '',
        streetAddress2: '',
        websiteUrl: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        zipcode: '',
      },
      errors: {},
      refs: {},
    }

    this.state = Object.assign({}, initialState, this.defaultErrorText);
  }

  defaultErrorText = { 
    titleErrorText: null,
    streetAddressErrorText: null,
    websiteUrlErrorText: null,
    phoneErrorText: null,
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

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign)
      }));
    }
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
      if (!valid) {
        this.state.refs.stateInput.setState( (prevState) => ({ 
          searchText: prevState.formData.state 
        }));
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

  formSubmit = (event) => {

    console.log('submitted');

  }

  render() {
    const { state, formSubmit, handleInputChange } = this;
    const { campaign, user, ...props } = this.props;
    const { formData, errors, refs } = state;

    return (
      <div className={s.outerContainer}>
        <div className={s.campaignHeader}>{campaign.title}</div>

        <Link to={'/organize/' + campaign.slug + '/settings'}>
          <div className={s.campaignSubHeader}>
            <FontIcon 
              className={["material-icons", s.backArrow].join(' ')}
            >arrow_back</FontIcon>
            Settings
          </div>
        </Link>

        <ManageCampaignInfoForm
          handleInputChange={handleInputChange}
          formSubmit={formSubmit}
          campaign={campaign}
          data={formData}
          errors={errors}
          user={user}
          refs={refs}
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

export default compose(
  withMeQuery,
  graphql(CampaignQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          slug: ownProps.campaign.slug
        }
      }
    })
  }),
  graphql(DeleteCampaignMutation, { name: 'deleteCampaignMutation' })
)(ManageCampaignInfoContainer);
