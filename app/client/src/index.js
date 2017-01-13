import React from 'react';
import ReactDOM from 'react-dom';
import UniversalRouter from 'universal-router';
import createBrowserHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

import RedBox from 'redbox-react';

import App from './components/App';

import routes from './routes';

const history = createBrowserHistory();

const container = document.getElementById('app');

let appInstance;
let currentLocation = history.location;

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
};

let onRenderComplete = function initialRenderComplete() {
  console.log('render complete');
}

// Re-render the app when window.location changes
async function onLocationChange(location) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await UniversalRouter.resolve(routes, {
      path: location.pathname,
      query: queryString.parse(location.search),
    });

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    appInstance = ReactDOM.render(
      <App context={context}>{route.component}</App>,
      container,
      () => onRenderComplete(route, location),
    );
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    // Current url has been changed during navigation process, do nothing
    if (currentLocation.key !== location.key) {
      return;
    }

    // Display the error in full-screen for development mode
    if (process.env.NODE_ENV !== 'production') {
      appInstance = null;
      document.title = `Error: ${error.message}`;
      ReactDOM.render(<RedBox error={error} />, container);
      return;
    }

    // Avoid broken navigation in production mode by a full page reload on error
    window.location.reload();
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange);
onLocationChange(currentLocation);


