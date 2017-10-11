import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import history from 'lib/history';

import states from 'lib/states-list';

import {
  notify,
  dirtyForm,
  cleanForm,
} from 'actions/NotificationsActions';


const statesList = Object.keys(states);

export default (WrappedComponent) => {
  class FormWrapper extends React.Component {
    static propTypes = {
      initialState: PropTypes.object.isRequired,
      initialErrors: PropTypes.object.isRequired,
      submit: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      validators: PropTypes.arrayOf(PropTypes.func).isRequired,
    }

    constructor(props) {
      super(props);

      this.state = {
        formData: props.initialState,
        errors: props.initialErrors,
        refs: {},
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.initialState && !this.state.saving) {
        this.setState({
          formData: Object.assign({}, nextProps.initialState),
        });
      }
    }

    resetErrorText = () => {
      this.setState({ errors: this.props.initialErrors });
    }

    cancel = (event) => {
      event.preventDefault();
      this.props.dispatch(cleanForm());
      history.goBack();
    }

    handleInputChange = (event, type, value) => {
      let valid = true;
      let newValue = value;

      if (type === 'state' || type === 'locationState') {
        valid = false;

        statesList.forEach((state) => {
          if (state.toLowerCase().includes(value.toLowerCase())) {
            valid = true;
          }
        });
        newValue = value.toUpperCase();

        // Hack for AutoComplete
        if (!valid) {
          // TODO: `stateInput` should probably be some sort of parameter/variable
          this.state.refs.stateInput.setState({ searchText: this.state.formData[type] });
        }
      }

      if (valid) {
        this.props.dispatch(dirtyForm());

        this.setState(prevState => ({
          formData: Object.assign({},
            prevState.formData,
            { [type]: newValue },
          ),
        }));
      }
    }

    handleToggle = (collectionName, on, id) => {
      const oldCollection = Array.from(this.state.formData[collectionName]);
      let newCollection;

      if (on) {
        newCollection = oldCollection.concat({ id });
      } else {
        newCollection = oldCollection.filter(item => item.id !== id);
      }

      this.props.dispatch(dirtyForm());

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, { [collectionName]: newCollection }),
      }));
    }

    addItem = (collectionName, tag) => {
      const tags = Array.from(this.state.formData.tags);

      if ((typeof tag === 'string' &&
            tag.trim() !== '' &&
            !tags.find(item => item.toLowerCase() === tag.toLowerCase()))) {
        tags.push(tag);
      }

      this.props.dispatch(dirtyForm());

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, { tags }),
      }));
    }

    removeItem = (collectionName, tagToRemove) => {
      this.props.dispatch(dirtyForm());

      this.setState(prevState => ({
        formData: Object.assign({}, prevState.formData, {
          tags: prevState.formData.tags.filter(tag => tag.toLowerCase() !== tagToRemove.toLowerCase()),
        }),
      }));
    }

    formSubmit = async (event) => {
      (typeof event === 'object' && typeof event.preventDefault === 'function') && event.preventDefault();

      this.hasErrors = false;
      this.resetErrorText();

      for (const validator of this.props.validators) {
        await validator(this);
      }

      const notifyError = (message) => {
        this.props.dispatch(notify(message ||
          'There was an error with your request. Please reload the page or contact help@uprise.org for support.',
        ));
      };

      if (!this.hasErrors && !this.state.saving) {
        try {
          this.setState({ saving: true });

          const result = await this.props.submit(this.state.formData);

          if (result.success) {
            this.props.dispatch(notify(result.message || 'Success'));
          } else {
            notifyError(result.message);
          }

          this.props.dispatch(cleanForm());
          this.setState({ saving: false });
        } catch (e) {
          console.error(e);
          notifyError(e.message);
          this.props.dispatch(dirtyForm());
          this.setState({ saving: false });
        }
      }
    }

    render() {
      const {
        cancel, handleInputChange, addItem, removeItem,
        handleToggle, formSubmit,
      } = this;

      const { formData, saving, errors, refs } = this.state;

      return (
        <WrappedComponent
          data={formData}
          saving={saving}
          cancel={cancel}
          errors={errors}
          refs={refs}
          formSubmit={formSubmit}
          handleInputChange={handleInputChange}
          addItem={addItem}
          removeItem={removeItem}
          handleToggle={handleToggle}
          {...this.props}
        />
      );
    }
  }
  return connect()(FormWrapper);
};

