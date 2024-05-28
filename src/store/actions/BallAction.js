//types
import { CREATE_BALL, STOP_CREATE_BALL } from "./types";

export const startCreateNewBall = () => ({
    type: CREATE_BALL
  });

export const stopCreatingBall = () => ({
    type: STOP_CREATE_BALL
})  