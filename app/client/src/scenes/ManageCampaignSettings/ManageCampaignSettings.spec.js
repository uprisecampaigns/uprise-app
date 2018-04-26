import React from 'react';
import PropTypes from 'prop-types';
import { render, shallow, mount } from 'enzyme';
import { FormWrapper } from 'lib/formWrapper';
import ConnectedManageCampaignSettings, { ManageCampaignSettings } from './ManageCampaignSettings';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import configureStore from 'store/configureStore';

const store = configureStore();
const muiTheme = getMuiTheme();

const options = {
  context: { store, muiTheme },
  childContextTypes: { store: PropTypes.object.isRequired, muiTheme: PropTypes.object }
}

const campaign = {
  title: 'Test Campaign',
  streetAddress: '1234 Main ST',
  websiteUrl: 'http://test.com',
  phoneNumber: '5555555555',
  email: 'test@test.com',
  city: 'New York',
  state: 'NY',
  zipcode: '12345',
  tags: [],
};

describe('(Scene) ManageCampaignSettings', () => {
  test('renders without exploding', () => {
    const wrapper = mount(<ManageCampaignSettings />, options);

    expect(wrapper).toHaveLength(1);
  });
});
