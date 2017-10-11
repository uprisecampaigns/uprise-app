import React from 'react';
import { render, shallow, mount } from 'enzyme';
import Link from './Link';

describe('(Component) Link', () => {
  test('renders without exploding', () => {
    const wrapper = shallow(<Link to="http://test.com" external={true} />);

    expect(wrapper).toHaveLength(1);
    console.log(wrapper.props());
    // console.log(wrapper.instance().props());
    expect(wrapper.instance().props().to).toEqual("http://test.com");
    expect(wrapper.instance().props().external).toEqual(true);
  });

  test(
    'adds an http:// to the beginning if the link is "external" and it\'s missing one',
    () => {
      const wrapper = shallow(<Link to="test.com" useAhref={true} external={true} />);

      const aProps = wrapper.find('a').props();

      expect(aProps.href).toEqual("http://test.com");

    }
  );

  test(
    'doesn\'t add an http:// to the beginning if the link already has one',
    () => {
      const wrapper1 = shallow(<Link to="test.com" useAhref={true} external={true} />);

      expect(wrapper1.find('a').props().href).toEqual("http://test.com");

      const wrapper2 = shallow(<Link to="https://test.com" useAhref={true} external={true} />);

      expect(wrapper2.find('a').props().href).toEqual("https://test.com");
    }
  );


  test('contains an ahref tag when appropriate', () => {
    const wrapper = shallow(<Link to="http://test.com" useAhref={true} external={true} />);

    expect(wrapper).to.have.exactly(1).descendants('a');
  });

  test('contains a span tag when appropriate', () => {
    const wrapper = shallow(<Link to="/test" useAhref={false}/>);

    expect(wrapper).to.have.exactly(1).descendants('span');
  });

});
