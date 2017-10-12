import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import camelCase from 'camelcase';

import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';


import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateState,
  validateZipcode,
  validateStartEndTimes,
} from 'lib/validateComponentForms';

import ActionSettingsForm from 'components/ActionSettingsForm';
import ShiftScheduler from 'components/ShiftScheduler';

import s from 'styles/Organize.scss';


import ReviewDetails from './components/ReviewDetails';

const WrappedActionSettingsForm = formWrapper(ActionSettingsForm);

class ActionSettingsContainer extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    action: PropTypes.object,
  }

  static defaultProps = {
    action: {
      title: '',
      internalTitle: '',
      virtual: false,
      locationName: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipcode: '',
      locationNotes: '',
      ongoing: false,
      shifts: [],
      startTime: undefined,
      endTime: undefined,
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 0,
      formData: ActionSettingsContainer.defaultProps.action,
    };
  }

  componentWillMount() {
    this.handleActionProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleActionProps(nextProps);
  }

  handleActionProps = (nextProps) => {
    if (nextProps.action && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null
      const action = Object.assign(...Object.keys(nextProps.action).map((k) => {
        if (nextProps.action[k] !== null) {
          return { [camelCase(k)]: nextProps.action[k] };
        }
        return undefined;
      }));

      // Handle date/time
      const newDateTimes = {
        startTime: action.startTime && moment(action.startTime).isValid() ? moment(action.startTime).toDate() : undefined,
        endTime: action.endTime && moment(action.endTime).isValid() ? moment(action.endTime).toDate() : undefined,
      };

      delete action.startTime;
      delete action.endTime;

      this.setState(prevState => ({
        formData: { ...prevState.formData, ...newDateTimes },
      }));

      Object.keys(action).forEach((k) => {
        if (!Object.keys(ActionSettingsContainer.defaultProps.action).includes(camelCase(k))) {
          delete action[k];
        }
      });

      this.setState(prevState => ({
        formData: { ...prevState.formData, ...action },
      }));
    }
  }

  defaultErrorText = {
    titleErrorText: null,
    internalTitleErrorText: null,
    locationNameErrorText: null,
    locationNotesErrorText: null,
    streetAddressErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
    dateErrorText: null,
    startTimeErrorText: null,
    endTimeErrorText: null,
  }

  settingsSubmit = async (data) => {
    const formData = { ...this.state.formData, ...data };
    this.setState({ formData, stepIndex: 1 });
    return {
      success: true,
      message: 'Please fill out dates and shifts',
    };
  }

  shiftSubmit = (data) => {
    const formData = { ...this.state.formData, ...data };
    this.setState({ formData, stepIndex: 2 });
  }

  submit = () => {
    // this.setState({
    //   formData: { ...data },
    // });

    // this.props.submit(data);
  }

  handlePrev = () => {
    if (this.state.stepIndex > 0) {
      this.setState(prevState => ({ ...prevState,
        stepIndex: prevState.stepIndex - 1,
      }));
    }
  }

  toggleOngoing = (ongoing) => {
    this.setState((prevState) => ({
      formData: { ...prevState.formData, ongoing }
    }));
  }

  handleNext = () => {
    const { formData, stepIndex } = this.state;

    if (stepIndex === 0) {
      console.log(this);
      console.log(this.wrappedActionSettingsForm);
      this.wrappedActionSettingsForm.wrappedInstance.formSubmit();
    } else if (stepIndex === 1 && !formData.ongoing) {
      this.shiftScheduler.formSubmit();
    } else if (stepIndex === 1 && formData.ongoing) {
      this.setState({ formData, stepIndex: 2 });
    } else if (stepIndex === 2) {
      this.props.submit(this.state.formData);
    }
  };

  renderStepActions = (step) => {
    const { stepIndex } = this.state;

    return (
      <div>
        <RaisedButton
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          disableTouchRipple
          disableFocusRipple
          primary
          onClick={this.handleNext}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple
            disableFocusRipple
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const { defaultErrorText, renderStepActions, shiftSubmit, settingsSubmit } = this;
    const { formData, stepIndex } = this.state;


    const settingsValidators = [
      (component) => { validateString(component, 'title', 'titleErrorText', 'Opportunity Name is Required'); },
      (component) => { validateState(component); },
      (component) => { validateZipcode(component); },
    ];

    return (
      <div className={s.stepperOuterContainer}>
        <div className={s.stepperContainer}>
          <Stepper
            activeStep={stepIndex}
            orientation="vertical"
            className={s.stepper}
          >
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 0 })}>
                Details
              </StepButton>
              <StepContent>
                <p>
                  Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
                {renderStepActions(0)}
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                Opportunity Type
              </StepButton>
              <StepContent>
                <p>
                  Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
                {renderStepActions(1)}
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                Review
              </StepButton>
              <StepContent>
                <p>
                  Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
                {renderStepActions(2)}
              </StepContent>
            </Step>
          </Stepper>
        </div>

        <div className={s.stepperContentContainer}>
          { stepIndex === 0 &&
            <WrappedActionSettingsForm
              initialState={formData}
              initialErrors={defaultErrorText}
              validators={settingsValidators}
              submit={settingsSubmit}
              ref={(wrappedForm) => { this.wrappedActionSettingsForm = wrappedForm; }}
            />
          }

          { stepIndex === 1 &&
            <div>
              <div className={s.opportunityTypeToggleContainer}>
                <RaisedButton
                  label="Role"
                  disableTouchRipple
                  disableFocusRipple
                  primary={formData.ongoing}
                  onClick={() => this.toggleOngoing(true)}
                />

                <RaisedButton
                  label="Event"
                  disableTouchRipple
                  disableFocusRipple
                  primary={!formData.ongoing}
                  onClick={() => this.toggleOngoing(false)}
                />
              </div>

              { formData.ongoing ? (
                <div>Role</div>
              ) : 
                <ShiftScheduler
                  data={formData}
                  submit={shiftSubmit}
                  ref={(scheduler) => { this.shiftScheduler = scheduler; }}
                />
              }
            </div>
          }

          { stepIndex === 2 &&
            <ReviewDetails action={formData} />
          }
        </div>
      </div>
    );
  }
}

export default compose(
  connect(),
)(ActionSettingsContainer);
