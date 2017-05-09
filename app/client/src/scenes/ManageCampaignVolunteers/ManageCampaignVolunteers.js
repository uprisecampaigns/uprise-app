import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import {
  Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, 
  TableRow, TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import history from 'lib/history';

import Link from 'components/Link';

import { setRecipients } from 'actions/MessageActions';

import { 
  CampaignQuery, SubscribedUsersQuery
} from 'schemas/queries';

import s from 'styles/Organize.scss';


class ManageCampaignVolunteers extends Component {

  static PropTypes = {
    campaignSlug: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    campaign: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      emptyRecipientsModalOpen: false
    };
  }

  handleRowSelection = (selectedRows) => {
    const selected = this.props.subscribers.filter( (volunteer, index) => (
      (selectedRows === 'all' || selectedRows.includes(index))
    ));

    this.setState({ selected });
  }

  composeMessage = (event) => {

    const { campaign, dispatch, ...props } = this.props;

    if (this.state.selected.length === 0) {
      this.setState({ emptyRecipientsModalOpen: true });
    } else {
    
      dispatch(setRecipients(this.state.selected));
      console.log(this.state.selected);

      history.push('/organize/' + campaign.slug + '/compose');
    }
  }

  render() {

    if (this.props.campaign && this.props.subscribers) {

      const { campaign, subscribers, ...props } = this.props;
      const { emptyRecipientsModalOpen, ...state } = this.state;

      const baseUrl = '/organize/' + campaign.slug;

      const modalActions = [
        <RaisedButton
          label="Cancel"
          primary={false}
          onTouchTap={ () => { this.setState({emptyRecipientsModalOpen: false}); }}
        />
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={'/organize/' + campaign.slug}>
            <div className={[s.navHeader, s.campaignNavHeader].join(' ')}>

              <FontIcon 
                className={["material-icons", s.backArrow].join(' ')}
              >arrow_back</FontIcon>

              {campaign.title}
            </div>
          </Link>

          <div className={s.pageSubHeader}>Volunteers</div>

          <div className={s.composeMessageButtonContainer}>
            <RaisedButton
              className={s.organizeButton}
              onTouchTap={this.composeMessage}
              primary={true}
              label="Compose Message"
            />
          </div>

          <Table
            fixedHeader={true}
            selectable={true}
            multiSelectable={true}
            onRowSelection={this.handleRowSelection}
          >
            <TableHeader
              displaySelectAll={true}
              adjustForCheckbox={true}
              enableSelectAll={true}
            >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Email</TableHeaderColumn>
                <TableHeaderColumn>Phone</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={true}
              showRowHover={true}
              stripedRows={false}
            >
              {subscribers.map( (subscriber, index) => (
                <TableRow key={subscriber.id} selectable={true}>
                  <TableRowColumn>{subscriber.first_name + ' ' + subscriber.last_name}</TableRowColumn>
                  <TableRowColumn>{subscriber.email}</TableRowColumn>
                  <TableRowColumn>{subscriber.phone_number}</TableRowColumn>
                </TableRow>
                ))}
            </TableBody>
          </Table>

          {emptyRecipientsModalOpen && (
            <Dialog
              title="No Recipients Selected"
              modal={true}
              actions={modalActions}
              open={emptyRecipientsModalOpen}
            >
              <p>
                Please select at least one recipient in order to send them a message.
              </p>
            </Dialog>
          )}

        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.campaignId
        }
      }
    }),
    props: ({ data }) => ({ 
      campaign: data.campaign
    })
  }),
  graphql(SubscribedUsersQuery, {
    options: (ownProps) => ({ 
      variables: {
        search: {
          id: ownProps.campaignId
        }
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({ 
      subscribers: data.subscribedUsers
    })
  })
)(ManageCampaignVolunteers);
