import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import s from './SearchBar.scss';


class SearchBar extends PureComponent {
  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    className: PropTypes.string,
    collectionToSearch: PropTypes.arrayOf(PropTypes.string),
    addItem: PropTypes.func.isRequired,
    inputLabel: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,
    iconName: PropTypes.string,
  }

  static defaultProps = {
    collectionToSearch: undefined,
    iconName: undefined,
    className: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleInputChange = (value) => {
    this.setState(Object.assign({},
      this.state,
      { value },
    ));
  }

  addItem = (event) => {
    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (typeof event === 'object' && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    this.props.addItem(this.props.collectionName, this.state.value);

    this.setState(Object.assign({},
      this.state,
      { value: '' },
    ));
  }

  render() {
    const { collectionToSearch, inputLabel, iconName, inputRef, className } = this.props;

    const input = (typeof collectionToSearch === 'object' && collectionToSearch.length) ? (
      <AutoComplete
        hintText={inputLabel}
        searchText={this.state.value}
        className="searchBarInput"
        underlineShow={false}
        onUpdateInput={this.handleInputChange}
        onNewRequest={item => this.addItem()}
        dataSource={collectionToSearch}
        openOnFocus
        filter={(searchText, item) => searchText !== '' && item.toLowerCase().includes(searchText.toLowerCase())}
        ref={inputRef}
      />
    ) : (
      <TextField
        hintText={inputLabel}
        underlineShow={false}
        className="searchBarInput"
        value={this.state.value}
        onChange={(event) => { this.handleInputChange(event.target.value); }}
        ref={inputRef}
      />
    );

    return (
      <div className={[s.searchBarContainer, className].join(' ')}>
        <form onSubmit={this.addItem}>
          {input}
          <IconButton
            iconClassName="material-icons"
            type="submit"
            onTouchTap={this.addItem}
          >{iconName || 'search'}</IconButton>
        </form>
      </div>
    );
  }
}

export default SearchBar;
