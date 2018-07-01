import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import history from 'lib/history';
import withTimeWithZone from 'lib/withTimeWithZone';

import Link from 'components/Link';

import { setRecipients } from 'actions/MessageActions';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import ActionQuery from 'schemas/queries/ActionQuery.graphql';
import SignedUpVolunteersQuery from 'schemas/queries/SignedUpVolunteersQuery.graphql';

import s from 'styles/Organize.scss';

import VolunteerList from './components/VolunteerList';

const ConnectedVolunteerList = graphql(SignedUpVolunteersQuery, {
  options: (ownProps) => ({
    variables: {
      actionSearch: {
        id: ownProps.actionId,
      },
      shiftSearch:
        ownProps.selectedShift !== 'all'
          ? {
              id: ownProps.selectedShift,
            }
          : undefined,
    },
  }),
  props: ({ data }) => ({
    volunteers: data.signedUpVolunteers,
  }),
})(VolunteerList);

class ManageActionVolunteers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    action: PropTypes.object,
    timeWithZone: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    actionId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    campaign: undefined,
    action: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      emptyRecipientsModalOpen: false,
    };

    this.updateAvailableShifts(props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateAvailableShifts(nextProps);
  }

  updateAvailableShifts = (props) => {
    if (typeof props.action === 'object' && typeof props.action.ongoing === 'boolean' && !props.action.ongoing) {
      this.setState({ selectedShift: 'all' });
    }
  };

  handleShiftSelection = (event, key, selectedShift) => {
    typeof event.stopPropagation === 'function' && event.stopPropagation();
    this.setState({ selectedShift });
  };

  composeMessage = (event) => {
    const { campaign, action, dispatch } = this.props;

    if (this.state.selected.length === 0) {
      this.setState({ emptyRecipientsModalOpen: true });
    } else {
      dispatch(setRecipients(this.state.selected));
      history.push(`/organize/${campaign.slug}/opportunity/${action.slug}/compose`);
    }
  };

  handleRowSelection = (selected) => {
    this.setState({ selected });
  };

  render() {
    if (this.props.action && this.props.campaign) {
      const { action, campaign, timeWithZone } = this.props;
      const { emptyRecipientsModalOpen, selectedShift, selected } = this.state;

      const baseActionUrl = `/organize/${campaign.slug}/opportunity/${action.slug}`;

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

      const shiftMenuItems = Array.isArray(action.shifts)
        ? action.shifts.map((shift) => (
            <MenuItem
              key={shift.id}
              value={shift.id}
              primaryText={`${timeWithZone(shift.start, action.zipcode, 'M/D/YY h:mm')} - ${timeWithZone(
                shift.end,
                action.zipcode,
                'h:mm a z',
              )}`}
            />
          ))
        : [];

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`${baseActionUrl}`}>{action.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Contact Volunteers
              </div>
            </div>

            <div className={s.centerButtonContainer}>
              <div
                className={s.organizeButton}
                onClick={this.composeMessage}
                onKeyPress={this.composeMessage}
                role="button"
                tabIndex="0"
              >
                Compose Message
              </div>
            </div>

            {!action.ongoing && (
              <div className={s.shiftsSelector}>
                <SelectField
                  floatingLabelText="Select Shifts"
                  value={selectedShift}
                  onChange={this.handleShiftSelection}
                >
                  <MenuItem value="all" primaryText="All" />
                  {shiftMenuItems}
                </SelectField>
              </div>
            )}

            <ConnectedVolunteerList
              actionId={action.id}
              selected={selected}
              selectedShift={selectedShift}
              handleRowSelection={this.handleRowSelection}
            />

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
  withTimeWithZone,
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
  graphql(ActionQuery, {
    options: (ownProps) => ({
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
)(ManageActionVolunteers);
