import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';
import ImageUploader from './ImageUploader';

describe('(Component) ImageUploader', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<ImageUploader />);
    expect(wrapper).to.have.lengthOf(1);
  });
});
