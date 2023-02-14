import {combineReducers} from 'redux';

const INITIAL_STATE = {
  //   current: [],
  loggedInUser: {},
  userCreditsLeft: 0,
};

const userReducer = (state = INITIAL_STATE, action) => {
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
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
});
