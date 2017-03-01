
import React, { PureComponent, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';


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

    const { collectionToSearch, inputLabel, ...props } = this.props;

    const input = (typeof collectionToSearch === 'object' && collectionToSearch.length) ? (
      <AutoComplete
        hintText={inputLabel}
        searchText={this.state.value}
        onUpdateInput={this.handleInputChange}
        onNewRequest={(item) => this.addItem()} 
        dataSource={collectionToSearch}
        openOnFocus={true}
        filter={(searchText, item) => searchText !== '' && item.toLowerCase().includes(searchText.toLowerCase())}
      />
    ) : (
      <TextField
        hintText={inputLabel}
        value={this.state.value}
        onChange={ (event) => { this.handleInputChange(event.target.value) } }
      />
    );

    return (
      <div>
        <form onSubmit={this.addItem}>
          {input}
          <IconButton 
            iconClassName='material-icons'
            type="submit"
            onTouchTap={this.addItem} 
          >search</IconButton>
        </form>
      </div>
    )
  }
}

export default SearchBar;
