import React from 'react';
import { render, shallow, mount } from 'enzyme';

import ConnectedRegisterLogin, { RegisterLogin }  from './RegisterLogin';

import configureStore from 'store/configureStore';
const store = configureStore();

describe('(Component) RegisterLogin', () => {
  test('renders without exploding', () => {
    
    const termsContent = {};

    const signupError = '';

    const formType = 'register';

    const dispatch = () => {};

    const wrapper = shallow(<RegisterLogin 
      termsContent={termsContent} 
      signupError={signupError} 
      formType={formType}
      dispatch={dispatch}
    />);

    expect(wrapper).toHaveLength(1);
  });

  test('connected component renders without exploding', () => {
    const wrapper = shallow(<ConnectedRegisterLogin store={store} type="register" />);
    expect(wrapper).toHaveLength(1);
  });
});

