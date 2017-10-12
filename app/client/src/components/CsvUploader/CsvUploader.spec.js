import React from 'react';
import { render, shallow, mount } from 'enzyme';

import configureStore from 'store/configureStore';

import CsvUploader from './CsvUploader';

const store = configureStore();

describe('(Component) CsvUploader', () => {
  test('renders without exploding', () => {
    const wrapper = shallow(<CsvUploader store={store}/>);
    expect(wrapper).toHaveLength(1);
  });
});
