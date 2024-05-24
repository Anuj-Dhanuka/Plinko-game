import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { useDispatch, useSelector } from "react-redux";

//entities
import useEntities from "../entities";

//physics
import Physics from "../physics";

const GameApp = () => {
  const dispatch = useDispatch();
  const [running, setRunning] = useState(true);
  const entities = useEntities();

  const updatePhysics = (entities, { time }) =>
    Physics(entities, { time }, dispatch);

  const score = useSelector(({ scoreReducer }) => scoreReducer.score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <GameEngine
        style={styles.gameContainer}
        systems={[updatePhysics]}
        entities={entities}
      ></GameEngine>
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
});

export default GameApp;
