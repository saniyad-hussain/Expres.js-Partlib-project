import { SET_RECENT_PARTS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_RECENT_PARTS:
      return action.payload;
    default:
      return state;
  }
}
