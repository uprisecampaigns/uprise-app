import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';

import Link from 'components/Link';

import history from 'lib/history';
import formWrapper from 'lib/formWrapper';
import {
  validateString,
  validateState,
  validateZipcode,
  validateStartEndTimes,
} from 'lib/validateComponentForms';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';

import CreateActionMutation from 'schemas/mutations/CreateActionMutation.graphql';

import ActionSettingsForm from 'components/ActionSettingsForm';
import ShiftScheduler from 'components/ShiftScheduler';

import s from 'styles/Organize.scss';


const WrappedActionSettingsForm = formWrapper(ActionSettingsForm);
const WrappedShiftScheduler = formWrapper(ShiftScheduler);

class CreateAction extends Component {
  static propTypes = {
    createActionMutation: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    campaignId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    campaign: undefined,
  }

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
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
        date: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      modalOpen: false,
      newAction: {
        title: '',
        slug: '',
      },
      stepIndex: 0,
    };

    this.state = Object.assign({}, initialState);
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

  createAction = async () => {
    const actionData = { ...this.state.formData, campaignId: this.props.campaignId };

    try {
      const results = await this.props.createActionMutation({
        variables: {
          data: actionData,
        },
        refetchQueries: ['SearchActionsQuery'],
      });
      this.setState({
        modalOpen: true,
        newAction: results.data.createAction,
      });
      return { success: true, message: 'Opportunity Created' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
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

  handlePrev = () => {
    if (this.state.stepIndex > 0) {
      this.setState(prevState => ({ ...prevState,
        stepIndex: prevState.stepIndex - 1,
      }));
    }
  }

  handleNext = () => {
    const { stepIndex } = this.state;

    if (stepIndex === 0) {
      console.log(this);
      console.log(this.wrappedActionSettingsForm);
      this.wrappedActionSettingsForm.wrappedInstance.formSubmit();
    } else if (stepIndex === 1) {
      this.shiftScheduler.formSubmit();
    } else if (stepIndex === 2) {
      this.createAction();
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
    if (this.props.campaign) {
      const { defaultErrorText, formSubmit, renderStepActions, shiftSubmit, settingsSubmit } = this;
      const { campaign } = this.props;
      const { newAction, modalOpen, formData, stepIndex } = this.state;

      const modalActions = [
        <RaisedButton
          label="Manage Opportunity"
          primary
          className={s.primaryButton}
          onTouchTap={(event) => { event.preventDefault(); history.push(`/organize/${campaign.slug}/opportunity/${newAction.slug}`); }}
        />,
      ];

      const settingsValidators = [
        (component) => { validateString(component, 'title', 'titleErrorText', 'Opportunity Name is Required'); },
        (component) => { validateState(component); },
        (component) => { validateZipcode(component); },
      ];

      return (
        <div className={s.outerContainer}>

          <Link to={`/organize/${campaign.slug}/opportunities`}>
            <div className={s.navHeader}>
              <FontIcon
                className={['material-icons', s.backArrow].join(' ')}
              >arrow_back</FontIcon>
              Opportunities
            </div>
          </Link>

          <div className={s.pageSubHeader}>Create Opportunity</div>

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
                    Dates & Shifts
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
                <ShiftScheduler
                  data={formData}
                  submit={shiftSubmit}
                  ref={(scheduler) => { this.shiftScheduler = scheduler; }}
                />
              }
            </div>
          </div>

          {modalOpen && (
            <Dialog
              title="Opportunity Created"
              modal
              actions={modalActions}
              actionsContainerClassName={s.modalActionsContainer}
              open={modalOpen}
            >
              <p>
                Congratulations, you have created the opportunity &apos;{newAction.title}&apos;.
              </p>
              <p>
                You can find your opportunity&apos;s public profile at {window.location.origin}/opportunity/{newAction.slug}
              </p>
              <p>
                You can manage your opportunity here:
              </p>
            </Dialog>
          )}
        </div>
      );
    }
    return null;
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
  options: ownProps => ({
    variables: {
      search: {
        id: ownProps.campaignId,
      },
    },
  }),
  props: ({ data }) => ({
    campaign: data.campaign,
  }),
});

export default compose(
  connect(),
  withCampaignQuery,
  graphql(CreateActionMutation, { name: 'createActionMutation' }),
)(CreateAction);
