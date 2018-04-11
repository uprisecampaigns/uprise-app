import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Volunteer.scss';

class BrowseRoles extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  static defaultProps = {
    user: undefined,
  }

  render() {
    const { user } = this.props;

    return (
      <div className={s.outerContainer}>

        <BrowseHeader />

        <div className={s.headerTitle}>
          Sign up for a Role
        </div>
        <div className={s.subHeader}>
          120 Volunteer Roles
        </div>
        <div className={s.subHeader}>
          Learn more &gte;
        </div>

        <hr />

        <div className={s.searchContainer}>
          <SearchActions />
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default compose(
  connect(mapStateToProps),
  graphql(MeQuery, {
    options: ownProps => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      user: data.me,
    }),
  }),
)(BrowseRoles);
