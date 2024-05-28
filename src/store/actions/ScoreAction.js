//types
import { UPDATE_SCORE } from "./types";

export const updateScore = (newScore) => ({
    type: UPDATE_SCORE,
    payload: newScore,
  });
  