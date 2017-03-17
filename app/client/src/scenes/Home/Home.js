import React, { PropTypes } from 'react';

class Home extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <h1>Home</h1>
        <h2>Title: {this.props.title}</h2>
      </div>
    );
  }
}

export default Home;
