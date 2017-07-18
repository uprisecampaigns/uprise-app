import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';

import Link from 'components/Link';

import { urls } from 'config/config';

import s from './AddToCalendar.scss';


class AddToCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  static propTypes = {
    event: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { event, children, ...props } = this.props;

    const icalUrl = `${urls.api}/calendar-links/ics/${event.id}`;
    const googleUrl = `${urls.api}/calendar-links/google/${event.id}`;

    return (
      <div
        {...props}
      >
        <div
          className={s.buttonContainer}
          onTouchTap={this.handleTouchTap}
        >
          {children}
        </div>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <Menu
            className={s.menu}
          >
            <Link
              to={icalUrl}
              useAhref
              external
            >
              <MenuItem primaryText="iCal" />
            </Link>
            <Link
              to={googleUrl}
              useAhref
              external
            >
              <MenuItem primaryText="Google Calendar" />
            </Link>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default AddToCalendar;
