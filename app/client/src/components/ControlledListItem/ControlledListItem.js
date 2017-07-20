import React, { PureComponent, PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';


import s from './ControlledListItem.scss';

class ControlledListItem extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  render() {
    const { open } = this.state;

    const { className, ...props } = this.props;

    const handleTouchTap = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.setState(prevState => ({
        open: !prevState.open,
      }));
    };

    return (
      <ListItem
        open={open}
        className={[className].concat([s.listItem]).join(' ')}
        rightToggle={open ?
          <NavigationExpandLess onTouchTap={handleTouchTap} /> :
          <NavigationExpandMore onTouchTap={handleTouchTap} />
        }
        onTouchTap={handleTouchTap}
        {...props}
      />
    );
  }
}

export default ControlledListItem;
