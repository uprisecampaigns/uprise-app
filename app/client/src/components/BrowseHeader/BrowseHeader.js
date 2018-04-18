import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/Link';

import s from 'styles/Volunteer.scss';


function BrowseHeader(props) {
  const { selected } = props;
  const unselectedClass = s.opportunityType;
  const selectedClass = [unselectedClass, s.selectedOpportunityType].join(' ');

  const rolesClass = selected === 'roles' ? selectedClass : unselectedClass;
  const eventsClass = selected === 'events' ? selectedClass : unselectedClass;
  return (
    <div>
      <div className={s.headerTitle}>
        Browse Volunteer Opportunities
      </div>
      <div className={s.subHeader}>
        <Link to="/browse/roles" useAHref={false}>
          <div className={rolesClass}>
            <div className={s.opportunityTypeHeader}>
              Roles
            </div>
            <div className={s.opportunityTypeSubHeader}>
              Ongoing roles and projects
            </div>
          </div>
        </Link>
        <Link to="/browse/events" useAHref={false}>
          <div className={eventsClass}>
            <div className={s.opportunityTypeHeader}>
              Events
            </div>
            <div className={s.opportunityTypeSubHeader}>
              Sign up for specific shifts
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

BrowseHeader.propTypes = {
  selected: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selected: state.pageNav.browse,
});

export default connect(mapStateToProps)(BrowseHeader);
