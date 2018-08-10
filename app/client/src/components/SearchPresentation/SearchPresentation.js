import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Link from 'components/Link';

import SearchBar from 'components/SearchBar';

import s from 'styles/Search.scss';

class SearchPresentation extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    addSelectedItem: PropTypes.func.isRequired,
    searchSelections: PropTypes.node.isRequired,
    searchInputs: PropTypes.func.isRequired,
    searchResults: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filterOpen: false,
    };

    this.searchBarInputElements = [];
  }

  addSelectedItem = (collectionName, value) => {
    this.searchBarInputElements.forEach((element) => element.blur());
    this.props.addSelectedItem(collectionName, value);
  };

  handleOpenFilter = (event) => {
    this.searchBarInputElements.forEach((element) => element.blur());
    event.preventDefault();

    this.setState((prevState) =>
      Object.assign({}, prevState, {
        filterOpen: !prevState.filterOpen,
      }),
    );
  };

  handleCloseFilter = (event) => {
    typeof event.preventDefault === 'function' && event.preventDefault();
    this.setState((prevState) => Object.assign({}, prevState, { filterOpen: false }));
  };

  render() {
    const { searchSelections, searchInputs, searchResults, loggedIn } = this.props;

    return (
      <div className={[s.searchContentContainer, s.innerContainer].join(' ')}>
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
                inputRef={(el) => {
                  this.searchBarInputElements[0] = el;
                }}
              />
            </div>

            <div
              className={s.mobileFilterContainer}
              onClick={this.handleOpenFilter}
              onKeyPress={this.handleOpenFilter}
              role="button"
              tabIndex="0"
            >
              <span>Filter</span>
              <IconButton iconClassName="material-icons">filter_list</IconButton>
            </div>
          </div>
          <div className={s.filterResultsOuterContainer}>
            <div className={s.selectionsResultsContainer}>
              {!loggedIn && (
                <div className={s.introCard}>
                  <div className={s.introHeader}>Take Action</div>
                  <div className={s.introBlurb}>
                    UpRise is reforming political campaigning through effective volunteer mobilization.
                  </div>
                  <div className={s.introButtons}>
                    <div className={s.centerFlexButtons}>
                      <Link to="/signup" useAhref className={[s.primaryButton, s.buttonLink, s.fullButton].join(' ')}>
                        Sign Up Now
                      </Link>
                    </div>
                    <div className={[s.spaceButtons, s.extraButtons].join(' ')}>
                      <Link to="https://uprisecampaigns.org/" useAhref external className={s.buttonLinkBlack}>
                        Learn More
                      </Link>
                      <Link to="https://uprisecampaigns.org/donate/" useAhref external className={s.buttonLinkRed}>
                        Donate to UpRise
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <div className={s.selectionsContainer}>{searchSelections}</div>

              {this.state.filterOpen && (
                <div>
                  <div className={s.filterOverlay} />
                  <div className={s.filterOptionsContainer}>
                    <div>
                      <Divider />

                      <div className={s.filterHeaderContainer}>
                        <span className={s.filterHeader}>Filter</span>

                        <span className={s.doneButtonContainer}>
                          <div
                            className={s.primaryButton}
                            onClick={this.handleCloseFilter}
                            onKeyPress={this.handleCloseFilter}
                            role="button"
                            tabIndex="0"
                          >
                            Done
                          </div>
                        </span>
                      </div>

                      <Divider />

                      {searchInputs(false)}
                    </div>
                    <Divider />
                  </div>
                </div>
              )}

              {(true || !this.state.filterOpen) && <div className={s.resultsContainer}>{searchResults}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  fetchingAuthUpdate: state.userAuthSession.fetchingAuthUpdate,
});

export default connect(mapStateToProps)(SearchPresentation);
