//types
import { CREATE_BALL, STOP_CREATE_BALL } from "../actions/types";

const initialState = {
  createNewBall: false,
};


const ballReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BALL:
      return {
        ...state,
        createNewBall: true,
      };
      case STOP_CREATE_BALL:
        return {
          ...state,
          createNewBall: false,
        };  
    default:
      return state;
  }
};

export default ballReducer;
