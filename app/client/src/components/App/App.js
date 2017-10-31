import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import 'styles/fonts-loader.scss';

import upriseLogoIcon from 'img/uprise-logo-icon.png';

const ContextType = {
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    pageTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    image: PropTypes.string,
  };

  static defaultProps = {
    image: upriseLogoIcon,
  }

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    const {
      title, pageTitle, description,
      url, image,
    } = this.props;

    return (
      <div>
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content="UpRise.org" />
          <meta name="twitter:card" content={description} />
          <meta name="twitter:site" content="@uprisedotorg" />
          <meta name="twitter:url" content={url} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />
        </Helmet>

        { React.Children.only(this.props.children) }

      </div>
    );
  }
}

export default App;
