import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Infinite from 'react-infinite';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';


import timeWithZone from 'lib/timeWithZone';
import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';

import s from 'styles/Search.scss';


class SearchActionResults extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    cursor: PropTypes.object,
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired,
    isInfiniteLoading: PropTypes.bool.isRequired,
    handleInfiniteLoad: PropTypes.func.isRequired,
    allItemsLoaded: PropTypes.bool,
  }

  static defaultProps = {
    actions: undefined,
    cursor: undefined,
    allItemsLoaded: false,
  }

  shouldComponentUpdate(nextProps) {
    return ((((!nextProps.graphqlLoading && this.props.graphqlLoading) ||
             (!isEqual(this.props.cursor, nextProps.cursor))) &&
             typeof nextProps.actions === 'object') ||
            !isEqual(this.props.sortBy, nextProps.sortBy));
  }

  elementInfiniteLoad = () => (
    <div className={s.loadingContainer}>
      <CircularProgress
        size={60}
        thickness={5}
      />
    </div>
  )

  render() {
    const {
      sortBy, isInfiniteLoading, allItemsLoaded, handleInfiniteLoad, ...props
    } = this.props;

    const actions = props.actions ? Array.from(props.actions).sort(itemsSort(sortBy)).map((action, actionIndex) => {
      // TODO: better datetime parsing (not relying on native Date) and checking for missing values
      const startTime = moment(action.start_time);
      const endTime = moment(action.end_time);

      const startTimeString = timeWithZone(startTime, action.zipcode, 'h:mma');
      const endTimeString = timeWithZone(endTime, action.zipcode, 'h:mma z');

      return (
        <Link key={JSON.stringify(action)} to={`/opportunity/${action.slug}`}>
          <Card className={s.card}>
            <CardHeader
              title={action.title}
              className={s.resultsHeader}
              avatar={action.campaign.profile_image_url ? <Avatar src={action.campaign.profile_image_url} size={40} /> : undefined}
            >
              <div><Link to={`/campaign/${action.campaign.slug}`} className={s.subheaderContainer}>{action.campaign.title}</Link></div>
              { !action.ongoing && startTime && (
                <div>
                  <div>Date: {timeWithZone(startTime, action.zipcode, 'ddd MMM Do, YYYY')}</div>
                  <div>Time: {`${startTimeString} - ${endTimeString}`}</div>
                </div>
              )}
              { action.ongoing && (
                <div>Ongoing Role</div>
              )}
              { action.virtual && (
                <div>Virtual Action</div>
              )}
              { (action.city && action.state) && <div>Place: {action.city}, {action.state}</div> }
            </CardHeader>
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
              elementHeight={140}
              useWindowAsScrollContainer
              onInfiniteLoad={handleInfiniteLoad}
              isInfiniteLoading={isInfiniteLoading}
              infiniteLoadBeginEdgeOffset={allItemsLoaded ? undefined : 200}
              loadingSpinnerDelegate={this.elementInfiniteLoad()}
            >
              {actions}
            </Infinite>

          )
        }
      </div>
    );
  }
}

export default SearchActionResults;
