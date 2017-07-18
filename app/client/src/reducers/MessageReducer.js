import { SET_RECIPIENTS } from 'actions/MessageActions';

const defaultStartState = {
  recipients: [],
};

export function updateMessages(messagesState = defaultStartState, action) {
  switch (action.type) {
    case SET_RECIPIENTS:
      return Object.assign({}, messagesState, {
        recipients: action.recipients,
      });

    default:
      return messagesState;
  }
}
