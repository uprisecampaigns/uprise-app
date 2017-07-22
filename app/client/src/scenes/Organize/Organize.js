import React, { PureComponent, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import MyCampaignsQuery from 'schemas/queries/MyCampaignsQuery.graphql';

import s from 'styles/Organize.scss';


class Organize extends PureComponent {
  static propTypes = {
    myCampaigns: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    myCampaigns: undefined,
  }

  render() {
    const campaignList = this.props.myCampaigns ? this.props.myCampaigns.map(campaign => (

      <div key={campaign.id}>

        <Link to={`/organize/${campaign.slug}`} key={campaign.id}>
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
              primary
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
    graphqlLoading: data.loading,
  }),
  options: {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  },
})(Organize);

export default OrganizeWithData;
