import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

// eslint-disable-next-line import/extensions
import UniversalRouter from 'universal-router';
import queryString from 'query-string';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import bowser from 'bowser';

import RedBox from 'redbox-react';

import App from 'components/App';

import configureStore from 'store/configureStore';
import apolloClient from 'store/apolloClient';

import {
  defaultCampaignStartState,
  defaultActionStartState,
} from 'reducers/SearchReducer';

import {
  defaultHomeNavStartState,
} from 'reducers/PageNavReducer';

import { checkSessionStatus } from 'actions/AuthActions';
import {
  startPageLoad,
  endPageLoad,
  attemptNavFromDirtyForm,
} from 'actions/NotificationsActions';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import history from 'lib/history';
import ReactGA from 'lib/react-ga';
import routes from 'routes';

import { sentryDsn } from 'config/config';

import Raven from 'raven-js';

Raven.config(sentryDsn).install();

const container = document.getElementById('app');

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  // Delay registration until after the page has loaded, to ensure that our
  // precaching requests don't degrade the first visit experience.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then((reg) => {
      // updatefound is fired if service-worker.js changes.
      // eslint-disable-next-line no-param-reassign
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // TODO: sure we need to do a hard reload here?
                window.setTimeout(() => {
                  window.location.reload(true);
                }, 100);
              }
              break;

            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;

            default:
              break;
          }
        };
      };
    }).catch((e) => {
      console.error('Error during service worker registration:', e);
    });
  });
}

const store = configureStore({
  actionsSearch: defaultActionStartState,
  campaignsSearch: defaultCampaignStartState,
  homePageNav: defaultHomeNavStartState,
});

injectTapEventPlugin();

// eslint-disable-next-line no-unused-vars
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

const onRenderComplete = function initialRenderComplete(route, location) {
  store.dispatch(endPageLoad());

  let scrollX = 0;
  let scrollY = 0;

  const pos = scrollPositionsHistory[location.key];
  if (pos) {
    ({ scrollX, scrollY } = pos);
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
  window.setTimeout(() => {
    window.scrollTo(scrollX, scrollY);
  }, 10);
};

// Re-render the app when window.location changes
async function onLocationChange(location) {
  try {
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

    store.dispatch(startPageLoad());

    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const router = new UniversalRouter(routes);
    const route = await router.resolve({
      pathname: location.pathname,
      query: queryString.parse(location.search),
      apolloClient,
      store, // be wary of using the store in routing considering async updates
    });

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    const newTitle = route.title;
    if (document.title !== newTitle) {
      document.title = newTitle;
    }

    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);

    // Hack for samsung browsers which aren't well suported by the
    // inline-style-prefixer library that material-ui uses
    const userAgent = bowser.samsungBrowser ? 'all' : undefined;

    appInstance = ReactDOM.render(
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme, { userAgent })}>
        <ApolloProvider client={apolloClient} store={store}>
          <App
            pageTitle={route.pageTitle}
            title={route.title}
            description={route.description}
            context={context}
            url={window.location.href}
            image={route.image}
          >
            {route.component}
          </App>
        </ApolloProvider>
      </MuiThemeProvider>,
      container,
      () => onRenderComplete(route, location),
    );
  } catch (error) {
    Raven.captureException(error, {
      extra: {
        state: store.getState(),
      },
    });

    window.console && console.error && console.error(error);

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
    // TODO: Send to home page? I'm nervous about a permanent reload loop...
    window.location.reload(true);
  }
}

history.block((location, action) => {
  if (!store.getState().notifications.formStateClean) {
    store.dispatch(attemptNavFromDirtyForm(location.pathname));
    // This just needs to return a string in order to tell the history API to block
    return 'unsaved changes';
  }
  return undefined;
});

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange);
onLocationChange(currentLocation);

// We can prefetch these basic queries because they're integral to UI performance
apolloClient.query({ query: ActivitiesQuery });
