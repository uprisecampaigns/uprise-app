import React from 'react';
import { render, shallow, mount } from 'enzyme';

import SignupRegisterLogin from './SignupRegisterLogin';

import configureStore from 'store/configureStore';
const store = configureStore();

describe('(Component) SignupRegisterLogin', () => {
  test('renders without exploding', () => {
    
    const action = {
      title: 'An Event',
      description: 'A test event',
      start_time: new Date(),
      end_time: new Date(),
    };
    const wrapper = shallow(<SignupRegisterLogin store={store} event={action}/>);
    expect(wrapper).toHaveLength(1);
  });
});
