import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import UniversalRouter from 'universal-router';
import queryString from 'query-string';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import RedBox from 'redbox-react';

import App from 'components/App';

import configureStore from 'store/configureStore';
import apolloClient from 'store/apolloClient';

import { checkSessionStatus } from 'actions/AuthActions';

import history from 'lib/history';
import routes from 'routes';

const container = document.getElementById('app');

const store = configureStore();

injectTapEventPlugin();

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

let onRenderComplete = function initialRenderComplete(route, location) {

  let scrollX = 0;
  let scrollY = 0;

  const pos = scrollPositionsHistory[location.key];
  if (pos) {
    scrollX = pos.scrollX;
    scrollY = pos.scrollY;
  } else {
    const targetHash = location.hash.substr(1);
    if (targetHash) {
      const target = document.getElementById(targetHash);
      if (target) {
        scrollY = window.pageYOffset + target.getBoundingClientRect().top;
      }
    }
  }

  // Restore the scroll position if it was saved into the state
  // or scroll to top of the page
  window.scrollTo(scrollX, scrollY);
}

// Re-render the app when window.location changes
async function onLocationChange(location) {

  // TODO: Not only does this seem to occasionally get stuck, it also just reeks of code smell
  const fetchingSessionStatus = store.getState().userAuthSession.fetchingAuthUpdate;
  if (!fetchingSessionStatus) {
    store.dispatch(checkSessionStatus());
  }

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
      apolloClient: apolloClient,
      store: store // be wary of using the store in routing considering async updates
    });

    console.log(store);
    console.log(apolloClient);

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    const newTitle = route.title;
    if (document.title != newTitle) {
      document.title = newTitle;
    }

    appInstance = ReactDOM.render(
      <MuiThemeProvider>
        <ApolloProvider client={apolloClient} store={store}>
          <App context={context}>{route.component}</App>
        </ApolloProvider>
      </MuiThemeProvider>,
      container,
      () => onRenderComplete(route, location),
    );
  } catch (error) {
    console.error(error); 

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
    } else {
      // Avoid broken navigation in production mode by a full page reload on error
      // TODO: Send to home page?
      // TODO: production error reporting?
      window.location.reload(true);
    }
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange);
onLocationChange(currentLocation);

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
window.addEventListener('error', (event) => {
  if (process.env.NODE_ENV !== 'production') {
    appInstance = null;
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.render(<RedBox error={event.error} />, container);
  } else {
    // Avoid broken navigation in production mode by a full page reload on error
    // TODO: Send to home page?
    // TODO: production error reporting?
    window.location.reload(true);
  }
});
