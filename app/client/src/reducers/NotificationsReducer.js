
import { 
  NOTIFY, 
  CLEAR
} from 'actions/NotificationsActions.js';

const defaultStartState = { 
  display: false,
  message: ''
};

export function updateNotifications(notificationsState = defaultStartState, action) {
  switch (action.type){
   
    case NOTIFY:
      return Object.assign({}, notificationsState, { 
        display: true,
        message: action.value
      });

    case CLEAR:
      return Object.assign({}, notificationsState, { 
        display: false,
        message: ''
      });

    default: 
      return notificationsState;
  }
};
