import moment from 'moment-timezone';

export default function itemsSort (sortBy) {
  return function compare (a, b) {
    if (sortBy.name === 'date') {
      // When sorting by date, ongoing roles always go last
      if (a.ongoing || b.ongoing) {
        return a.ongoing ? 1 : -1;
      }
      if (sortBy.descending) {
        return moment(a.start_time).isBefore(moment(b.start_time)) ? 1 : -1;
      } else {
        return moment(a.start_time).isAfter(moment(b.start_time)) ? 1 : -1;
      }
    } else if (sortBy.name === 'campaignName') {
      if (sortBy.descending) {
        return (a.campaign.title.toLowerCase() < b.campaign.title.toLowerCase()) ? 1 : -1;
      } else {
        return (a.campaign.title.toLowerCase() > b.campaign.title.toLowerCase()) ? 1 : -1;
      }
    } else {

      const prop = sortBy.name;

      const testA = (typeof a[prop] === 'string') ? a[prop].toLowerCase() : a[prop];
      const testB = (typeof b[prop] === 'string') ? b[prop].toLowerCase() : b[prop];

      if (sortBy.descending) {
        return (testA < testB) ? 1 : -1;
      } else {
        return (testA > testB) ? 1 : -1;
      } 
    }
  }
}
