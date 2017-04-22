import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Link from 'components/Link';

import { MyActionsQuery } from 'schemas/queries';

// TODO: better css importing
import s from 'styles/Organize.scss';


class MyActions extends Component {

  static PropTypes = {
    myActions: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.myActions) {
      const { myActions, ...props } = this.props;

      const actionsList = myActions.map( (action) => (
        <Link key={action.id} to={'/action/' + action.slug}>
          <ListItem>

            <div className={s.actionListTitle}>
              {action.title}
            </div>

            {action.start_time && (
              <div className={s.actionListDetailLine}>
                {moment(action.start_time).format("ddd, MMM Do YYYY, h:mm:ss a")}
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

          <div className={s.campaignSubHeader}>Actions</div>

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
  graphql(MyActionsQuery, {
    props: ({ data }) => ({ 
      myActions: data.myActions
    })
  }),
)(MyActions);
