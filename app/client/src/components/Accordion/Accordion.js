import PropTypes from 'prop-types';
import React from 'react';

import FontIcon from 'material-ui/FontIcon';

import s from './Accordion.scss';


class Accordion extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: (props.open ? props.open : false)
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  toggleOpen = () => {
    this.setState(Object.assign({},
      this.state,
      { open: !this.state.open }
    ));
  }


  render() {
    const { title, children, ...props } = this.props;

    return (
      <div className={s.outerContainer}>
        <div 
          className={s.header}
          onClick={this.toggleOpen}
        >
          <div 
            className={s.title}
          >{title}</div>

          <div className={s.toggleButton}>
            <FontIcon 
              className={["material-icons", (this.state.open ? s.toggleButtonOpen : s.toggleButtonClosed)].join(' ')}
            >keyboard_arrow_down</FontIcon>
          </div>
        </div>

        <div className={[s.innerContainer, (this.state.open ? s.open : s.closed)].join(' ')}>
          <div className={s.contentContainer}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Accordion;
