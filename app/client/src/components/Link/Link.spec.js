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

  it('contains an ahref tag when appropriate', () => {
    const wrapper = shallow(<Link to="http://test.com" useAhref={true} external={true} />);

    expect(wrapper).to.have.exactly(1).descendants('a');
  });

  it('contains a span tag when appropriate', () => {
    const wrapper = shallow(<Link to="/test" useAhref={false}/>);

    expect(wrapper).to.have.exactly(1).descendants('span');
  });

});
