
import { NOTIFY, CLEAR,
  START_PAGE_LOAD, END_PAGE_LOAD
} from 'actions/NotificationsActions.js';

const defaultStartState = { 
  display: false,
  message: '',
  pageLoading: false
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

    case START_PAGE_LOAD:
      return Object.assign({}, notificationsState, { 
        pageLoading: true,
      });

    case END_PAGE_LOAD:
      return Object.assign({}, notificationsState, { 
        pageLoading: false,
      });

    default: 
      return notificationsState;
  }
};
