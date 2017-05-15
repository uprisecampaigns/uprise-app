import moment from 'moment-timezone';
import zipcodeToTimezone from 'zipcode-to-timezone';

export default function timeWithZone (date, zipcode, formatString) {
  const timezone = (zipcode && zipcodeToTimezone.lookup(zipcode)) ? zipcodeToTimezone.lookup(zipcode) : 'America/New_York';
  
  return moment(date).tz(timezone).format(formatString);
}
