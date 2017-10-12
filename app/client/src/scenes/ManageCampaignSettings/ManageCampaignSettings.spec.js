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
  zipcodeList: ['12345', '12346', '12347'],
};

describe('(Scene) ManageCampaignSettings', () => {
  test('renders without exploding', () => {
    const wrapper = mount(<ManageCampaignSettings />, options);

    expect(wrapper).toHaveLength(1);
  });

  test('parses zipcodeList correctly', () => {
    const wrapper = mount(<ManageCampaignSettings campaign={campaign}/>, options);

    expect(wrapper.state().formData.zipcodeList).toEqual('12345,12346,12347');
  });

  test('submits zipcodeList correctly', (done) => {

    const editCampaignMock = ({ variables }) => {
      expect(variables.data.zipcodeList).toEqual(campaign.zipcodeList);
      done();
    };

    const wrapper = mount(<ManageCampaignSettings editCampaignMutation={editCampaignMock} campaign={campaign}/>, options);

    wrapper.find('form').first().simulate('submit');
  });

  test('submits new zipcodeList correctly', async () => {
    expect.assertions(1);

    const newZipcodeListArray = ['55555', '11111'];
    const newZipcodeListString = '55555, 11111';

    const editCampaignMock = async ({ variables }) => {
      console.log(variables);
      expect(variables.data.zipcodeList).toEqual(newZipcodeListArray);
      return true;
    };

    const wrapper = mount(<ManageCampaignSettings editCampaignMutation={editCampaignMock} campaign={campaign}/>, options);

    const wrapperInstance = wrapper.instance();
    await wrapperInstance.formSubmit({ ...campaign, zipcodeList: newZipcodeListString });
  });
});
