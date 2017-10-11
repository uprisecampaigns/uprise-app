import PropTypes from 'prop-types';
import React from 'react';
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
  childContextTypes: { store: PropTypes.object.isRequired } 
}

describe('(Component) Layout', () => {
  test('renders without exploding', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);
    const component = connected.dive();
    expect(component).toHaveLength(1);
    expect(component.find(Snackbar)).toHaveLength(1);
  });

  test('defaults to correct state', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);
    const component = connected.dive();
    expect(component.state('drawerOpen')).toBe.false;
  });

  test('does not display snackbar initially', () => {
    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: PropTypes.object}
    });

    expect(snackbar.instance().props.open).toBe.false;
    expect(snackbar.instance().props.message).toEqual('');
  });

  test('displays snackbar after redux notification', () => {
    store.dispatch(notify('testing'));

    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: PropTypes.object}
    });

    expect(snackbar.instance().props.open).toBe.true;
    expect(snackbar.instance().props.message).toEqual('testing');
  });

  test('hides snackbar after redux clear', () => {
    store.dispatch(clear());

    const connected = shallow(<ConnectedLayout><div></div></ConnectedLayout>, options);

    const snackbar = connected.dive().find(Snackbar).dive({
      context: {muiTheme},
      childContextTypes: {muiTheme: PropTypes.object}
    });

    expect(snackbar.instance().props.open).toBe.false;
    expect(snackbar.instance().props.message).toEqual('');
  });
});

