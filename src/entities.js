import { Dimensions, Animated } from 'react-native';
import Matter from "matter-js";

//common utils
import { PLINKO_RADIUS, NUMBER_OF_ROWS,  SPACING_Y, PLINKO_COLOR, NUMBER_OF_BUCKETS, BUCKET_HEIGHT, BUCKET_WIDTH } from './utils/commonUtils';

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

  engine.world.gravity.y = 0.1;

  const plinkoRadius = PLINKO_RADIUS;
  const plinkos = [];
  const rows = NUMBER_OF_ROWS;
  const spacingX = (screenWidth - (3 * plinkoRadius * rows)) / (rows + 1) + 8;
  const spacingY = SPACING_Y;

  let lastPlinkoPlace = 0;
  let firstPlinkoOflastRow = 0;
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
        restitution: 0.6,
        friction: 0.5,
        density: 0.1,
        mass: 0.2,
        label: 'plinko'
      });

      Matter.World.add(world, plinko);
      plinkos.push({
        body: plinko,
        size: [plinkoRadius * 2, plinkoRadius * 2],
        color: PLINKO_COLOR,
        renderer: Plinko,
        isPlinko: true,
        isHighlighted: false,
      });
    }
  }

  const floor = Matter.Bodies.rectangle(screenWidth / 2, screenHeight, screenWidth, 20, { isStatic: true });
  const leftWall = Matter.Bodies.rectangle(0, screenHeight / 2, 20, screenHeight, { isStatic: true });
  const rightWall = Matter.Bodies.rectangle(screenWidth, screenHeight / 2, 20, screenHeight, { isStatic: true });

  Matter.World.add(world, [floor, leftWall, rightWall]);

  const buckets = [];
  const numBuckets = NUMBER_OF_BUCKETS;
  const bucketWidth = BUCKET_WIDTH; 
  const bucketHeight = BUCKET_HEIGHT;

  const bucketDetails = [
    { points: 110, color: '#FF0000' },
    { points: 41, color: '#FF0000' },
    { points: 10, color: '#ff6666' },
    { points: 5, color: '#FFA07A' },
    { points: 3, color: '#FF9900' },
    { points: 1.5, color: '#FFC107' },
    { points: 1, color: '#FFC400' },
    { points: 0.5, color: '#ffcc00' },
    { points: 0.3, color: '#ffd11a' },
    { points: 0.5, color: '#ffcc00' },
    { points: 1, color: '#FFC400' },
    { points: 1.5, color: '#FFC107' },
    { points: 3, color: '#FF9900' },
    { points: 5, color: '#FFA07A' },
    { points: 10, color: '#ff6666' },
    { points: 41, color: '#FF0000' },
    { points: 110, color: '#FF0000' }
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
