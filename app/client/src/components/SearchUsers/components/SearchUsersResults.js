import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Infinite from 'react-infinite';
import isEqual from 'lodash.isequal';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';

import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';

import s from 'styles/Search.scss';

class SearchUsersResults extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    sortBy: PropTypes.object.isRequired,
    graphqlLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    users: undefined,
  };

  shouldComponentUpdate(nextProps) {
    return (
      (!nextProps.graphqlLoading && this.props.graphqlLoading && typeof nextProps.users === 'object') ||
      !isEqual(this.props.sortBy, nextProps.sortBy)
    );
  }

  render() {
    const { sortBy, ...props } = this.props;

    const users = props.users
      ? Array.from(props.users)
          .sort(itemsSort(sortBy))
          .map((user, index) => {
            const hasSubtitle =
              (typeof user.subheader === 'string' && user.subheader.trim() !== '') || (user.city && user.state);

            const subtitle = hasSubtitle ? (
              <div>
                {typeof user.subheader === 'string' &&
                  user.subheader.trim() !== '' && <div className={s.subheaderContainer}>{user.subheader}</div>}
                {(user.state || user.city) && (
                  <div className={s.locationContainer}>
                    {user.city && <span>{user.city}, </span>} {user.state}
                  </div>
                )}
              </div>
            ) : null;

            return (
              <Link to={`/user/${user.id}`} key={user.id}>
                <Card className={s.card}>
                  <CardHeader
                    title={`${user.first_name} ${user.last_name}`}
                    className={s.resultsHeader}
                    avatar={user.profile_image_url ? <Avatar src={user.profile_image_url} size={80} /> : undefined}
                    subtitle={subtitle}
                  />
                </Card>
              </Link>
            );
          })
      : [];

    return (
      <div>
        {props.graphqlLoading ? (
          <div className={s.loadingContainer}>
            <CircularProgress size={100} thickness={5} />
          </div>
        ) : (
          <div>
            {(!users || !users.length) && (
              <div>
                <strong>Recruit volunteers</strong> Adjust your search terms or activities to find new volunteers!
              </div>
            )}
            <Infinite elementHeight={138} useWindowAsScrollContainer>
              {users}
            </Infinite>
          </div>
        )}
      </div>
    );
  }
}

export default SearchUsersResults;
