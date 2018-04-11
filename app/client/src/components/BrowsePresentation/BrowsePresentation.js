import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import SearchInputs from 'components/SearchInputs';

import s from 'styles/Volunteer.scss';


class BrowsePresentation extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      type,
    } = this.props;

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
}

export default BrowsePresentation;
