import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';
import ComposeMessage from './ComposeMessage';

describe('(Component) ComposeMessage', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<ComposeMessage />);
    expect(wrapper).to.have.lengthOf(1);
  });
});
