
import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import { 
  MyCampaignsQuery, 
} from 'schemas/queries';

import s from 'styles/Organize.scss';


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
      <div className={s.outerContainer}>

        <div className={s.organizeHeader}>
          Organize
        </div>

        <Link to={'/organize/create-campaign'}>
          <div className={s.organizeButton}>
            <RaisedButton
              primary={true} 
              label="Create Campaign" 
            />
          </div>
        </Link>

        <List>

          { campaignList }
         
        </List>
      </div>
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
