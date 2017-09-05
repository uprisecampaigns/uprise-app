import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';
import isEqual from 'lodash.isequal';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';

import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchCampaignResults extends Component {
  static propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.object),
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    campaigns: undefined,
  }

  shouldComponentUpdate(nextProps) {
    return ((!nextProps.graphqlLoading &&
             this.props.graphqlLoading &&
             typeof nextProps.campaigns === 'object') ||
            !isEqual(this.props.sortBy, nextProps.sortBy));
  }

  render() {
    const { sortBy, ...props } = this.props;

    const campaigns = props.campaigns ? Array.from(props.campaigns).sort(itemsSort(sortBy)).map((campaign, index) => {
      const hasSubtitle = ((typeof campaign.profile_subheader === 'string' && campaign.profile_subheader.trim() !== '') ||
                           (campaign.city && campaign.state));

      const subtitle = hasSubtitle ? (
        <div>
          {(typeof campaign.profile_subheader === 'string' && campaign.profile_subheader.trim() !== '') && (
            <div className={s.subheaderContainer}>
              {campaign.profile_subheader}
            </div>
          )}
          { (campaign.state || campaign.city) && (
            <div className={s.locationContainer}>
              {campaign.city && (<span>{campaign.city}, </span>)} {campaign.state}
            </div>
          )}
        </div>
      ) :
        null;

      return (
        <Link
          to={`/campaign/${campaign.slug}`}
          key={campaign.id}
        >
          <Card>
            <CardHeader
              title={campaign.title}
              className={s.resultsHeader}
              avatar={campaign.profile_image_url ? <Avatar src={campaign.profile_image_url} size={80} /> : undefined}
              subtitle={subtitle}
            />
          </Card>
        </Link>
      );
    }) : [];

    return (
      <div>
        {
          props.graphqlLoading ? (
            <div className={s.loadingContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          ) : (

            <Infinite
              elementHeight={138}
              useWindowAsScrollContainer
            >
              {campaigns}
            </Infinite>

          )

        }
      </div>
    );
  }
}

export default SearchCampaignResults;
