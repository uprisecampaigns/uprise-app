
import React, { PureComponent, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class SearchInputWithButton extends React.PureComponent {

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
    buttonLabel: PropTypes.string.isRequired,
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
        floatingLabelText={inputLabel}
        searchText={this.state.value}
        onUpdateInput={this.handleInputChange}
        onNewRequest={(item) => this.addItem()} 
        dataSource={collectionToSearch}
        openOnFocus={true}
        filter={(searchText, item) => searchText !== '' && item.toLowerCase().includes(searchText.toLowerCase())}
      />
    ) : (
      <TextField
        floatingLabelText={inputLabel}
        value={this.state.value}
        onChange={ (event) => { this.handleInputChange(event.target.value) } }
      />
    );

    return (
      <div>
        <form onSubmit={this.addItem}>
          {input}
          <RaisedButton 
            onTouchTap={this.addItem} 
            type="submit"
            primary={false} 
            label={props.buttonLabel} 
          />
        </form>
      </div>
    )
  }
}

export default SearchInputWithButton;
