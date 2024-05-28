import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View } from "react-native";

//commin utils
import { PLINKO_COLOR, ANIMATED_PLINKO_COLOR } from "../utils/commonUtils";

function Plinko(props) {
  const width = props.size[0];
  const height = props.size[1];

  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.isHighlighted) {
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [props.isHighlighted]);

  const backgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [PLINKO_COLOR, ANIMATED_PLINKO_COLOR]
  });

  return (
    <View style={styles.container(x, y)}>
      <Animated.View style={[styles.plinko(width, height), { backgroundColor }]} />
    </View>
  );
}

export default Plinko;

const styles = StyleSheet.create({
  plinko: (width, height) => ({
    width: width,
    height: height,
    borderRadius: width / 2,
    backgroundColor: "transparent",
  }),
  container: (x, y) => ({
    position: "absolute",
    left: x,
    top: y,
  }),
});
