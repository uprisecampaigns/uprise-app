import React from 'react';
import { render, shallow, mount } from 'enzyme';

import SignupRegisterLogin from './SignupRegisterLogin';


describe('(Component) SignupRegisterLogin', () => {
  test('renders without exploding', () => {
    
    const action = {
      title: 'An Event',
      description: 'A test event',
      start_time: new Date(),
      end_time: new Date(),
    };
    const wrapper = shallow(<SignupRegisterLogin event={action}/>);
    expect(wrapper).toHaveLength(1);
  });
});
