import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import camelCase from 'camelcase';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';

import ActivitiesQuery from 'schemas/queries/ActivitiesQuery.graphql';

import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateState,
  validateZipcode,
  validateStartEndTimes,
} from 'lib/validateComponentForms';

import ActionProfile from 'components/ActionProfile';
import ActionSettingsForm from 'components/ActionSettingsForm';
import ActionProfileForm from 'components/ActionProfileForm';
import ShiftScheduler from 'components/ShiftScheduler';

import s from 'styles/Organize.scss';


const WrappedActionSettingsForm = formWrapper(ActionSettingsForm);
const WrappedActionProfileForm = formWrapper(ActionProfileForm);

class ActionSettingsContainer extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    campaign: PropTypes.object.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
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
      shifts: [],
      activities: [],
      tags: [],
      startTime: undefined,
      endTime: undefined,
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 0,
      formData: {
        ...ActionSettingsContainer.defaultProps.action,
        ongoing: (props.type === 'role'),
      }
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

      const shifts = [...action.shifts];
      if (action.startTime && moment(action.startTime).isValid() && action.endTime && moment(action.endTime).isValid()) {
        shifts.push({
          start: action.startTime,
          end: action.endTime,
        });
      }

      action.shifts = [...action.shifts, ...shifts];

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

    if (formData.ongoing) {
      this.setState({ formData, stepIndex: 1 });
    } else {
      this.setState({ formData });
      this.shiftScheduler.formSubmit();
    }

    return {
      success: true,
      message: false,
    };
  }

  shiftSubmit = (data) => {
    const formData = { ...this.state.formData, ...data };
    this.setState({ formData, stepIndex: 1 });
  }


  profileSubmit = async (data) => {
    const formData = { ...this.state.formData, ...data };

    this.setState({ formData, stepIndex: 2 });

    return {
      success: true,
      message: false,
    };
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
      console.log(this.actionSettingsForm);
      this.actionSettingsForm.wrappedInstance.formSubmit();
    } else if (stepIndex === 1) {
      console.log(this.actionProfileForm);
      console.log(this.actionProfileForm.wrappedInstance);
      this.actionProfileForm.wrappedInstance.formSubmit();
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
    const { defaultErrorText, renderStepActions, shiftSubmit, profileSubmit, settingsSubmit } = this;
    const { formData, stepIndex } = this.state;
    const { campaign, activities } = this.props;

    const activityDetails = formData.activities.map(activity => {
      const activityMatch = activities.find(a => a.id === activity.id);
      return {
        id: activity.id,
        title: activityMatch.title,
        description: activityMatch.description,
      }
    });

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
                Basic Info
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
                Details
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
                Preview
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
            <div>
              <WrappedActionSettingsForm
                initialState={formData}
                initialErrors={defaultErrorText}
                validators={settingsValidators}
                submit={settingsSubmit}
                ref={(form) => { this.actionSettingsForm = form; }}
              />

              { !formData.ongoing && (
                <ShiftScheduler
                  data={formData}
                  submit={shiftSubmit}
                  ref={(scheduler) => { this.shiftScheduler = scheduler; }}
                />
              )}
            </div>
          }

          { stepIndex === 1 &&
            <div>
              <WrappedActionProfileForm
                initialState={formData}
                initialErrors={defaultErrorText}
                validators={[]}
                submit={profileSubmit}
                ref={(form) => { this.actionProfileForm = form; }}
              />
            </div>
          }

          { stepIndex === 2 &&
            <ActionProfile
              signup={() => {}}
              cancelSignup={() => {}}
              action={{
                ...formData,
                campaign,
                activities: activityDetails
              }}
              saving={false}
            />
          }
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(ActivitiesQuery, {
    props: ({ data }) => ({
      activities: !data.loading && data.activities ? data.activities : [],
    }),
  })
)(ActionSettingsContainer);
