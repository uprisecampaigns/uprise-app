import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import SearchBar from 'components/SearchBar';

import s from 'styles/Search.scss';


class SearchPresentation extends Component {
  static propTypes = {
    addSelectedItem: PropTypes.func.isRequired,
    searchSelections: PropTypes.node.isRequired,
    searchInputs: PropTypes.func.isRequired,
    searchResults: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      filterOpen: false,
    };

    this.searchBarInputElements = [];
  }

  addSelectedItem = (collectionName, value) => {
    this.searchBarInputElements.forEach(element => element.blur());
    this.props.addSelectedItem(collectionName, value);
  }

  handleOpenFilter = (event) => {
    this.searchBarInputElements.forEach(element => element.blur());
    event.preventDefault();

    this.setState(prevState => (Object.assign(
      {},
      prevState,
      {
        filterOpen: !prevState.filterOpen,
      },
    )));
  }

  handleCloseFilter = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState(prevState => (Object.assign(
      {},
      prevState,
      { filterOpen: false },
    )));
  }

  render() {
    const {
      searchSelections, searchInputs, searchResults,
    } = this.props;

    return (
      <div className={s.searchContentContainer}>

        <div className={s.desktopFiltersContainer}>
          <Divider />
          <div className={s.filterHeaderContainer}>
            <span className={s.filterHeader}>Filters</span>
          </div>
          <Divider />
          {searchInputs(true)}
          <Divider />
        </div>

        <div className={s.allSizesContainer}>
          <div className={s.searchBarContainer}>
            <div className={s.searchBar}>
              <SearchBar
                collectionName="keywords"
                inputLabel="Keyword search"
                addItem={this.addSelectedItem}
                inputRef={(el) => { this.searchBarInputElements[0] = el; }}
              />
            </div>

            <div
              className={s.mobileFilterContainer}
              onTouchTap={this.handleOpenFilter}
            >
              <span>Filter</span>
              <IconButton
                iconClassName="material-icons"
              >filter_list
              </IconButton>
            </div>
          </div>
          <div className={s.filterResultsOuterContainer}>

            <div className={s.selectionsResultsContainer}>

              <div className={s.selectionsContainer}>
                {searchSelections}
              </div>

              { this.state.filterOpen && (
                <div>
                  <div className={s.filterOverlay} />
                  <div className={s.filterOptionsContainer}>
                    <div>

                      <Divider />

                      <div className={s.filterHeaderContainer}>

                        <span className={s.filterHeader}>Filter</span>

                        <span className={s.doneButtonContainer}>
                          <RaisedButton
                            className={s.primaryButton}
                            onTouchTap={this.handleCloseFilter}
                            primary
                            label="Done"
                          />
                        </span>
                      </div>

                      <Divider />

                      {searchInputs(false)}

                    </div>
                    <Divider />
                  </div>
                </div>
              )}

              { (true || !this.state.filterOpen) && (
                <div className={s.resultsContainer}>
                  {searchResults}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPresentation;
