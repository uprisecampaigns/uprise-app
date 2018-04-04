import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import BrowseHeader from 'components/BrowseHeader';
import SearchActions from 'components/SearchActions';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Browse.scss';

class BrowseHome extends Component {
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
          Your direct connection to political campaigns
        </div>
        <div className={s.subHeader}>
          A selection of 1000+ volunteer events and roles near you.
        </div>
        <div className={s.subHeader}>
          Learn more >
        </div>

        <hr />

        <SearchActions />

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
)(BrowseHome);
