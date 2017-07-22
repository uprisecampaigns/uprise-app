import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { setRecipients } from 'actions/MessageActions';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import SignedUpVolunteersQuery from 'schemas/queries/SignedUpVolunteersQuery.graphql';

import s from 'styles/Organize.scss';


class ManageActionContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    volunteers: PropTypes.arrayOf(PropTypes.object),
    campaign: PropTypes.object,
    action: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignSlug: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
    action: undefined,
    volunteers: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      emptyRecipientsModalOpen: false,
    };
  }

  isSelected = id => (this.state.selected.find(row => row.id === id) !== undefined)

  handleRowSelection = (selectedRows) => {
    if (selectedRows === 'none') {
      this.setState({ selected: [] });
    } else {
      const selected = this.props.volunteers.filter((volunteer, index) => (
        (selectedRows === 'all' || selectedRows.includes(index))
      ));

      this.setState({ selected });
    }
  }

  composeMessage = (event) => {
    const { campaign, action, dispatch } = this.props;

    if (this.state.selected.length === 0) {
      this.setState({ emptyRecipientsModalOpen: true });
    } else {
      dispatch(setRecipients(this.state.selected));
      history.push(`/organize/${campaign.slug}/action/${action.slug}/compose`);
    }
  }

  render() {
    if (this.props.action && this.props.campaign && this.props.volunteers) {
      const { action, campaign, volunteers } = this.props;
      const { emptyRecipientsModalOpen } = this.state;

      const baseActionUrl = `/organize/${campaign.slug}/action/${action.slug}`;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={(event) => { event.preventDefault(); this.setState({ emptyRecipientsModalOpen: false }); }}
        />,
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}/actions`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Actions
            </div>
          </Link>

          <div className={s.actionHeader}>{action.title}</div>

          <div className={s.pageSubHeader}>Dashboard</div>

          <Link to={`${baseActionUrl}/settings`}>
            <div className={s.settingsLinkContainer}>
              Settings
              <FontIcon
                className={['material-icons'].join(' ')}
              >settings</FontIcon>
            </div>
          </Link>

          <div className={s.composeMessageButtonContainer}>
            <RaisedButton
              className={s.organizeButton}
              onTouchTap={this.composeMessage}
              primary
              label="Compose Message"
            />
          </div>

          <Table
            fixedHeader
            selectable
            multiSelectable
            onRowSelection={this.handleRowSelection}
          >
            <TableHeader
              displaySelectAll
              adjustForCheckbox
              enableSelectAll
            >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Email</TableHeaderColumn>
                <TableHeaderColumn>Phone</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox
              showRowHover
              stripedRows={false}
              deselectOnClickaway={false}
            >
              {volunteers.map((volunteer, index) => (
                <TableRow key={volunteer.id} selected={this.isSelected(volunteer.id)} selectable>
                  <TableRowColumn>{`${volunteer.first_name} ${volunteer.last_name}`}</TableRowColumn>
                  <TableRowColumn>{volunteer.email}</TableRowColumn>
                  <TableRowColumn>{volunteer.phone_number}</TableRowColumn>
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
              <p>
                Please select at least one recipient in order to send them a message.
              </p>
            </Dialog>
          )}

        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: ownProps => ({
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
  graphql(ActionQuery, {
    options: ownProps => ({
      variables: {
        search: {
          id: ownProps.actionId,
        },
      },
    }),
    props: ({ data }) => ({
      action: data.action,
    }),
  }),
  graphql(SignedUpVolunteersQuery, {
    options: ownProps => ({
      variables: {
        search: {
          id: ownProps.actionId,
        },
      },
    }),
    props: ({ data }) => ({
      volunteers: data.signedUpVolunteers,
    }),
  }),
)(ManageActionContainer);
