import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import camelCase from 'camelcase';
import FontIcon from 'material-ui/FontIcon';

import ActionProfileForm from 'components/ActionProfileForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';

import {
  validateString,
} from 'lib/validateComponentForms';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';
import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import EditActionMutation from 'schemas/mutations/EditActionMutation.graphql';

import s from 'styles/Organize.scss';


const WrappedActionProfileForm = formWrapper(ActionProfileForm);

class ManageActionProfileEdit extends Component {
  static propTypes = {
    editActionMutation: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    graphqlLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    action: undefined,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        description: '',
        tags: [],
        activities: [],
      },
    };

    this.state = Object.assign({}, initialState);
  }

  componentWillMount() {
    this.handleActionProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleActionProps(nextProps);
  }

  handleActionProps = (nextProps) => {
    if (nextProps.action && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null/undefined
      const action = Object.assign(...Object.keys(nextProps.action).map((k) => {
        if (nextProps.action[k] !== null) {
          return { [camelCase(k)]: nextProps.action[k] };
        }
        return undefined;
      }));

      Object.keys(action).forEach((k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, action),
      }));
    }
  }

  defaultErrorText = {
    titleErrorText: null,
    descriptionErrorText: null,
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

    formData.id = this.props.action.id;

    formData.activities = formData.activities.map(activity => (activity.id));

    try {
      await this.props.editActionMutation({
        variables: {
          data: formData,
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
      const { campaign, action, activities } = this.props;
      const { formData } = this.state;
      const { formSubmit, defaultErrorText } = this;

      const validators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Opportunity Name is Required'); },
      ];

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

      return (
        <div className={s.outerContainer}>

          <Link to={`${baseActionUrl}`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              {action.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Profile</div>

          <WrappedActionProfileForm
            activities={activities}
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

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: ownProps => ({
      variables: {
        search: {
          id: ownProps.campaignId,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
  graphql(ActionQuery, {
    options: ownProps => ({
      variables: {
        search: {
          id: ownProps.actionId,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      action: data.action,
      graphqlLoading: data.loading,
    }),
  }),
  graphql(ActivitiesQuery, {
    props: ({ data }) => ({
      activities: !data.loading && data.activities ? data.activities : [],
    }),
  }),
  graphql(EditActionMutation, { name: 'editActionMutation' }),
)(ManageActionProfileEdit);
