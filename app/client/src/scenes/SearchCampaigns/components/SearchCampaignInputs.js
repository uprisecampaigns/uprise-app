import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import {
  addSearchItem, removeSearchItem,
} from 'actions/SearchActions';

import ControlledListItem from 'components/ControlledListItem';
import ZipcodeSearch from 'components/ZipcodeSearch';
import TogglesList from 'components/TogglesList';

import s from 'styles/Search.scss';


const graphqlOptions = collection => ({
  props: ({ data }) => ({
    collection: !data.loading && data[collection] ? data[collection] : [],
  }),
});

class SearchCampaignInputs extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  handleToggle = (collectionName, on, value) => {
    if (on) {
      this.props.dispatch(addSearchItem('campaign', collectionName, value));
    } else {
      this.props.dispatch(removeSearchItem('campaign', collectionName, value));
    }
  }
  render() {
    const {
      handleToggle,
      addSelectedItem,
    } = this;

    return (
      <List className={s.searchInputsList}>

        <ControlledListItem
          primaryText="Location"
          className={s.listItemContainer}
          nestedItems={[(
            <div key={0} className={[s.listItem, s.geographySearchContainer].join(' ')}>
              <ZipcodeSearch
                addItem={addSelectedItem}
              />
            </div>
          )]}
        />

      </List>
    );
  }
}

export default connect()(SearchCampaignInputs);
