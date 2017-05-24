
import React, { PureComponent, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import s from './SearchBar.scss';


class SearchBar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  static propTypes = {
    collectionName: PropTypes.string.isRequired,
    collectionToSearch: PropTypes.array,
    addItem: PropTypes.func.isRequired,
    inputLabel: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,
    iconName: PropTypes.string
  }

  handleInputChange = (value) => {
    this.setState(Object.assign({},
      this.state,
      { value }
    ));
  }

  addItem = (event) => {

    if (typeof event === 'object' && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    this.props.addItem(this.props.collectionName, this.state.value);

    this.setState(Object.assign({},
      this.state,
      { value: '' }
    ));
  }

  render() {

    const { collectionToSearch, inputLabel, iconName, inputRef, ...props } = this.props;

    const input = (typeof collectionToSearch === 'object' && collectionToSearch.length) ? (
      <AutoComplete
        hintText={inputLabel}
        searchText={this.state.value}
        className="searchBarInput"
        underlineShow={false}
        onUpdateInput={this.handleInputChange}
        onNewRequest={(item) => this.addItem()} 
        dataSource={collectionToSearch}
        openOnFocus={true}
        filter={(searchText, item) => searchText !== '' && item.toLowerCase().includes(searchText.toLowerCase())}
        ref={inputRef}
      />
    ) : (
      <TextField
        hintText={inputLabel}
        underlineShow={false}
        className="searchBarInput"
        value={this.state.value}
        onChange={ (event) => { this.handleInputChange(event.target.value) } }
        ref={inputRef}
      />
    );

    return (
      <div className={s.searchBarContainer}>
        <form onSubmit={this.addItem}>
          {input}
          <IconButton 
            iconClassName='material-icons'
            type="submit"
            onTouchTap={this.addItem} 
          >{iconName || "search"}</IconButton>
        </form>
      </div>
    )
  }
}

export default SearchBar;
