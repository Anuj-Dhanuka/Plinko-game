//types
import { UPDATE_SCORE } from "../actions/types";

const initialState = {
  score: 100,
};

const scoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCORE:
      return {
        ...state,
        score: state.score * action.payload,
      };
    default:
      return state;
  }
};

export default scoreReducer;
