
import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import { graphql } from 'react-apollo';

import Link from 'components/Link';

import { 
  MyCampaignsQuery, 
} from 'schemas/queries';

const baseUrl = '/organize';

class Organize extends Component {
  static propTypes = {
    myCampaigns: PropTypes.array,
  };

  render() {

    const campaignList = this.props.myCampaigns ? this.props.myCampaigns.map( (campaign) => (
      
      <Link to={'/organize/' + campaign.slug} key={campaign.id}>
        <ListItem 
          primaryText={campaign.title}
        />
      </Link>
      
    )) : [];

        
    return (
      <List>

        { campaignList }
       
        <Link to="/organize/create-campaign">
          <ListItem 
            primaryText="Create Campaign"
          />
        </Link>
       
      </List>
    );
  }
}

const OrganizeWithData = graphql(MyCampaignsQuery, {
  props: ({ data }) => ({
    myCampaigns: data.myCampaigns,
    graphqlLoading: data.loading
  }),
  options: {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000
  }
})(Organize);

export default OrganizeWithData;
