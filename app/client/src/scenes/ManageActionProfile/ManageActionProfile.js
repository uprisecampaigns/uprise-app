import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux'
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

import ActionProfileForm from 'components/ActionProfileForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';

import { 
  validateString,
} from 'lib/validateComponentForms';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import s from 'styles/Organize.scss';


const WrappedActionProfileForm = formWrapper(ActionProfileForm);

class ManageActionProfile extends Component {

  static PropTypes = {
    campaignId: PropTypes.object.isRequired,
    actionId: PropTypes.object.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        description: '',
      },
    }

    this.state = Object.assign({}, initialState);
  }

  defaultErrorText = { 
    titleErrorText: null,
    descriptionErrorText: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && !nextProps.graphqlLoading) {

      // Just camel-casing property keys and checking for null/undefined
      const action = Object.assign(...Object.keys(nextProps.action).map(k => {
        if (nextProps.action[k] !== null) {
          return { [camelCase(k)]: nextProps.action[k] };
        }
      }));

      Object.keys(action).forEach( (k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState( (prevState) => ({
        formData: Object.assign({}, prevState.formData, action)
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

    formData.id = this.props.action.id;

    try {

      const results = await this.props.editActionMutation({ 
        variables: {
          data: formData
        },
        // TODO: decide between refetch and update
        refetchQueries: ['ActionQuery', 'SearchActionsQuery'],
      });

      return { success: true, message: 'Changes Saved' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  render() {

    if (this.props.campaign && this.props.action) {

      const { campaign, action, ...props } = this.props;
      const { formData, errors, ...state } = this.state;
      const { formSubmit, defaultErrorText } = this;

      const validators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Action Name is Required') },
      ];

      const baseActionUrl = '/organize/' + campaign.slug + '/action/' + action.slug;

      return (
        <div className={s.outerContainer}>
      
          <Link to={baseActionUrl + '/settings'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Profile</div>

          <WrappedActionProfileForm
            initialState={formData}
            initialErrors={defaultErrorText}
            validators={validators}
            submit={formSubmit}
            submitText="Save Changes"
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
          id: ownProps.campaignId
        }
      }
    }),
    props: ({ data }) => ({ 
      campaign: data.campaign,
    })
  }),
  graphql(ActionQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.actionId
        }
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      action: data.action,
      graphqlLoading: data.loading
    })
  }),
  graphql(EditActionMutation, { name: 'editActionMutation' }),
)(ManageActionProfile);
