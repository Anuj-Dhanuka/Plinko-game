import Matter from "matter-js";
import { Dimensions, Animated } from "react-native";

// Components
import Particle from "./components/Particle";

// Store
import { updateScore } from "./store/actions/ScoreAction";

const { width: screenWidth } = Dimensions.get("window");

let lastBallTime = Date.now();

const Physics = (entities, { time }, dispatch) => {
  let engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);

  const currentTime = Date.now();

  const targetBucketIndex = 7;

  const initialX = screenWidth / 2;
  const initialY = 50;

  let velocityX, velocityY;

  if (targetBucketIndex !== undefined) {
    const numBuckets = 17;
    const targetBucketX =
      (screenWidth / numBuckets) * (targetBucketIndex + 0.5);
    velocityX = (targetBucketX - initialX) / 20;
  } else {
    velocityX = Math.random() * 10 - 5; 
  }

  velocityY = 10; 

  if (currentTime - lastBallTime >= 2000) {
    const ballRadius = 5;
    const ball = Matter.Bodies.circle(initialX, initialY, ballRadius, {
      restitution: 0.5,
      friction: 0.5,
      density: 1,
      velocity: { x: velocityX, y: velocityY },
    });
    Matter.World.add(engine.world, ball);
    entities[`ball_${currentTime}`] = {
      body: ball,
      size: [ballRadius * 2, ballRadius * 2],
      color: "white",
      renderer: Particle,
    };
    lastBallTime = currentTime;
  }

  for (const key in entities) {

    if (entities[key].isBucket) {
      const bucket = entities[key];
      const bucketBody = bucket.body;
      const bucketPosition = bucketBody.position;
      const bucketWidth = bucket.size[0];
      const bucketHeight = bucket.size[1];

      for (const entityKey in entities) {

        if (entityKey.startsWith("ball_")) {
          const ball = entities[entityKey];
          const ballBody = ball.body;
          const ballPosition = ballBody.position;
          const ballRadius = ball.size[0] / 2;

          const dx = ballPosition.x - bucketPosition.x;
          const dy = ballPosition.y - bucketPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance =
            ballRadius + Math.min(bucketWidth, bucketHeight) / 2 + 6;

          if (distance < minDistance && ballBody.velocity.y > 0) {
            Matter.World.remove(engine.world, ballBody);
            delete entities[entityKey];

            dispatch(updateScore(bucket.points));

            Animated.sequence([
              Animated.timing(bucket.animatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(bucket.animatedValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
          }
        }
      }
    }
  }

  return entities;
};

export default Physics;
