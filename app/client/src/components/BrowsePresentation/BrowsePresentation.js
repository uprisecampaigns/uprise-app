import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import SearchInputs from 'components/SearchInputs';

import s from 'styles/Volunteer.scss';


function BrowsePresentation(props) {
  const {
    type,
  } = props;

  const storeProp = `${type}Search`;

  const mapStateToProps = (state, ownProps) => ({
    selectedState: state[ownProps.storeProp],
  });

  const ConnectedSearchInputs = connect(mapStateToProps)(SearchInputs);

  return (
    <div className={s.presentationContainer}>
      <ConnectedSearchInputs
        type={type}
        storeProp={storeProp}
      />
    </div>
  );
}

BrowsePresentation.propTypes = {
  type: PropTypes.string.isRequired,
};

export default BrowsePresentation;
