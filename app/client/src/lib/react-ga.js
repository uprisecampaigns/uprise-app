import ReactGA from 'react-ga';

if (process.env.NODE_ENV !== 'test') {
  ReactGA.initialize(process.env.GOOGLE_UA_ID);
}

export default ReactGA;
