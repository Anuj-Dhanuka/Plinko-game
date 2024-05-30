import Matter from "matter-js";
import { Animated, Dimensions } from "react-native";

// Components
import Particle from "./components/Particle";

// Store
import { stopCreatingBall } from "./store/actions/BallAction";

// Common utils
import {
  BALL_RADIUS,
  NUMBER_OF_BUCKETS,
  NUMBER_OF_ROWS,
  SPACING_Y,
} from "./utils/commonUtils";

const { width: screenWidth } = Dimensions.get("window");

let eventListenerAdded = false;

const Physics = (
  entities,
  { time },
  dispatch,
  createNewBall,
  handleScore,
  targetBucketIndex = undefined
) => {
  const engine = entities.physics.engine;

  let allowEngineUpdate = !createNewBall;

  if (allowEngineUpdate) {
    Matter.Engine.update(engine, time.delta);
  }

  let targetBucketX;

  if (targetBucketIndex !== undefined) {
    targetBucketX =
      (screenWidth / NUMBER_OF_BUCKETS) * (targetBucketIndex + 0.5);
  }

  const centerRowOfPlinkos = Math.floor(NUMBER_OF_ROWS / 2) * SPACING_Y + 100;

  if (createNewBall) {
    const ballRadius = BALL_RADIUS;

    const firstRowPlinkos = Object.values(entities).filter(
      (entity) => entity.isPlinko && entity.body.position.y === 100
    );
    if (firstRowPlinkos.length >= 2) {
      const firstPlinko = firstRowPlinkos[0];
      const lastPlinko = firstRowPlinkos[firstRowPlinkos.length - 1];
      const initialPositions = [
        firstPlinko.body.position.x - (firstPlinko.body.circleRadius - 6),
        lastPlinko.body.position.x + (lastPlinko.body.circleRadius - 6),
      ];

      const initialX =
        initialPositions[Math.floor(Math.random() * initialPositions.length)];
      const initialY = 50;

      const ball = Matter.Bodies.circle(initialX, initialY, ballRadius, {
        restitution: 0.3,
        friction: 0.8,
        frictionAir: 0.05,
        density: 0.1,
        label: "ball",
      });

      Matter.World.add(engine.world, ball);
      entities[`ball_${Date.now()}`] = {
        body: ball,
        size: [ballRadius * 2, ballRadius * 2],
        color: "white",
        renderer: Particle,
      };

      dispatch(stopCreatingBall());
    }
  }

  if (!eventListenerAdded) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA.label === "ball" || bodyB.label === "ball") {
          const ballBody = bodyA.label === "ball" ? bodyA : bodyB;
          const plinkoBody = bodyA.label === "ball" ? bodyB : bodyA;

          if (
            plinkoBody.label === "plinko" &&
            Math.abs(plinkoBody.position.y - centerRowOfPlinkos) < SPACING_Y / 2
          ) {
            console.log("touched");
            const forceMagnitudeX = 0.0002 * targetBucketX;
            const forceMagnitudeY = 0.005;

            const dx = targetBucketX - ballBody.position.x;
            const directionX = dx > 0 ? 1 : -1;

            Matter.Body.applyForce(ballBody, ballBody.position, {
              x: directionX * forceMagnitudeX,
              y: forceMagnitudeY,
            });

            const plinkoEntityKey = Object.keys(entities).find(
              (key) => entities[key].body === plinkoBody
            );

            if (plinkoEntityKey) {
              const plinko = entities[plinkoEntityKey];
              const oldDensity = plinko.body.density;
              const baseDensity = 0.1; // Moderate base density
              const densityDifference = 0.05;

              console.log(plinko.body.position.x);

              const newDensity =
                baseDensity +
                (ballBody.position.x < plinko.body.position.x
                  ? densityDifference
                  : -densityDifference);

              const plinkoBody = plinko.body;

              Matter.Body.setDensity(plinkoBody, newDensity);
              console.log(
                `Old density of plinko: ${oldDensity}, New density of plinko: ${newDensity}`
              );
            }

            if (plinkoEntityKey) {
              entities[plinkoEntityKey].isHighlighted = true;
            }
          }
        }
      });
    });

    eventListenerAdded = true;
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
          const minDistance =
            ballRadius + Math.min(bucketWidth, bucketHeight) / 2 + 6;

          if (distance < minDistance && ballBody.velocity.y > 0) {
            Matter.World.remove(engine.world, ballBody);
            delete entities[entityKey];

            handleScore(bucket.points);

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
