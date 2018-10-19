import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import Infinite from 'react-infinite';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';

import withTimeWithZone from 'lib/withTimeWithZone';
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
    timeWithZone: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    actions: undefined,
    cursor: undefined,
    allItemsLoaded: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      showAll: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (((!nextProps.graphqlLoading && this.props.graphqlLoading) || !isEqual(this.props.cursor, nextProps.cursor)) &&
        typeof nextProps.actions === 'object') ||
      !isEqual(this.props.sortBy, nextProps.sortBy) ||
      (!this.state.showAll && nextState.showAll)
    );
  }

  elementInfiniteLoad = () => (
    <div className={s.loadingContainer}>
      <CircularProgress size={60} thickness={5} />
    </div>
  );

  showAll = (event) => {
    event.preventDefault();
    this.setState({ showAll: true });
  };

  render() {
    const { sortBy, isInfiniteLoading, allItemsLoaded, handleInfiniteLoad, timeWithZone, ...props } = this.props;
    const { showAll } = this.state;

    const actions = props.actions
      ? Array.from(props.actions)
          .sort(itemsSort(sortBy))
          .map((action, actionIndex) => {
            // TODO: better datetime parsing (not relying on native Date) and checking for missing values
            const startTime = moment(action.start_time);
            const endTime = moment(action.end_time);

            let zipcode;
            if (action.zipcode) {
              zipcode = action.zipcode;
            } else if (action.campaign && action.campaign.zipcode) {
              zipcode = action.campaign.zipcode;
            }

            const startTimeString = timeWithZone(startTime, zipcode, 'h:mma');
            const endTimeString = timeWithZone(endTime, zipcode, 'h:mma z');

            try {
              return (
                <Link key={JSON.stringify(action)} to={`/opportunity/${action.slug}`}>
                  <Card className={s.card}>
                    <CardHeader
                      title={action.title}
                      className={s.resultsHeader}
                      avatar={
                        action.campaign.profile_image_url ? (
                          <Avatar src={action.campaign.profile_image_url} size={40} />
                        ) : (
                          undefined
                        )
                      }
                    >
                      <div>
                        <Link to={`/campaign/${action.campaign.slug}`} className={s.subheaderContainer}>
                          {action.campaign.title}
                        </Link>
                      </div>
                      {!action.ongoing &&
                        startTime && (
                          <div>
                            <div>Date: {timeWithZone(startTime, zipcode, 'ddd MMM Do, YYYY')}</div>
                            <div>Time: {`${startTimeString} - ${endTimeString}`}</div>
                          </div>
                        )}
                      {action.ongoing && <div>Ongoing Role</div>}
                      {action.virtual && <div>Virtual Action</div>}
                      {action.city &&
                        action.state && (
                          <div>
                            Place: {action.city}, {action.state}
                          </div>
                        )}
                      {action.distance && this.props.loggedIn && <div>{action.distance} miles away</div>}
                    </CardHeader>
                  </Card>
                </Link>
              );
            } catch (e) {
              console.error(`Error rendering search action result: ${e.message}`);
              return null;
            }
          })
      : [];

    return (
      <div>
        {props.graphqlLoading ? (
          <div className={s.loadingContainer}>
            <CircularProgress size={100} thickness={5} />
          </div>
        ) : showAll ? (
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
        ) : (
          <div>
            {actions.slice(0, 15)}
            {actions.length > 15 && (
              <div className={s.button} onClick={this.showAll} onKeyPress={this.showAll} role="button" tabIndex="0">
                Show More
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default compose(connect(mapStateToProps))(withTimeWithZone(SearchActionResults));
