import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'material-ui/List';

import {
  addSearchItem,
} from 'actions/SearchActions';

import ControlledListItem from 'components/ControlledListItem';
import ZipcodeSearch from 'components/ZipcodeSearch';

import s from 'styles/Search.scss';


class SearchCampaignInputs extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    allOpen: PropTypes.bool,
  }

  static defaultProps = {
    allOpen: false,
  }

  addSelectedItem = (collectionName, value) => {
    this.props.dispatch(addSearchItem('campaign', collectionName, value));
  }

  render() {
    const {
      addSelectedItem,
    } = this;

    const { allOpen } = this.props;

    return (
      <List className={s.searchInputsList}>

        <ControlledListItem
          primaryText="Location"
          className={s.listItemContainer}
          initiallyOpen={allOpen}
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
