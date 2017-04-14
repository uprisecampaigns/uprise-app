import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';
import Link from './Link';

describe('(Component) Link', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<Link to="http://test.com" external={true} />);

    expect(wrapper).to.have.lengthOf(1);
    expect(wrapper.instance().props.to).to.equal("http://test.com");
    expect(wrapper.instance().props.external).to.equal(true);
  });

  it('adds an http:// to the beginning if the link is "external" and it\'s missing one', () => {
    const wrapper = shallow(<Link to="test.com" useAhref={true} external={true} />);

    const aProps = wrapper.find('a').props();

    expect(aProps.href).to.equal("http://test.com");

  });

  it('doesn\'t add an http:// to the beginning if the link already has one', () => {
    const wrapper1 = shallow(<Link to="test.com" useAhref={true} external={true} />);

    expect(wrapper1.find('a').props().href).to.equal("http://test.com");

    const wrapper2 = shallow(<Link to="https://test.com" useAhref={true} external={true} />);

    expect(wrapper2.find('a').props().href).to.equal("https://test.com");
  });


  it('contains an ahref tag when appropriate', () => {
    const wrapper = shallow(<Link to="http://test.com" useAhref={true} external={true} />);

    expect(wrapper).to.have.exactly(1).descendants('a');
  });

  it('contains a span tag when appropriate', () => {
    const wrapper = shallow(<Link to="/test" useAhref={false}/>);

    expect(wrapper).to.have.exactly(1).descendants('span');
  });

});
