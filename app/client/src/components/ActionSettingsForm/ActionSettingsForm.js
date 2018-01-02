import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';

import states from 'lib/states-list';

import s from 'styles/Form.scss';


class ActionSettingsForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
  }

  render() {
    const {
      data, refs, formSubmit, errors, handleInputChange,
    } = this.props;

    const statesList = Object.keys(states);

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>
          <div className={s.formContainer}>
            <form
              className={s.form}
              onSubmit={formSubmit}
            >
              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Opportunity Public Name"
                  fullWidth
                  value={data.title}
                  onChange={(event) => { handleInputChange(event, 'title', event.target.value); }}
                  errorText={errors.titleErrorText}
                />
              </div>

              <div className={s.textFieldContainer}>
                <TextField
                  floatingLabelText="Opportunity Internal Name (optional)"
                  fullWidth
                  value={data.internalTitle}
                  onChange={(event) => { handleInputChange(event, 'internalTitle', event.target.value); }}
                  errorText={errors.internalTitleErrorText}
                />
              </div>

              <p className={s.helpText}>
                Please create separate listings for virtual and in-person opportunities.
              </p>

              <div className={s.toggleContainer}>
                <Toggle
                  label="Virtual Opportunity"
                  toggled={data.virtual}
                  labelPosition="right"
                  onToggle={(event, checked) => { handleInputChange(event, 'virtual', checked); }}
                />
              </div>

              { data.virtual || (

                <div>

                  <div className={s.sectionLabel}>Where:</div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="Place Name"
                      value={data.locationName}
                      onChange={(event) => { handleInputChange(event, 'locationName', event.target.value); }}
                      errorText={errors.locationNameErrorText}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="Street Address"
                      value={data.streetAddress}
                      onChange={(event) => { handleInputChange(event, 'streetAddress', event.target.value); }}
                      errorText={errors.streetAddressErrorText}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="Street Address 2"
                      value={data.streetAddress2}
                      onChange={(event) => { handleInputChange(event, 'streetAddress2', event.target.value); }}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="City"
                      value={data.city}
                      onChange={(event) => { handleInputChange(event, 'city', event.target.value); }}
                      errorText={errors.cityErrorText}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <AutoComplete
                      floatingLabelText="State"
                      searchText={data.state}
                      dataSource={statesList}
                      onUpdateInput={(text) => { handleInputChange(undefined, 'state', text); }}
                      ref={(input) => { refs.stateInput = input; }}
                      errorText={errors.stateErrorText}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="Zipcode"
                      type="text"
                      pattern="[0-9]{5}"
                      value={data.zipcode}
                      onChange={(event) => { handleInputChange(event, 'zipcode', event.target.value); }}
                      errorText={errors.zipcodeErrorText}
                    />
                  </div>

                  <div className={s.textFieldContainer}>
                    <TextField
                      floatingLabelText="Location Notes"
                      fullWidth
                      value={data.locationNotes}
                      onChange={(event) => { handleInputChange(event, 'locationNotes', event.target.value); }}
                      errorText={errors.locationNotesErrorText}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ActionSettingsForm;
