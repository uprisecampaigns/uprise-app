import React from 'react';
import { render, shallow, mount } from 'enzyme';

import configureStore from 'store/configureStore';

import ImageUploader from './ImageUploader';

const store = configureStore();

describe('(Component) ImageUploader', () => {
  test('renders without exploding', () => {
    const wrapper = shallow(<ImageUploader store={store}/>);
    expect(wrapper).to.have.lengthOf(1);
  });
});
