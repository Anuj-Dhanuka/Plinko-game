import { combineReducers } from "redux";

//reducers
import scoreReducer from "./ScoreReducer";

export default   combineReducers({
  scoreReducer: scoreReducer
});