import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class CreateActionForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    newAction: PropTypes.object.isRequired,
  }

  render() {
    const { 
      data, user, refs, formSubmit, errors,
      handleInputChange, cancel, newAction, modalOpen, campaignTitle
    } = this.props;

    const statesList = Object.keys(states);

    const modalActions = [
      <RaisedButton
        label="Set Preferences"
        primary={true}
        onTouchTap={ () => { history.push('/organize/' + newAction.slug) }}
      />
    ];

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <Paper zDepth={2}>
            <div className={s.formContainer}>
              <form 
                className={s.form}
                onSubmit={formSubmit}
              >
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign"
                    value={campaignTitle}
                    disabled={true}
                  />
                </div>
 
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Action Internal Name"
                    value={data.internalTitle}
                    onChange={ (event) => { handleInputChange(event, 'internalTitle', event.target.value) } }
                    errorText={errors.internalTitleErrorText}
                    fullWidth={true}
                  />
                </div>

                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Action Public Name"
                    value={data.title}
                    onChange={ (event) => { handleInputChange(event, 'title', event.target.value) } }
                    errorText={errors.titleErrorText}
                    fullWidth={true}
                  />
                </div>

                <div className={s.toggleContainer}>
                  <Toggle
                    label="Virtual Action"
                    toggled={data.virtual}
                    labelPosition="right"
                    onToggle={ (event, checked) => { handleInputChange(event, 'virtual', checked) } }
                  />
                </div>

                { data.virtual || (
                  <div>
                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Street Address"
                        value={data.streetAddress}
                        onChange={ (event) => { handleInputChange(event, 'streetAddress', event.target.value) } }
                        errorText={errors.streetAddressErrorText}
                        fullWidth={true}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="Street Address 2"
                        value={data.streetAddress2}
                        onChange={ (event) => { handleInputChange(event, 'streetAddress2', event.target.value) } }
                        fullWidth={true}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <TextField
                        floatingLabelText="City"
                        value={data.city}
                        onChange={ (event) => { handleInputChange(event, 'city', event.target.value) } }
                        errorText={errors.cityErrorText}
                        fullWidth={true}
                      />
                    </div>

                    <div className={s.textFieldContainer}>
                      <AutoComplete
                        floatingLabelText="State"
                        searchText={data.state}
                        dataSource={statesList}
                        onUpdateInput={ (text) => { handleInputChange(undefined, 'state', text) } }
                        ref={ (input) => { refs.stateInput = input } }
                        errorText={errors.stateErrorText}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                )}

                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={cancel} 
                    primary={false} 
                    label="Cancel" 
                  />
                </div>
                <div className={s.button}>
                  <RaisedButton 
                    onTouchTap={formSubmit} 
                    primary={true} 
                    type="submit"
                    label="Create" 
                  />
                </div>
              </form>
            </div>
          </Paper>
        </div>

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
              <Link to={'/action/' + newAction.slug} useAhref={true}>uprise.org/action/{newAction.slug}</Link>
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

export default CreateActionForm;
