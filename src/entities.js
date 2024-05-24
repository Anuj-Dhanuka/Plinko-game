import { Dimensions, Animated } from 'react-native';
import Matter from "matter-js";

// Components
import Plinko from "./components/Plinko";
import Bucket from "./components/Bucket";
import Floor from "./components/Floor";
import LeftWall from './components/LeftWall';
import RightWall from './components/RightWall';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function useEntities() {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  engine.world.gravity.y = 0.3;


  const plinkoRadius = 3;
  const plinkos = [];
  const rows = 16;
  const spacingX = 18;
  const spacingY = 30;

  let lastPlinkoPlace = 0;
  let firstPlinkoOflastRow = 0;
  let secondPlinkoOfLastRow = 0;
  for (let row = 0; row < rows; row++) {
    const plinkosInRow = 3 + row;
    for (let col = 0; col < plinkosInRow; col++) {
      const x = (screenWidth / 2) - ((plinkosInRow * spacingX) / 2) + (col * spacingX) + (spacingX / 2);
      const y = row * spacingY + 100;
      lastPlinkoPlace = y;

      if (row === rows - 1 && col === 0) {
        firstPlinkoOflastRow = x;
      }
      if (row === rows - 1 && col === 1) {
        secondPlinkoOfLastRow = x;
      }

      const plinko = Matter.Bodies.circle(x, y, plinkoRadius, {
        isStatic: true,
        restitution: 0.5,
        friction: 0.5,
      });

      Matter.World.add(world, plinko);
      plinkos.push({
        body: plinko,
        size: [plinkoRadius * 2, plinkoRadius * 2],
        color: 'green',
        renderer: Plinko,
      });
    }
  }

  const floor = Matter.Bodies.rectangle(screenWidth / 2, screenHeight, screenWidth, 20, { isStatic: true });
  const leftWall = Matter.Bodies.rectangle(0, screenHeight / 2, 20, screenHeight, { isStatic: true });
  const rightWall = Matter.Bodies.rectangle(screenWidth, screenHeight / 2, 20, screenHeight, { isStatic: true });

  Matter.World.add(world, [floor, leftWall, rightWall]);

  const buckets = [];
  const numBuckets = 17;
  const bucketWidth = 17; 
  const bucketHeight = 17;

  const bucketDetails = [
    { points: 110, color: '#ff0000' },
    { points: 41, color: '#ff6600' },
    { points: 10, color: '#ffcc00' },
    { points: 5, color: '#ff9900' },
    { points: 3, color: '#ff6600' },
    { points: 1.5, color: '#ff3300' },
    { points: 1, color: '#ff0000' },
    { points: 0.5, color: '#ffcc00' },
    { points: 0.3, color: '#ff9900' },
    { points: 0.5, color: '#ffcc00' },
    { points: 1, color: '#ff0000' },
    { points: 1.5, color: '#ff3300' },
    { points: 3, color: '#ff6600' },
    { points: 5, color: '#ff9900' },
    { points: 10, color: '#ffcc00' },
    { points: 41, color: '#ff6600' },
    { points: 110, color: '#ff0000' }
  ];

  const lastPlinkoX = plinkos[plinkos.length - rows].body.position.x + (rows - 1) * spacingX;

  for (let i = 0; i < numBuckets; i++) {
    const startGap = firstPlinkoOflastRow + bucketWidth / 2;
    const endGap = lastPlinkoX + bucketWidth / 2;

    const x = startGap + (endGap - startGap) * (i / (numBuckets));
    const y = lastPlinkoPlace + 40;

    const bucket = Matter.Bodies.rectangle(x, y, bucketWidth, bucketHeight, { isStatic: true });
    Matter.World.add(world, bucket);
    const animatedValue = new Animated.Value(0);
    buckets.push({
      body: bucket,
      size: [bucketWidth, bucketHeight],
      color: bucketDetails[i].color,
      points: bucketDetails[i].points,
      renderer: Bucket,
      isBucket: true,
      animatedValue: animatedValue,
      borderRadius: 4, 
    });
  }

  return {
    physics: { engine, world },
    floor: { body: floor, size: [screenWidth, 20], color: 'grey', renderer: Floor },
    leftWall: { body: leftWall, size: [20, screenHeight], color: 'transparent', renderer: LeftWall },
    rightWall: { body: rightWall, size: [20, screenHeight], color: 'transparent', renderer: RightWall },
    ...Object.fromEntries(plinkos.map((plinko, i) => [`plinko_${i}`, plinko])),
    ...Object.fromEntries(buckets.map((bucket, i) => [`bucket_${i}`, bucket])),
  };
}
