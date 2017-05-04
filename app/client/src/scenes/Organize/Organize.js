
import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

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

      <div>
        
        <Link to={'/organize/' + campaign.slug} key={campaign.id}>
          <ListItem 
            primaryText={campaign.title}
          />
        </Link>

        <Divider />

      </div>
      
    )) : [];

        
    return (
      <div className={s.outerContainer}>

        <div className={s.pageHeader}>
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

        <List className={[s.campaignsList, s.navList].join(' ')}>

          <Divider />

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
