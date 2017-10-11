import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import didYouMean from 'didyoumean';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import getSlug from 'speakingurl';

import CsvUploader from 'components/CsvUploader';
import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import CreateActionsMutation from 'schemas/mutations/CreateActionsMutation.graphql';

import s from 'styles/Organize.scss';


didYouMean.returnWinningObject = true;

class ManageCampaignUploadActions extends Component {
  static propTypes = {
    createActionsMutation: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    activities: PropTypes.arrayOf(PropTypes.object),
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    activities: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      timezone: 'America/Los_Angeles',
    };
  }

  handleTimezoneChange = (event, value) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ timezone: value });
  }

  render() {
    const processString = string => string.trim();
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
    };

    const processDate = (value) => {
      const { timezone } = this.state;
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to dates');
      }
      const date = moment.tz(value.trim(), timezone);
      if (!date.isValid()) {
        throw new Error(`Date is not valid: ${value}`);
      }
      return date.format();
    };

    const processTags = (value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to tags');
      }
      return value.split(',').map(i => i.trim());
    };

    const processRelationships = (collectionName, value) => {
      if (typeof value !== 'string') {
        throw new Error('Can only process strings to activities');
      }

      const slugs = value.split(',')
        .map(i => i.trim().toLowerCase())
        .filter(i => i !== '');

      try {
        return slugs.map((slug) => {
          const found = this.props[collectionName].find(a => getSlug(a.title) === getSlug(slug));
          const result = found || didYouMean(slug, this.props[collectionName], 'title');

          return result.id;
        });
      } catch (e) {
        throw new Error(`Can't find matching relationship '${value}' for '${collectionName}': ${e.message}`);
      }
    };

    if (this.props.campaign && this.props.activities) {
      const { campaign } = this.props;

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
            processData: values => processRelationships('activities', values),
          },
        ],
        onSubmit: async (data) => {
          const newActions = data.map(action => ({
            campaignId: campaign.id,
            ...action,
          }));

          const results = await this.props.createActionsMutation({
            variables: {
              data: newActions,
            },
            refetchQueries: ['SearchActionsQuery', 'CampaignQuery'],
          });

          return results;
        },
      };

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}/settings`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              Settings
            </div>
          </Link>

          <div className={s.pageSubHeader}>Upload Opportunities</div>

          <div className={s.timeZoneSelect}>
            <SelectField
              floatingLabelText="Timezone"
              value={this.state.timezone}
              onChange={(event, i, value) => this.handleTimezoneChange(event, value)}
            >
              {moment.tz.names().map((name, index) => (
                <MenuItem key={name} value={name} primaryText={name} />
              ))}
            </SelectField>
          </div>

          <CsvUploader
            config={config}
          />

        </div>
      );
    }
    return null;
  }
}

const graphqlOptions = collection => ({
  props: ({ data }) => ({
    [collection]: !data.loading && data[collection] ? data[collection] : [],
  }),
});

const withActivitiesQuery = graphql(ActivitiesQuery, graphqlOptions('activities'));

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
  withActivitiesQuery,
  graphql(CreateActionsMutation, { name: 'createActionsMutation' }),
)(ManageCampaignUploadActions);
