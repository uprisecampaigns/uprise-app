import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from 'reducers/root';
import apolloClient from 'store/apolloClient';

// eslint-disable-next-line no-unused-vars
const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      apolloClient.middleware(),
      thunkMiddleware,
      // loggerMiddleware
    ),
  );
}
