import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';

import configureStore from 'store/configureStore';

import CsvUploader from './CsvUploader';

const store = configureStore();

describe('(Component) CsvUploader', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<CsvUploader store={store}/>);
    expect(wrapper).to.have.lengthOf(1);
  });
});
