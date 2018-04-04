import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Browse.scss';

class BrowseEvents extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  static defaultProps = {
    user: undefined,
  }

  render() {
    const { user } = this.props;

    const hasCampaigns = typeof user === 'object' && Array.isArray(user.campaigns) && user.campaigns.length;

    return (
      <div className={s.outerContainer}>

        <BrowseHeader />

        <div className={s.headerTitle}>
          Sign up for an Event
        </div>
        <div className={s.subHeader}>
          568+ Volunteer Events
        </div>
        <div className={s.subHeader}>
          Learn more >
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
)(BrowseEvents);
