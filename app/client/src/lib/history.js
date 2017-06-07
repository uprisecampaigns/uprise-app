
import createBrowserHistory from 'history/createBrowserHistory';

// Navigation manager, e.g. history.push('/home')
// https://github.com/mjackson/history
export default createBrowserHistory({
  getUserConfirmation(message, callback) {
    // NOOP
  }
});
