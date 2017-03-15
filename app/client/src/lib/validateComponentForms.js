import isMobilePhone from 'validator/lib/isMobilePhone';
import isURL from 'validator/lib/isURL';

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
