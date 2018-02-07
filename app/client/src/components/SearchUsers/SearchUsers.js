import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import SearchPresentation from 'components/SearchPresentation';

import {
  addSearchItem,
} from 'actions/SearchActions';

import UsersQuery from 'schemas/queries/UsersQuery.graphql';

import s from 'styles/Search.scss';

import SearchUsersResults from './components/SearchUsersResults';
import SearchUsersInputs from './components/SearchUsersInputs';
import SearchUsersSelections from './components/SearchUsersSelections';


const graphqlOptions = collection => ({
  props: ({ data }) => ({
    [collection]: data[collection],
    items: data[collection],
    graphqlLoading: data.loading,
  }),
  options: ownProps => ({
    // Refresh every 5 min should be safe
    pollInterval: 60000 * 5,
    fetchPolicy: 'cache-and-network',
    ...ownProps,
  }),
});

const mapStateToProps = state => ({
  search: {
    keywords: state.usersSearch.keywords,
    tags: state.usersSearch.tags,
    geographies: state.usersSearch.geographies,
    activities: state.usersSearch.activities,
  },
  sortBy: state.usersSearch.sortBy,
});

const SearchUsersResultsWithData = compose(
  connect(mapStateToProps),
  graphql(UsersQuery, graphqlOptions('users')),
)(SearchUsersResults);


class SearchUsers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };


  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('user', collectionName, value));
  }

  render() {
    return (
      <div className={s.outerContainer}>

        <SearchPresentation
          addSelectedItem={this.addSelectedItem}
          searchSelections={<SearchUsersSelections />}
          searchInputs={allOpen => <SearchUsersInputs allOpen={allOpen} />}
          searchResults={<SearchUsersResultsWithData />}
        />

      </div>
    );
  }
}

export default connect()(SearchUsers);
