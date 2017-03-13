import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import Link from 'components/Link';

import history from 'lib/history';
import states from 'lib/states-list';

import s from 'styles/Form.scss';


class CreateCampaignForm extends Component {
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
    newCampaign: PropTypes.object.isRequired,
  }

  render() {
    const { 
      data, user, refs, formSubmit, errors,
      handleInputChange, cancel, newCampaign, modalOpen 
    } = this.props;

    const statesList = Object.keys(states);

    const modalActions = [
      <RaisedButton
        label="Set Preferences"
        primary={true}
        onTouchTap={ () => { history.push('/campaign/' + newCampaign.slug) }}
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
                <div> {this.props.error} </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Campaign Name"
                    value={data.title}
                    onChange={ (event) => { handleInputChange(event, 'title', event.target.value) } }
                    errorText={errors.titleErrorText}
                    fullWidth={true}
                  />
                </div>
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
                    floatingLabelText="Website"
                    value={data.websiteUrl}
                    onChange={ (event) => { handleInputChange(event, 'websiteUrl', event.target.value) } }
                    errorText={errors.websiteUrlErrorText}
                    fullWidth={true}
                    type="url"
                  />
                </div>
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Phone"
                    value={data.phone}
                    onChange={ (event) => { handleInputChange(event, 'phone', event.target.value) } }
                    errorText={errors.phoneErrorText}
                    fullWidth={true}
                    type="tel"
                    pattern="[0-9]{10}"
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
                <div className={s.textFieldContainer}>
                  <TextField
                    floatingLabelText="Email"
                    disabled={true}
                    value={data.email}
                    fullWidth={true}
                  />
                </div>
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
            title="Campaign Created"
            modal={true}
            actions={modalActions}
            open={modalOpen}
          >
            <p>
              Congratulations, you have created the campaign '{newCampaign.title}'.
            </p>
            <p>
              You can find and edit your campaign's public profile at 
              <Link to={'/campaign/' + newCampaign.slug} useAhref={true}>uprise.org/campaign/{newCampaign.slug}</Link>
            </p>
            <p>
              Please feel free to contact us at <Link to="mailto:help@uprise.org" useAhref={true}>help@uprise.org</Link> for assistance.
            </p>
          </Dialog>
        )}
      </div>
    );
  }
}

export default CreateCampaignForm;
