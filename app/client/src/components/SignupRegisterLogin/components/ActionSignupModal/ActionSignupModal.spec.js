import React from 'react';
import { render, shallow, mount } from 'enzyme';

import ConnectedActionSignupModal, { ActionSignupModal }  from './ActionSignupModal';

import configureStore from 'store/configureStore';
const store = configureStore();

describe('(Component) ActionSignupModal', () => {
  test('renders without exploding', () => {
    
    const action = {
      title: 'An Event',
      description: 'A test event',
      start_time: new Date(),
      end_time: new Date(),
    };

    const userObject = {
      first_name: 'First',
      last_name: 'Last',
      email: 'test@test.com'
    };

    const timeWithZone = () => '';
    const dispatch = () => {};
    const signup = () => {};

    const wrapper = shallow(<ActionSignupModal 
      userObject={userObject} 
      action={action} 
      signup={signup}
      dispatch={dispatch}
      timeWithZone={timeWithZone}
    />);

    expect(wrapper).toHaveLength(1);
  });

  test('connected component renders without exploding', () => {
    
    const action = {
      title: 'An Event',
      description: 'A test event',
      start_time: new Date(),
      end_time: new Date(),
    };

    const userObject = {
      first_name: 'First',
      last_name: 'Last',
      email: 'test@test.com'
    };

    const wrapper = shallow(<ConnectedActionSignupModal store={store} />);
    expect(wrapper).toHaveLength(1);
  });
});

