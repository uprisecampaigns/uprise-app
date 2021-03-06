import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import SearchActionsQuery from 'schemas/queries/SearchActionsQuery.graphql';

import s from 'styles/Organize.scss';

class ManageCampaignActionsContainer extends PureComponent {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      createActionDropdownOpen: false,
    };
  }

  toggleCreateActionDropdown = (event) => {
    event.preventDefault();

    this.setState({
      createActionDropdownOpen: true,
      createActionDropdownAnchorEl: event.currentTarget,
    });
  };

  closeCreateActionDropdown = () => {
    this.setState({
      createActionDropdownOpen: false,
    });
  };

  render() {
    const { toggleCreateActionDropdown, closeCreateActionDropdown } = this;
    const { createActionDropdownOpen, createActionDropdownAnchorEl } = this.state;

    if (this.props.campaign && this.props.actions) {
      const { campaign, actions } = this.props;

      const actionsList = actions.map((action) => (
        <Link key={action.id} to={`/organize/${campaign.slug}/opportunity/${action.slug}`}>
          <ListItem>
            <div className={s.actionListTitle}>{action.title}</div>

            {action.city &&
              action.state && (
                <div className={s.actionListDetailLine}>
                  {action.city}, {action.state}
                </div>
              )}
          </ListItem>
        </Link>
      ));

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`/organize/${campaign.slug}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Opportunities
              </div>
            </div>

            <div className={s.centerButtonContainer}>
              <div
                className={s.organizeButton}
                onClick={toggleCreateActionDropdown}
                onKeyPress={toggleCreateActionDropdown}
                role="button"
                tabIndex="0"
              >
                Create Opportunity
              </div>
            </div>

            <Popover
              open={createActionDropdownOpen}
              anchorEl={createActionDropdownAnchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={closeCreateActionDropdown}
            >
              <Menu>
                <Link to={`/organize/${campaign.slug}/create-role`}>
                  <MenuItem primaryText="Create ongoing role or project" />
                </Link>
                <Link to={`/organize/${campaign.slug}/create-event`}>
                  <MenuItem primaryText="Create with specific date/times" />
                </Link>
              </Menu>
            </Popover>

            <List>{actionsList}</List>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  graphql(CampaignQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          id: ownProps.campaignId,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),

  graphql(SearchActionsQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          campaignIds: [ownProps.campaignId],
          // This prevents paging - we just want them all at once
          // TODO: better implementation
          limit: 1000,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      actions: data.actions ? data.actions.actions : [],
    }),
  }),
)(ManageCampaignActionsContainer);
