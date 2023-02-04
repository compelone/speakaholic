import {combineReducers} from 'redux';

const INITIAL_STATE = {
  //   current: [],
  loggedInUser: {},
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        loggedInUser: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
});
