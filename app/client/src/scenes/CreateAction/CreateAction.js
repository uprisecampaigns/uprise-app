import React, { Component, PropTypes } from 'react';
import { compose, graphql } from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';
import { 
  validateString,
  validateWebsiteUrl,
  validateState,
  validatePhoneNumber
} from 'lib/validateComponentForms';

import { CampaignQuery } from 'schemas/queries';
import { CreateActionMutation } from 'schemas/mutations';

import ActionInfoForm from 'components/ActionInfoForm';


const statesList = Object.keys(states);

class CreateAction extends Component {

  static PropTypes = {
    createActionMutation: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    campaign: PropTypes.object
  }

  constructor(props) {
    super(props);

    const initialState = {
      // TODO: should refs be in state?
      refs: {},
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
        locationNotes: ''
      },
      errors: {},
      modalOpen: false,
      newAction: {
        title: '',
        slug: ''
      }
    };

    this.state = Object.assign({}, initialState, this.defaultErrorText);
  }

  hasErrors = false

  resetErrorText = () => {
    this.setState({ errors: this.defaultErrorText });
  }

  defaultErrorText = { 
    titleErrorText: null,
    internalTitleErrorText: null,
    streetAddressErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
  }

  handleInputChange = (event, type, value) => {
    let valid = true;

    if (type === 'state') {
      valid = false;

      statesList.forEach( (state) => {
        if (state.toLowerCase().includes(value.toLowerCase())) {
          valid = true;
        }
      });
      value = value.toUpperCase();
      
      // Hack for AutoComplete
      if (!valid) {
        this.state.refs.stateInput.setState({ searchText: this.state.formData.state });
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

  formSubmit = async (event) => {
    event.preventDefault();

    this.resetErrorText();
    this.hasErrors = false;

    validateString(this, 'title', 'titleErrorText', 'Public Name is Required');
    validateString(this, 'internalTitle', 'internalTitleErrorText', 'Internal Name is Required');
    validateState(this);

    if (!this.hasErrors) {

      const formData = Object.assign({}, this.state.formData, { campaignId: this.props.campaignId });

      try {
        const results = await this.props.createActionMutation({ 
          variables: {
            data: formData
          },
          // TODO: decide between refetch and update
          refetchQueries: ['ActionsQuery'], //, 'CampaignActions'],
          // updateQueries: {
          //   ActionsQuery: addAction,
          //   MyActionsQuery: addAction
          // }
        });
        this.setState({
          modalOpen: true,
          newAction: results.data.createAction
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  cancel = (event) => {
    event.preventDefault();
    history.goBack();
  }

  render() {

    const { state, cancel, formSubmit, handleInputChange } = this;
    const { user, ...props } = this.props;
    const { newAction, modalOpen, formData, errors, refs } = state;

    const campaign = props.campaign || {
      title: '',
      slug: ''
    };

    const modalActions = [
      <RaisedButton
        label="Set Preferences"
        primary={true}
        onTouchTap={ () => { history.push('/organize/' + campaign.slug + '/action/' + newAction.slug + '/preferences') }}
      />
    ];

    return (
      <div>
        <ActionInfoForm 
          handleInputChange={handleInputChange}
          cancel={cancel}
          formSubmit={formSubmit}
          submitText="Create"
          data={formData}
          errors={errors}
          user={user}
          refs={refs}
          campaignTitle={campaign.title}
        />

        {modalOpen && (
          <Dialog
            title="Action Created"
            modal={true}
            actions={modalActions}
            open={modalOpen}
          >
            <p>
              Congratulations, you have created the action '{newAction.title}'.
            </p>
            <p>
              You can find and edit your action's public profile at 
              <Link to={'/action/' + newAction.slug} useAhref={true}>uprise.org/organize/action/{newAction.slug}</Link>
            </p>
            <p>
              Please feel free to contact us at <Link to="mailto:help@uprise.org" external={true} useAhref={true}>help@uprise.org</Link> for assistance.
            </p>
          </Dialog>
        )}
      </div>
    );
  }
}

const withCampaignQuery = graphql(CampaignQuery, {
  options: (ownProps) => ({ 
    variables: {
      search: {
        id: ownProps.campaignId
      }
    }
  }),
  props: ({ data }) => ({ 
    campaign: data.campaign
  })
});

export default compose(
  withCampaignQuery,
  graphql(CreateActionMutation, { name: 'createActionMutation' })
)(CreateAction);
