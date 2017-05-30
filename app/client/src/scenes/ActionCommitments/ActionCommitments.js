import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import timeWithZone from 'lib/timeWithZone';

import Link from 'components/Link';

import ActionCommitmentsQuery from 'schemas/queries/ActionCommitmentsQuery.graphql';

import s from 'styles/Volunteer.scss';


class ActionCommitments extends Component {

  static PropTypes = {
    actionCommitments: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.actionCommitments) {
      const { actionCommitments, ...props } = this.props;

      const actionsList = actionCommitments.map( (action) => (
        <Link key={action.id} to={'/action/' + action.slug}>
          <ListItem>

            <div className={s.actionListTitle}>
              {action.title}
            </div>

            {action.start_time && (
              <div className={s.actionListDetailLine}>
                {timeWithZone(action.start_time, action.zipcode, 'ddd, MMM Do YYYY, h:mma z')}
              </div>
            )}

            {(action.city && action.state) && (
              <div className={s.actionListDetailLine}>
                {action.city}, {action.state}
              </div>
            )}

            {(action.owner) && (
              <div className={s.actionListDetailLine}>
                Coordinator: {action.owner.first_name} {action.owner.last_name} <Link to={"mailto:" + action.owner.email} mailTo={true} external={true} useAhref={true}>{action.owner.email}</Link>
              </div>
            )}

          </ListItem>
        </Link>
      ));

      return (
        <div className={s.outerContainer}>

          <div className={s.pageSubHeader}>Actions</div>

          <List>

            { actionsList }

          </List>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(ActionCommitmentsQuery, {
    props: ({ data }) => ({ 
      actionCommitments: data.actionCommitments
    })
  }),
)(ActionCommitments);
