import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TypesQuery from 'schemas/queries/TypesQuery.graphql';
import LevelsQuery from 'schemas/queries/LevelsQuery.graphql';
import IssueAreasQuery from 'schemas/queries/IssueAreasQuery.graphql';

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

const TypesTogglesList = compose(
  graphql(TypesQuery, graphqlOptions('types')),
  connect(state => ({ selectedCollection: state.campaignsSearch.types })),
)(TogglesList);

const LevelsTogglesList = compose(
  graphql(LevelsQuery, graphqlOptions('levels')),
  connect(state => ({ selectedCollection: state.campaignsSearch.levels })),
)(TogglesList);

const IssueAreasTogglesList = compose(
  graphql(IssueAreasQuery, graphqlOptions('issueAreas')),
  connect(state => ({ selectedCollection: state.campaignsSearch.issueAreas })),
)(TogglesList);

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

        <Divider />

        <IssueAreasTogglesList
          listTitle="Issue Areas"
          collectionName="issueAreas"
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />

        <Divider />

        <TypesTogglesList
          listTitle="Campaign Types"
          collectionName="types"
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />

        <Divider />

        <LevelsTogglesList
          listTitle="Campaign Level"
          collectionName="levels"
          displayPropName="title"
          keyPropName="title"
          handleToggle={handleToggle}
          className={s.listItemContainer}
          containerClassName={s.listItem}
        />

      </List>
    );
  }
}

export default connect()(SearchCampaignInputs);
