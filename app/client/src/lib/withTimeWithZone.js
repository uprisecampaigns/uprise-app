import React, { Component } from 'react';


export default (WrappedComponent) => {
  class WithTimeWithZone extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillMount = async () => {
      try {
        const zipcodeToTimezone = await import(/* webpackChunkName: "zipcode-to-timezone" */ 'zipcode-to-timezone');
        const moment = await import(/* webpackChunkName: "moment-timezone" */ 'moment-timezone');

        this.setState({
          timeWithZone: (date, zipcode, formatString) => {
            // const timezone = (zipcode && zipcodeToTimezone.lookup(zipcode)) ? zipcodeToTimezone.lookup(zipcode) : 'America/New_York';
            const timezone = (zipcode && zipcodeToTimezone.lookup(zipcode)) ? zipcodeToTimezone.lookup(zipcode) : 'America/Phoenix';
            return moment(date).tz(timezone).format(formatString);
          },
        });
      } catch (e) {
        throw new Error(`Problem loading libraries: ${e.message}`);
      }
    }

    render() {
      if (typeof this.state.timeWithZone === 'function') {
        return (
          <WrappedComponent timeWithZone={this.state.timeWithZone} {...this.props} />
        );
      }
      return null;
    }
  }

  return WithTimeWithZone;
};

