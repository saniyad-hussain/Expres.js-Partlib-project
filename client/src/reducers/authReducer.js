import { SET_CURRENT_USER, USER_LOADING, SET_MODEL_PATH} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_MODEL_PATH:
      return{
        ...state,
        data:action.payload
      }
    default:
      return state;
  }
}
