import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import FontIcon from 'material-ui/FontIcon';
import getSlug from 'speakingurl';

import CsvUploader from 'components/CsvUploader';
import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import MeQuery from 'schemas/queries/MeQuery.graphql';
import TypesQuery from 'schemas/queries/TypesQuery.graphql';
import LevelsQuery from 'schemas/queries/LevelsQuery.graphql';
import IssueAreasQuery from 'schemas/queries/IssueAreasQuery.graphql';
import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import CreateActionsMutation from 'schemas/mutations/CreateActionsMutation.graphql';

import s from 'styles/Organize.scss';


class ManageCampaignUploadActions extends Component {

  static PropTypes = {
    createActionsMutation: PropTypes.func.isRequired,
    campaignSlug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {

    const processString = (string) => string.trim();
    const processBoolean = (value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to boolean');
      }
      const trimmed = value.trim();
      if (trimmed === '') {
        return false;
      }
      const lowerCased = trimmed.toLowerCase();
      if (lowerCased === 'true' || lowerCased === 'y' || lowerCased === 'yes') {
        return true;
      }
      return false;
    }

    const processDate = (value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to dates');
      }
      const date = moment(value.trim());
      if (!date.isValid()) {
        throw new Error('Date is not valid', date);
      }
      return date.format();
    }

    const processTags = (value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to tags');
      }
      return value.split(',').map(i => i.trim());
    }

    const processRelationships = (collectionName, value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to activities');
      }

      const slugs = value.split(',').map(i => i.trim().toLowerCase());

      try {
        return slugs.map((slug) => this.props[collectionName].find(a => getSlug(a.title) === getSlug(slug)).id);
      } catch (e) {
        throw new Error('Can\'t find matching relationship for ' + collectionName);
      }
    }

    if (this.props.campaign && this.props.issueAreas &&
        this.props.levels && this.props.activities &&
        this.props.types) {

      const { campaign, user, ...props } = this.props;

      const config = {
        headers: [
          {
            title: 'Public Title',
            slug: 'title',
            processData: processString,
          },
          {
            title: 'Internal Title',
            slug: 'internalTitle',
            processData: processString,
          },
          {
            title: 'Description',
            slug: 'description',
            processData: processString,
          },
          {
            title: 'Virtual',
            slug: 'virtual',
            processData: processBoolean,
          },
          {
            title: 'Location Name',
            slug: 'locationName',
            processData: processString,
          },
          {
            title: 'Street Address 1',
            slug: 'streetAddress',
            processData: processString,
          },
          {
            title: 'Street Address 2',
            slug: 'streetAddress2',
            processData: processString,
          },
          {
            title: 'City',
            slug: 'city',
            processData: processString,
          },
          {
            title: 'State',
            slug: 'state',
            processData: processString,
          },
          {
            title: 'Zipcode',
            slug: 'zipcode',
            processData: processString,
          },
          {
            title: 'Location Notes',
            slug: 'locationNotes',
            processData: processString,
          },
          {
            title: 'Ongoing',
            slug: 'ongoing',
            processData: processBoolean,
          },
          {
            title: 'Start Time',
            slug: 'startTime',
            processData: processDate,
          },
          {
            title: 'End Time',
            slug: 'endTime',
            processData: processDate,
          },
          {
            title: 'Keywords',
            slug: 'tags',
            processData: processTags,
          },
          {
            title: 'Activities',
            slug: 'activities',
            processData: (values) => processRelationships('activities', values),
          },
          {
            title: 'Campaign Types',
            slug: 'types',
            processData: (values) => processRelationships('types', values),
          },
          {
            title: 'Campaign Levels',
            slug: 'levels',
            processData: (values) => processRelationships('levels', values),
          },
          {
            title: 'Issue Areas',
            slug: 'issueAreas',
            processData: (values) => processRelationships('issueAreas', values),
          },
        ],
        onSubmit: async (data) => {
          console.log(data);
          const newActions = data.map((action) => {
            return {
              campaignId: campaign.id,
              ...action
            };
          });

          console.log(newActions);
          const results = await this.props.createActionsMutation({
            variables: {
              data: newActions
            },
            refetchQueries: ['SearchActionsQuery', 'CampaignQuery']
          });

          console.log(results);
          return results;
        }
      };

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug + '/settings'}>
            <div className={s.navHeader}>
              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Upload Actions</div>

          <CsvUploader 
            config={config}
          />
          
        </div>
      );
    } else {
      return null;
    }
  }
}

const graphqlOptions = (collection) => {
  return {
    props: ({ data }) => ({
      [collection]: !data.loading && data[collection] ? data[collection] : []
    })
  };
};

const withActivitiesQuery = graphql(ActivitiesQuery, graphqlOptions('activities'));
const withTypesQuery = graphql(TypesQuery, graphqlOptions('types'));
const withLevelsQuery = graphql(LevelsQuery, graphqlOptions('levels'));
const withIssueAreasQuery = graphql(IssueAreasQuery, graphqlOptions('issueAreas'));

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
  withMeQuery,
  withCampaignQuery,
  withActivitiesQuery,
  withTypesQuery,
  withLevelsQuery,
  withIssueAreasQuery,
  graphql(CreateActionsMutation, { name: 'createActionsMutation' })
)(ManageCampaignUploadActions);
