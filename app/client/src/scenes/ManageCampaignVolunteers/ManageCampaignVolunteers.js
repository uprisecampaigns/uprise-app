import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { setRecipients } from 'actions/MessageActions';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import SubscribedUsersQuery from 'schemas/queries/SubscribedUsersQuery.graphql';

import s from 'styles/Organize.scss';

class ManageCampaignVolunteers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    subscribers: PropTypes.arrayOf(PropTypes.object).isRequired,
    campaign: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      emptyRecipientsModalOpen: false,
    };
  }

  isSelected = (id) => this.state.selected.find((row) => row.id === id) !== undefined;

  handleRowSelection = (selectedRows) => {
    if (selectedRows === 'none') {
      this.setState({ selected: [] });
    } else {
      const selected = this.props.subscribers.filter(
        (volunteer, index) => selectedRows === 'all' || selectedRows.includes(index),
      );

      this.setState({ selected });
    }
  };

  composeMessage = (event) => {
    const { campaign, dispatch } = this.props;

    if (this.state.selected.length === 0) {
      this.setState({ emptyRecipientsModalOpen: true });
    } else {
      dispatch(setRecipients(this.state.selected));
      history.push(`/organize/${campaign.slug}/compose`);
    }
  };

  render() {
    if (this.props.campaign && this.props.subscribers) {
      const { campaign, subscribers } = this.props;
      const { emptyRecipientsModalOpen } = this.state;

      const modalActions = [
        <div
          className={s.button}
          onClick={(event) => {
            event.preventDefault();
            this.setState({ emptyRecipientsModalOpen: false });
          }}
          onKeyPress={(event) => {
            event.preventDefault();
            this.setState({ emptyRecipientsModalOpen: false });
          }}
          role="button"
          tabIndex="0"
        >
          Cancel
        </div>,
      ];

      const baseActionUrl = `/organize/${campaign.slug}`;

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            {/*
            <Link to={`/organize/${campaign.slug}`}>
              <div className={s.navHeader}>
                <FontIcon className={['material-icons', s.backArrow].join(' ')}>arrow_back</FontIcon>

                {campaign.title}
              </div>
            </Link>
          */}

            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`${baseActionUrl}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Contact Volunteers
              </div>
            </div>

            <div className={s.centerButtonContainer}>
              <div
                className={s.composeButton}
                onClick={this.composeMessage}
                onKeyPress={this.composeMessage}
                role="button"
                tabIndex="0"
              >
                Compose Message
              </div>
            </div>

            <Table fixedHeader selectable multiSelectable onRowSelection={this.handleRowSelection}>
              <TableHeader displaySelectAll adjustForCheckbox enableSelectAll>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Phone</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox showRowHover stripedRows={false} deselectOnClickaway={false}>
                {subscribers.map((subscriber, index) => (
                  <TableRow key={subscriber.id} selected={this.isSelected(subscriber.id)} selectable>
                    <TableRowColumn>{`${subscriber.first_name} ${subscriber.last_name}`}</TableRowColumn>
                    <TableRowColumn>{subscriber.email}</TableRowColumn>
                    <TableRowColumn>{subscriber.phone_number}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {emptyRecipientsModalOpen && (
              <Dialog
                title="No Recipients Selected"
                modal
                actions={modalActions}
                open={emptyRecipientsModalOpen}
                actionsContainerClassName={s.modalActionsContainer}
              >
                <p>Please select at least one recipient in order to send them a message.</p>
              </Dialog>
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
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
  graphql(SubscribedUsersQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          id: ownProps.campaignId,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      subscribers: data.subscribedUsers,
    }),
  }),
)(ManageCampaignVolunteers);
