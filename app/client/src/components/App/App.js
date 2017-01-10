import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header/Header';

class App extends Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <div>
        <Header name='maxb'/>
      </div>
    ); 
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
