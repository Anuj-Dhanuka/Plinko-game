import React from "react";
import { View, StyleSheet } from "react-native";

function Particle(props) {
  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View style={styles.container}>
      <View style={styles.particle(x, y, width, height)} />
    </View>
  );
}

export default Particle;

const styles = StyleSheet.create({
  particle: (x, y, width, height) => ({
    position: "absolute",
    left: x,
    top: y,
    width: width,
    height: height,
    borderRadius: width / 2,
    backgroundColor: "white",
  }),
  container: {
    position: "absolute",
  },
});
