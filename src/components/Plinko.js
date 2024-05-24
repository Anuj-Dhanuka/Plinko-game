import React from "react";
import { StyleSheet, View } from "react-native";

function Plinko(props) {
  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View style={styles.container(x, y)}>
      <View style={styles.plinko(width, height)} />
    </View>
  );
}

export default Plinko;

const styles = StyleSheet.create({
  plinko: (width, height) => ({
    width: width,
    height: height,
    borderRadius: width / 2,
    backgroundColor: "green",
  }),
  container: (x, y) => ({
    position: "absolute",
    left: x,
    top: y,
  }),
});
