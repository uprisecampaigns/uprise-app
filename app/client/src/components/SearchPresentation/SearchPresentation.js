import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import SearchBar from 'components/SearchBar';

import s from 'styles/Search.scss';


class SearchPresentation extends Component {
  static propTypes = {
    addSelectedItem: PropTypes.func.isRequired,
    searchSelections: PropTypes.node.isRequired,
    searchInputs: PropTypes.node.isRequired,
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

    this.setState(prevState => (Object.assign({},
      prevState,
      {
        filterOpen: !prevState.filterOpen,
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
      searchSelections, searchInputs, searchResults,
    } = this.props;

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
        <div className={s.filterResultsOuterContainer}>

          <div className={s.desktopSearchOptionsContainer}>
            <div className={s.desktopFilterHeader}>Filter</div>

            <Divider />

            {searchInputs}

            <Divider />

          </div>

          <div className={s.selectionsResultsContainer}>

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
