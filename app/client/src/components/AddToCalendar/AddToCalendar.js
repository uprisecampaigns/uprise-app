import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import ical from 'ical-generator';

import Link from 'components/Link';

import s from './AddToCalendar.scss';


class AddToCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
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
    
    const cal = ical({
      name: 'Uprise Campaigns Calendar',
      domain: window.location.hostname
    });
 
    const startTime = moment(event.start_time);
    const endTime = moment(event.end_time);

    const location = `${ event.location_name || '' } 
${ event.street_address1 || '' } 
${ event.street_address2 || '' } 
${ event.city || '' }, ${ event.state || '' } ${ event.zipcode || '' } 
 
${ event.location_notes || '' } 
`;

    const eventEvent = cal.createEvent({
      start: startTime.toDate(),
      end: endTime.toDate(),
      summary: event.title,
      description: event.description,
      location,
      status: 'confirmed',
      url: event.public_url
    });

    const icalFilename = event.title + '.ics';

    const icalUrl = 'data:text/calendar;base64,' + btoa(cal.toString());

      // FROM: http://stackoverflow.com/a/21653600/1787596
      // TODO: to send directly to mobile site, use this base url
      // https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE` + 
      `&text=${ encodeURIComponent(event.title) }` + 
      `&dates=${ encodeURIComponent(startTime.toISOString().replace(/-|:|\.\d\d\d/g,"")) }/${ encodeURIComponent(endTime.toISOString().replace(/-|:|\.\d\d\d/g,"")) }` +
      `&details=${ encodeURIComponent(event.description) }` + 
      `&location=${ encodeURIComponent(location) }`;

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
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <Menu
            className={s.menu}
          >
            <a 
              href={icalUrl}
              target="_blank"
              download={icalFilename}
            >
              <MenuItem primaryText="iCal"/>
            </a>      
            <a 
              href={googleUrl}
              target="_blank"
            >
              <MenuItem primaryText="Google Calendar" />
            </a>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default AddToCalendar;
