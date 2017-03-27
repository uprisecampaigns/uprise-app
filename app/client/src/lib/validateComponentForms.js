import isMobilePhone from 'validator/lib/isMobilePhone';
import isURL from 'validator/lib/isURL';
import moment from 'moment';

import states from 'lib/states-list';


const statesList = Object.keys(states);

export function validateString(component, prop, errorProp, errorMsg) {
  if (typeof component.state.formData[prop] !== 'string' || 
      component.state.formData[prop].trim() === '') {

    component.setState( (prevState) => ({ 
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: errorMsg 
      })
    }));

    component.hasErrors = true;

  } else {
    component.setState( (prevState) => ({ 
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: null 
      })
    }));
  }
}

export function validateWebsiteUrl(component) {
  if (component.state.formData.websiteUrl.trim() !== '' && !isURL(component.state.formData.websiteUrl)) {
    component.hasErrors = true;
    component.setState( (prevState) => ({
      errors: Object.assign({}, prevState.errors, {
        websiteUrlErrorText: 'Please enter valid website url'
      })
    }));
  }
}

export function validateState(component) {
  if (component.state.formData.state.trim() !== '' && !statesList.includes(component.state.formData.state)) {
    component.hasErrors = true;
    component.setState( (prevState) => ({
      errors: Object.assign({}, prevState.errors, {
        stateErrorText: 'Please enter valid state'
      })
    }));
  }
}

export function validatePhoneNumber(component) {
  if (component.state.formData.phoneNumber.trim() === '') {
    component.hasErrors = true;
    component.setState( (prevState) => ({
      errors: Object.assign({}, prevState.errors, {
        phoneNumberErrorText: 'Phone number is required'
      })
    }));
  } else if (component.state.formData.phoneNumber.match(/[^\(\d\s\)\-]/) || 
             !isMobilePhone(component.state.formData.phoneNumber.replace(/\D/g,''), 'en-US')) {

    component.hasErrors = true;
    component.setState( (prevState) => ({
      errors: Object.assign({}, prevState.errors, {
        phoneNumberErrorText: 'Please enter valid phone number'
      })
    }));
  }
}

export function validateStartEndTimes(component) {
  const { date, startTime, endTime, ...formData } = component.state.formData;

  const errors = {};
  let hasError = false;

  if (typeof startTime === 'undefined' || !moment(component.state.formData.startTime).isValid()) {
    errors.startTimeErrorText = 'Please choose a start time';
    hasError = true;
  }

  if (typeof endTime === 'undefined' || !moment(component.state.formData.endTime).isValid()) {
    errors.endTimeErrorText = 'Please choose a end time';
    hasError = true;
  } 

  if (typeof date === 'undefined' || !moment(component.state.formData.date).isValid()) {
    errors.dateErrorText = 'Please choose a date';
    hasError = true;
  } 

  if (!hasError && !moment(component.state.formData.endTime).isAfter(moment(component.state.formData.startTime))) {
    errors.endTimeErrorText = 'Please choose end time after start time'
    hasError = true;
  }

  if (hasError) {
    component.setState( (prevState) => ({
      errors: Object.assign({}, prevState.errors, errors)
    }));

    component.hasErrors = true;
  }
}
