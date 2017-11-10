import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import withTimeWithZone from 'lib/withTimeWithZone';
import itemsSort from 'lib/itemsSort';

import Link from 'components/Link';

import ActionCommitmentsQuery from 'schemas/queries/ActionCommitmentsQuery.graphql';

import s from 'styles/Volunteer.scss';


class ActionCommitments extends PureComponent {
  static propTypes = {
    actionCommitments: PropTypes.arrayOf(PropTypes.object).isRequired,
    timeWithZone: PropTypes.func.isRequired,
  }

  render() {
    if (this.props.actionCommitments) {
      const { actionCommitments, timeWithZone } = this.props;

      const actionsList = Array.from(actionCommitments).sort(itemsSort({ name: 'date', descending: false })).map(action => {
        const shiftList = (action.signed_up_shifts && action.signed_up_shifts.length) ?
          action.signed_up_shifts.map(shift => (
            <div key={shift.id} className={s.listDetailLine}>
              {timeWithZone(shift.start, action.zipcode, 'ddd, MMM Do YYYY, h:mm')} - {timeWithZone(shift.end, action.zipcode, 'h:mm a z')}
            </div>
          )) : null;

        return (
          <Link key={action.id} to={`/opportunity/${action.slug}`}>
            <ListItem>

              <div className={s.listTitle}>
                {action.title}
              </div>

              <div className={s.listSecondaryHeader}>
                {action.campaign.title}
              </div>

              {shiftList}

              {(action.city && action.state) && (
                <div className={s.listDetailLine}>
                  {action.city}, {action.state}
                </div>
              )}

              {(action.owner) && (
                <div className={s.listDetailLine}>
                  Coordinator: {action.owner.first_name} {action.owner.last_name}&nbsp;
                  <Link to={`mailto:${action.owner.email}`} mailTo external useAhref>
                    {action.owner.email}
                  </Link>
                </div>
              )}

            </ListItem>
          </Link>
        )
      });

      return (
        <div className={s.outerContainer}>

          <Link to="/volunteer">
            <div className={[s.navHeader, s.volunteerNavHeader].join(' ')}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back
              </FontIcon>
              My Profile
            </div>
          </Link>

          <div className={s.pageSubHeader}>My Commitments</div>

          {actionsList.length === 0 ? (
            <div className={s.searchPrompt}>
              You have no current volunteering commitments. You can search for opportunities&nbsp;
              <Link to="/search/search-opportunities" useAhref>here</Link>.
            </div>
          ) : (
            <List>
              {actionsList}
            </List>
          )}
        </div>
      );
    }
    return null;
  }
}

export default compose(graphql(ActionCommitmentsQuery, {
  props: ({ data }) => ({
    actionCommitments: data.actionCommitments,
  }),
}))(withTimeWithZone(ActionCommitments));
