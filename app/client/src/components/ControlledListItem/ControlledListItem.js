import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ListItem } from 'material-ui/List';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';

import s from './ControlledListItem.scss';

class ControlledListItem extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    initiallyOpen: PropTypes.bool,
  };

  static defaultProps = {
    initiallyOpen: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.initiallyOpen,
    };
  }

  render() {
    const { open } = this.state;

    const { className, ...props } = this.props;

    const handleClick = (event) => {
      console.log('test', props, this.props);
      event.preventDefault();
      event.stopPropagation();
      this.setState((prevState) => ({
        open: !prevState.open,
      }));
    };

    return (
      <ListItem open={open} className={[className].concat([s.listItem]).join(' ')} onClick={handleClick} {...props} />
    );
  }
}

export default ControlledListItem;
