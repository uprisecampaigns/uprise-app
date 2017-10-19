import moment from 'moment-timezone';

export default function itemsSort(sortBy) {
  return function compare(a, b) {
    if (sortBy.name === 'date') {
      // When sorting by date, ongoing roles always go first
      if (a.ongoing || b.ongoing) {
        // If both are ongoing, secondary sort by created_at
        if (a.ongoing && b.ongoing &&
            typeof a.created_at === 'string' && typeof b.created_at === 'string') {
          return moment(a.created_at).isBefore(moment(b.created_at)) ? 1 : -1;
        }

        return a.ongoing ? -1 : 1;
      }
      if (sortBy.descending) {
        return moment(a.start_time).isBefore(moment(b.start_time)) ? 1 : -1;
      }
      return moment(a.start_time).isAfter(moment(b.start_time)) ? 1 : -1;
    } else if (sortBy.name === 'campaignName') {
      if (sortBy.descending) {
        return (a.campaign.title.toLowerCase() < b.campaign.title.toLowerCase()) ? 1 : -1;
      }
      return (a.campaign.title.toLowerCase() > b.campaign.title.toLowerCase()) ? 1 : -1;
    }

    const prop = sortBy.name;

    const testA = (typeof a[prop] === 'string') ? a[prop].toLowerCase() : a[prop];
    const testB = (typeof b[prop] === 'string') ? b[prop].toLowerCase() : b[prop];

    if (sortBy.descending) {
      return (testA < testB) ? 1 : -1;
    }
    return (testA > testB) ? 1 : -1;
  };
}
