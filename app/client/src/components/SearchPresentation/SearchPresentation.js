import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import SearchBar from 'components/SearchBar';
import SearchSort from 'components/SearchSort';

import s from 'styles/Search.scss';


class SearchPresentation extends Component {
  static propTypes = {
    sortSelect: PropTypes.func.isRequired,
    resultsCount: PropTypes.node.isRequired,
    searchSortWrapper: PropTypes.func.isRequired,
    addSelectedItem: PropTypes.func.isRequired,
    searchSortItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchSelections: PropTypes.node.isRequired,
    searchInputs: PropTypes.node.isRequired,
    searchResults: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      filterOpen: false,
      filterPopoverAnchorEl: null,
      sortOpen: false,
      sortPopoverAnchorEl: null,
    };

    this.searchBarInputElements = [];
  }

  addSelectedItem = (collectionName, value) => {
    this.searchBarInputElements.forEach(element => element.blur());
    this.props.addSelectedItem(collectionName, value);
  }

  sortSelect = (value, event) => {
    this.handleCloseSort(event);
    this.props.sortSelect(value);
  }

  handleOpenSort = (event) => {
    this.searchBarInputElements.forEach(element => element.blur());
    event.preventDefault();

    this.setState(Object.assign({},
      this.state,
      {
        sortOpen: true,
        sortPopoverAnchorEl: event.currentTarget,
      },
    ));
  }

  handleCloseSort = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState(Object.assign({},
      this.state,
      { sortOpen: false },
    ));
  }

  handleOpenFilter = (event) => {
    this.searchBarInputElements.forEach(element => element.blur());
    event.preventDefault();

    this.setState(prevState => (Object.assign({},
      prevState,
      {
        filterOpen: !prevState.filterOpen,
        filterPopoverAnchorEl: event.currentTarget,
      },
    )));
  }

  handleCloseFilter = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState(prevState => (Object.assign({},
      prevState,
      { filterOpen: false },
    )));
  }

  render() {
    const {
      searchSortWrapper, resultsCount, searchSortItems,
      searchSelections, searchInputs, searchResults
    } = this.props;

    const ConnectedSearchSort = searchSortWrapper(SearchSort);

    return (
      <div className={s.searchContentContainer}>
        <div className={s.mobileSearchBarContainer}>
          <div className={s.searchBarContainer}>
            <SearchBar
              collectionName="keywords"
              inputLabel="keyword search"
              addItem={this.addSelectedItem}
              inputRef={(el) => { this.searchBarInputElements[0] = el; }}
            />
          </div>
        </div>
        <div className={s.filterResultsOuterContainer}>

          <div className={s.desktopSearchOptionsContainer}>
            <div className={s.desktopFilterHeader}>Filter</div>

            <Divider />

            {searchInputs}

            <Divider />

          </div>

          <div className={s.countSortFilterResultsContainer}>

            <div className={s.desktopSearchBarContainer}>
              <div className={s.searchBarContainer}>
                <SearchBar
                  collectionName="keywords"
                  inputLabel="keyword search"
                  addItem={this.addSelectedItem}
                  inputRef={(el) => { this.searchBarInputElements[0] = el; }}
                />
              </div>
            </div>

            <div className={s.countSortFilterContainer}>

              <div className={s.countContainer}>
                {resultsCount}
              </div>

              <div
                onTouchTap={this.handleOpenSort}
                className={s.sortContainer}
              >
                <span>Sort by</span>
                <IconButton
                  iconClassName="material-icons"
                >sort</IconButton>

                <Popover
                  open={this.state.sortOpen}
                  anchorEl={this.state.sortPopoverAnchorEl}
                  onRequestClose={this.handleCloseSort}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  className={s.popover}
                >
                  <ConnectedSearchSort
                    onSelect={this.sortSelect}
                    items={searchSortItems}
                  />
                </Popover>
              </div>

              <div
                className={s.filterContainer}
                onTouchTap={this.handleOpenFilter}
              >
                <span>Filter</span>
                <IconButton
                  iconClassName="material-icons"
                >filter_list</IconButton>
              </div>
            </div>

            <div className={s.selectionsContainer}>
              {searchSelections}
            </div>

            { this.state.filterOpen && (
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

                  {searchInputs}

                </div>
                <Divider />
              </div>
            )}

            { !this.state.filterOpen && (
              <div className={s.resultsContainer}>
                {searchResults}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
}

export default SearchPresentation;
