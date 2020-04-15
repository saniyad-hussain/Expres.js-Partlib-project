import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import partReducer from "./partReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  parts: partReducer
});
