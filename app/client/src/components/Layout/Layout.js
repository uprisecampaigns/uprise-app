
import React, { PropTypes } from 'react';
import s from './Layout.scss';
import HeaderContainer from 'containers/HeaderContainer';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div>
        <HeaderContainer />
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
