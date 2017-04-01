import React, { PropTypes } from 'react';
import history from 'lib/history';

import states from 'lib/states-list';


const statesList = Object.keys(states);

export default (WrappedComponent) => {

  class OrganizeFormWrapper extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        formData: props.initialState,
        errors: props.initialErrors,
        refs: {}
      };
    }

    static PropTypes = {
      initialState: PropTypes.object.isRequired,
      initialErrors: PropTypes.object.isRequired,
      submit: PropTypes.func.isRequired,
      validators: PropTypes.array.isRequired
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.initialState && !nextProps.saving) {

        this.setState({
          formData: Object.assign({}, nextProps.initialState)
        });
      } 
    }

    resetErrorText = () => {
      this.setState({ errors: this.props.initialErrors });
    }

    cancel = (event) => {
      event.preventDefault();
      history.goBack();
    }

    handleInputChange = (event, type, value) => {
      let valid = true;

      if (type === 'state' || type === 'locationState') {
        valid = false;

        statesList.forEach( (state) => {
          if (state.toLowerCase().includes(value.toLowerCase())) {
            valid = true;
          }
        });
        value = value.toUpperCase();
        
        // Hack for AutoComplete
        if (!valid) {
          // TODO: `stateInput` should probably be some sort of parameter/variable
          this.state.refs.stateInput.setState({ searchText: this.state.formData[type] });
        }
      } 

      if (valid) {
        this.setState( (prevState) => ({
          formData: Object.assign({},
            prevState.formData,
            { [type]: value }
          )
        }));
      } 
    }

    formSubmit = (event) => {
      (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

      this.hasErrors = false;
      this.resetErrorText();

      this.props.validators.forEach( (validator) => validator(this) );

      if (!this.hasErrors) {
        this.props.submit(this.state.formData); 
      }
    }

    render() {
      const { cancel, handleInputChange, formSubmit } = this;
      const { formData, errors, refs, ...state } = this.state;

      return (
        <WrappedComponent 
          data={formData}
          cancel={cancel}
          errors={errors}
          refs={refs}
          formSubmit={formSubmit}
          handleInputChange={handleInputChange}
          {...this.props} 
        />
      );
    }
  }
  return OrganizeFormWrapper;
}

