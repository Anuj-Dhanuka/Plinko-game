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

  const targetBucketIndex = undefined; 

  const initialX = screenWidth / 2; 
  const initialY = 50;

  const numBuckets = 17;
  let targetBucketX;
  let velocityX, velocityY;

  if (targetBucketIndex !== undefined) {
    targetBucketX = (screenWidth / numBuckets) * (targetBucketIndex + 0.5);
    velocityX = (targetBucketX - initialX) / 20; 
    velocityY = 6;
  } else {
    targetBucketX = initialX;
    velocityX = 0;
    velocityY = 2; 
  }

  if (currentTime - lastBallTime >= 2000 || Object.keys(entities).filter(key => key.startsWith("ball_")).length === 0) {
    const ballRadius = 5;
    const ball = Matter.Bodies.circle(initialX, initialY, ballRadius, {
      restitution: 0.5,
      friction: 0.5,
      density: 1,
    });

    Matter.Body.setVelocity(ball, { x: velocityX, y: velocityY });

    Matter.World.add(engine.world, ball);
    entities[`ball_${currentTime}`] = {
      body: ball,
      size: [ballRadius * 2, ballRadius * 2],
      color: "white",
      renderer: Particle,
      targetBucketX: targetBucketX, 
      updateCount: 0, 
    };
    lastBallTime = currentTime;
  }

  for (const key in entities) {
    if (key.startsWith("ball_")) {
      const ball = entities[key];
      ball.updateCount = (ball.updateCount || 0) + 1;

      if (targetBucketIndex !== undefined) {
        if (ball.updateCount % 3 === 0) { 
          const ballBody = ball.body;
          const currentX = ballBody.position.x;
          const targetX = ball.targetBucketX;
          const deltaX = targetX - currentX;

          const newVelocityX = deltaX / 16;
          Matter.Body.setVelocity(ballBody, { x: newVelocityX, y: ballBody.velocity.y });

          Matter.Body.applyForce(ballBody, ballBody.position, {
            x: newVelocityX * 0.0001,
            y: 0,
          });
        }
      }
    }
  }

  for (const key in entities) {
    if (entities[key] && entities[key].isBucket) {
      const bucket = entities[key];
      const bucketBody = bucket.body;
      const bucketPosition = bucketBody.position;
      const bucketWidth = bucket.size[0];
      const bucketHeight = bucket.size[1];

      for (const entityKey in entities) {
        if (entityKey.startsWith("ball_")) {
          const ball = entities[entityKey];
          if (!ball) continue; 
          const ballBody = ball.body;
          const ballPosition = ballBody.position;
          const ballRadius = ball.size[0] / 2;

          const dx = ballPosition.x - bucketPosition.x;
          const dy = ballPosition.y - bucketPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ballRadius + Math.min(bucketWidth, bucketHeight) / 2 + 6;

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
