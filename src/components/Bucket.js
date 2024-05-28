import React from "react";
import {Animated, Text, StyleSheet } from "react-native";

const Bucket = (props) => {
  const { body, size, color, borderRadius, animatedValue, points } = props;
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const animatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.bucket(x, y, width, height, color, borderRadius),
        animatedStyle,
      ]}
    >
      <Text style={styles.pointsText}>{points}x</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bucket: (x, y, width, height, color, borderRadius) => ({
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: x,
    top: y,
    width: width,
    height: height,
    backgroundColor: color,
    borderRadius: borderRadius,
  }),
  pointsText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 6,
  },
});

export default Bucket;
