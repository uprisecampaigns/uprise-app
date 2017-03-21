import React from 'react';
import { assert, expect } from 'chai';
import { render, shallow, mount } from 'enzyme';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ConnectedLayout, { Layout } from './Layout';
import configureStore from 'store/configureStore';

import { notify, clear } from 'actions/NotificationsActions';

const store = configureStore();
const muiTheme = getMuiTheme();

const options = {
  context: { store }, 
  childContextTypes: { store: React.PropTypes.object.isRequired } 
}

describe('(Component) Layout', () => {
  it('renders without exploding', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);
    const component = connected.dive();
    expect(component).to.have.lengthOf(1);
    expect(component.find(Snackbar)).to.have.lengthOf(1);
  });

  it('defaults to correct state', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);
    const component = connected.dive();
    expect(component.state('drawerOpen')).to.be.false;
  });

  it('does not display snackbar initially', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: React.PropTypes.object}
    });

    expect(snackbar.instance().props.open).to.be.false;
    expect(snackbar.instance().props.message).to.equal('');
  });

  it('displays snackbar after redux notification', () => {
    store.dispatch(notify('testing'));

    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: React.PropTypes.object}
    });

    expect(snackbar.instance().props.open).to.be.true;
    expect(snackbar.instance().props.message).to.equal('testing');
  });

  it('hides snackbar after redux clear', () => {
    store.dispatch(clear());

    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: React.PropTypes.object}
    });

    expect(snackbar.instance().props.open).to.be.false;
    expect(snackbar.instance().props.message).to.equal('');
  });
});

