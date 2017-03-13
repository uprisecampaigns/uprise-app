
import React, { Component, PropTypes } from 'react';
import ContentNavigation from 'components/ContentNavigation';
import { graphql } from 'react-apollo';

import { 
  MyCampaignsQuery, 
} from 'schemas/queries';

const baseUrl = '/organize';

class Organize extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.string.isRequired
  };

  render() {

    const selections = [
      { title: 'create campaign', path: 'create-campaign' }
    ];

    if (typeof this.props.myCampaigns === 'object') {
      this.props.myCampaigns.forEach( (campaign) => {
        selections.push({
          title: campaign.title,
          path: campaign.slug
        });
      });
    }

    const selected = selections.findIndex( (i) => {
      return i.path === this.props.selected;
    });

    return (
      <div>
        <ContentNavigation
          baseUrl={baseUrl}
          selections={selections}
          selected={selected}
        />
        {this.props.children}
      </div>
    );
  }
}

const OrganizeWithData = graphql(MyCampaignsQuery, {
  props: ({ data }) => ({
    myCampaigns: data.myCampaigns,
    graphqlLoading: data.loading
  }),
  options: (ownProps) => ({
    ...ownProps
  })
})(Organize);

export default OrganizeWithData;
