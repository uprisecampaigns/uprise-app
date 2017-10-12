
/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('App', () => {

  test('renders children correctly', () => {
    const wrapper = shallow(
      <App context={{ insertCss: () => {} }}>
        <div className="child" />
      </App>
    );

    expect(wrapper.contains(<div className="child" />)).toBe.true;
  });

});
