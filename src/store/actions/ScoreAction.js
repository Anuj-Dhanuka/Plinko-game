//types
import { UPDATE_SCORE } from "./type";

export const updateScore = (newScore) => ({
    type: UPDATE_SCORE,
    payload: newScore,
  });
  