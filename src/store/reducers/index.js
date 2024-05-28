import { combineReducers } from "redux";

//reducers
import scoreReducer from "./ScoreReducer";
import ballReducer from "./BallReducer";

export default   combineReducers({
  scoreReducer: scoreReducer,
  ballReducer: ballReducer
});