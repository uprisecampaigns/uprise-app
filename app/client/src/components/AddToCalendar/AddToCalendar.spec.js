import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';

import AddToCalendar from './AddToCalendar';


describe('(Component) AddToCalendar', () => {
  it('renders without exploding', () => {
    
    const action = {
      title: 'An Event',
      description: 'A test event',
      start_time: new Date(),
      end_time: new Date(),
    };
    const wrapper = shallow(<AddToCalendar event={action}/>);
    expect(wrapper).to.have.lengthOf(1);
  });
});
