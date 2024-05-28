import React, { useCallback} from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

//entities
import useEntities from "../entities";

//physics
import Physics from "../physics";

//store
import { startCreateNewBall } from "../store/actions/BallAction";
import { updateScore } from "../store/actions/ScoreAction";

const GameApp = () => {
  const dispatch = useDispatch();
  const entities = useEntities();

  const score = (useSelector(({ scoreReducer }) => scoreReducer.score)).toFixed(1);
  const createNewBall = useSelector(({ ballReducer }) => ballReducer.createNewBall);


  const handleCreateBall = useCallback(
    debounce(() => {
      dispatch(startCreateNewBall());
    }, 250), 
    [dispatch]
  );

  const handleScore = (points) => {
    dispatch(updateScore(points))
  }

  
  const updatePhysics = (entities, { time }) =>
    Physics(entities, { time }, dispatch, createNewBall, handleScore);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <GameEngine
        style={styles.gameContainer}
        systems={[updatePhysics]}
        entities={entities}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateBall}>
        <Text style={styles.buttonText}>Create Ball</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gameContainer: {
    flex: 1,
  },
  scoreContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "green",
    borderBottomWidth: 2,
  },
  scoreText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameApp;
