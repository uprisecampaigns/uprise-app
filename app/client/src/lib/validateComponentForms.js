import isMobilePhone from 'validator/lib/isMobilePhone';
import isURL from 'validator/lib/isURL';
import isNumeric from 'validator/lib/isNumeric';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';

import apolloClient from 'store/apolloClient';

import EmailAvailableQuery from 'schemas/queries/EmailAvailableQuery.graphql';

import states from 'lib/states-list';


// TODO: I hate this entire validation system. It should be refactored into a
//      Higher order component or something sensible/fancy like that
//      In the meantime, it could at least not be so rigid in the propnames, etc.

/* eslint-disable no-param-reassign */

const statesList = Object.keys(states);

export function validateString(component, prop, errorProp, errorMsg) {
  if (typeof component.state.formData[prop] !== 'string' ||
      component.state.formData[prop].trim() === '') {
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: errorMsg,
      }),
    }));

    component.hasErrors = true;
  } else {
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: null,
      }),
    }));
  }
}

export function validateWebsiteUrl(component, prop = 'websiteUrl', errorProp = 'websiteUrlErrorText') {
  if (component.state.formData[prop].trim() !== '' && !isURL(component.state.formData[prop])) {
    component.hasErrors = true;
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: 'Please enter valid website url',
      }),
    }));
  }
}

export function validateState(component, prop = 'state', errorProp = 'stateErrorText') {
  if (component.state.formData[prop].trim() !== '' && !statesList.includes(component.state.formData[prop])) {
    component.hasErrors = true;
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: 'Please enter valid state',
      }),
    }));
  }
}

export function validateEmail(component, prop = 'email', errorProp = 'emailErrorText') {
  const test = component.state.formData[prop];

  if (typeof test === 'string' && test.trim() !== '') {
    if (!isEmail(test)) {
      component.hasErrors = true;
      component.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: 'Please enter valid email',
        }),
      }));
    }
  }
}

export async function validateEmailAvailable(component, previousEmail = '', prop = 'email', errorProp = 'emailErrorText') {
  const test = component.state.formData[prop];

  if (typeof test === 'string' && test.trim() !== '' && previousEmail !== test) {
    const response = await apolloClient.query({
      query: EmailAvailableQuery,
      variables: {
        email: test,
      },
      fetchPolicy: 'network-only',
    });

    if (!response.data.emailAvailable) {
      component.hasErrors = true;
      component.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: 'That email is already taken',
        }),
      }));
    }
  }
}

export function validateZipcode(component, prop = 'zipcode', errorProp = 'zipcodeErrorText') {
  const test = component.state.formData[prop];

  if (typeof test === 'string' && test.trim() !== '') {
    if (!isNumeric(test)) {
      component.hasErrors = true;
      component.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: 'Zipcodes should be numbers',
        }),
      }));
    } else if (test.length !== 5) {
      component.hasErrors = true;
      component.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          [errorProp]: 'Zipcodes should be 5 digits long',
        }),
      }));
    }
  }
}

export function validateZipcodeList(component) {
  const { formData } = component.state;

  if (typeof formData.zipcodeList === 'string' && formData.zipcodeList.trim() !== '') {
    const zipcodeList = formData.zipcodeList.split(',').map(zip => zip.trim());

    zipcodeList.forEach((zipcode) => {
      if (!isNumeric(zipcode)) {
        component.hasErrors = true;
        component.setState(prevState => ({
          errors: Object.assign({}, prevState.errors, {
            zipcodeListErrorText: 'All zipcodes should be numbers',
          }),
        }));
      } else if (zipcode.length !== 5) {
        component.hasErrors = true;
        component.setState(prevState => ({
          errors: Object.assign({}, prevState.errors, {
            zipcodeListErrorText: 'All zipcodes should be 5 digits long',
          }),
        }));
      }
    });
  }
}

export function validatePhoneNumber(component, prop = 'phoneNumber', errorProp = 'phoneNumberErrorText') {
  const test = component.state.formData[prop];

  if (test !== '' &&
      (test.match(/[^(\d\s)-]/) ||
      (!isMobilePhone(test.replace(/\D/g, ''), 'en-US')))) {
    component.hasErrors = true;
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp]: 'Please enter valid phone number',
      }),
    }));
  }
}

export function validateStartEndTimes(component) {
  const { date, startTime, endTime } = component.state.formData;

  const errors = {};
  let hasError = false;

  if (typeof startTime === 'undefined' || !moment(startTime).isValid()) {
    errors.startTimeErrorText = 'Please choose a start time';
    hasError = true;
  }

  if (typeof endTime === 'undefined' || !moment(endTime).isValid()) {
    errors.endTimeErrorText = 'Please choose an end time';
    hasError = true;
  }

  if (typeof date === 'undefined' || !moment(date).isValid()) {
    errors.dateErrorText = 'Please choose a date';
    hasError = true;
  }

  if (!hasError && !moment(endTime).isAfter(moment(startTime))) {
    errors.endTimeErrorText = 'Please choose end time after start time';
    hasError = true;
  }

  if (hasError) {
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, errors),
    }));

    component.hasErrors = true;
  }
}

export function validatePasswords(
  component,
  password1 = 'newPassword1',
  password2 = 'newPassword2',
  errorProp1 = 'newPassword1ErrorText',
  errorProp2 = 'newPassword2ErrorText',
) {
  const { formData } = component.state;

  if (formData[password1] !== formData[password2]) {
    component.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        [errorProp1]: 'Passwords must match',
        [errorProp2]: 'Passwords must match',
      }),
    }));
    component.hasErrors = true;
  }
}
