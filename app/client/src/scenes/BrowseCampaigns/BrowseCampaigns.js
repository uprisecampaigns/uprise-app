import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import BrowseHeader from 'components/BrowseHeader';
import SearchCampaigns from 'components/SearchCampaigns';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Volunteer.scss';

class BrowseCampaigns extends Component {
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
          Follow a Campaign
        </div>
        <div className={s.subHeader}>
          23 Campaigns
        </div>
        <div className={s.subHeader}>
          Learn more &gte;
        </div>

        <hr />

        <div className={s.searchContainer}>
          <SearchCampaigns />
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
)(BrowseCampaigns);
