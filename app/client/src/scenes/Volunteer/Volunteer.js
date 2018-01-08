import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'react-apollo';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Link from 'components/Link';

import MeQuery from 'schemas/queries/MeQuery.graphql';

import s from 'styles/Volunteer.scss';


function Volunteer(props) {
  const { userObject } = props;
  return (
    <div className={s.outerContainer}>

      <div className={s.pageHeader}>
        { userObject.first_name } { userObject.last_name }
      </div>

      <List className={s.navList}>

        <Divider />

        <Link to={`/user/${userObject.id}`}>
          <ListItem
            primaryText="My Profile"
          />
        </Link>

        <Divider />

        <Link to="/volunteer/opportunity-commitments">
          <ListItem
            primaryText="My Commitments"
          />
        </Link>

        <Divider />

        <Link to="/volunteer/campaign-subscriptions">
          <ListItem
            primaryText="My Subscriptions"
          />
        </Link>

        <Divider />

      </List>
    </div>
  );
}

Volunteer.propTypes = {
  userObject: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
};

const withMeQuery = graphql(MeQuery, {
  props: ({ data }) => ({
    userObject: !data.loading && data.me ? data.me : {},
  }),
});

export default withMeQuery(Volunteer);
