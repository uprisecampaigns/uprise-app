import React from 'react';
import { render, shallow, mount } from 'enzyme';

import { Provider } from 'react-redux';

import configureStore from 'store/configureStore';
import ComposeMessage from './ComposeMessage';

const store = configureStore();

describe('(Component) ComposeMessage', () => {
  test('renders without exploding', () => {
    const wrapper = shallow(<ComposeMessage store={store}/>);
    expect(wrapper).toHaveLength(1);
  });
});
