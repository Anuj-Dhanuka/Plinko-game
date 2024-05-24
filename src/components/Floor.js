import React from "react";
import { StyleSheet, View } from "react-native";

function Floor(props) {
  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const color = props.color

  return (
    <View style={styles.container}>
      <View style={styles.floor(x, y, width, height, color)} />
    </View>
  );
}

export default Floor;

const styles = StyleSheet.create({
  floor: (x, y, width, height, color) => ({
    position: "absolute",
    left: x,
    top: y,
    width: width,
    height: height,
    backgroundColor: color,
  }),
  container: {
    position: "absolute",
  },
});
