import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import TogglesList from 'components/TogglesList';
import DateTimeSearch from 'components/DateTimeSearch';
import GeographySearch from 'components/GeographySearch';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import {
  addSearchItem, setSearchDates, removeSearchItem,
} from 'actions/SearchActions';

import s from 'styles/Search.scss';

import DropDown from './components/DropDown';


class SearchInputs extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    selectedState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);
  }

  addSelectedItem = (collectionName, value) => {
    const { type } = this.props;
    this.props.dispatch(addSearchItem(type, collectionName, value));
  }

  handleToggle = (collectionName, on, value) => {
    const { type } = this.props;
    if (on) {
      this.props.dispatch(addSearchItem(type, collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem(type, collectionName, value));
    }
  }

  setDates = (dates) => {
    const { type } = this.props;
    this.props.dispatch(setSearchDates(type, dates));
  }

  render() {
    const {
      type, selectedState,
    } = this.props;

    return (
      <div className={s.searchInputsContainer}>

        <DropDown
          title="Activities"
          content={
            <TogglesList
              collection={this.props.activities}
              selectedCollection={selectedState.activities}
              collectionName="activities"
              keyPropName="title"
              displayPropName="description"
              handleToggle={this.handleToggle}
              containerClassName={s.inlineTogglesContainer}
              itemClassName={s.inlineTogglesItem}
            />
          }
        />

        <DropDown
          title="Date"
          content={
            <DateTimeSearch
              setDates={this.setDates}
              handleToggle={this.handleToggle}
              selectedTimes={selectedState.times}
            />
          }
        />

        <DropDown
          title="Distance"
          content={
            <GeographySearch
              addItem={this.addSelectedItem}
            />
          }
        />
      </div>
    );
  }
}


export default compose(
  graphql(ActivitiesQuery, {
    props: ({ data }) => ({
      activities: !data.loading && data.activities ? data.activities : [],
    }),
  }),
)(SearchInputs);
