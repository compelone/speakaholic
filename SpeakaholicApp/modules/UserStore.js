import {combineReducers} from 'redux';

const INITIAL_STATE = {
  //   current: [],
  loggedInUser: {},
  userCreditsLeft: {
    data: {
      getUserCreditsLeft: {
        credits_left: 0,
      },
    },
  },
  lastCheckedCreditsDate: Date.now(),
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        loggedInUser: action.payload,
      };
    case 'SET_USER_CREDITS_LEFT':
      return {
        ...state,
        userCreditsLeft: action.payload,
      };
    case 'SET_LAST_CHECKED_DATE':
      return {
        ...state,
        lastCheckedCreditsDate: action.payload,
      };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
});
