import ReactGA from 'react-ga';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GOOGLE_UA_ID);
}

export default ReactGA;
