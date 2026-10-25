import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

//RF01 construccion de escenario
const SPEED = 9;              
const ROAD_WIDTH = 8;
const PLAYER_LIMIT = 3.2;     
const PLAYER_Z = -3;
const LATERAL_SPEED = 10;
const ROCK_RADIUS = 3.2;
const ROCK_Z = -10;           
const SPAWN_Z = 9;            
const DESPAWN_Z = -16;        
const LANE_COUNT = 5;
const ROW_GAP_MIN = 11;      
const ROW_GAP_MAX = 16;
const MAX_PER_ROW = 2;        
const ROAD_END = -170;       
const ROAD_SPAN = 200;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 12.5, 12.5);
camera.lookAt(0, 0, -4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xaaccee, 0x445533, 1.5));
const light = new THREE.DirectionalLight(0xffffff, 2.5);
light.position.set(4, 10, 8);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 400),
  new THREE.MeshStandardMaterial({ color: 0x4f8a3c })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, -80);
scene.add(ground);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(ROAD_WIDTH, 300),
  new THREE.MeshStandardMaterial({ color: 0x9a7b55 })
);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.02, -80);
scene.add(road);

const curbMaterial = new THREE.MeshStandardMaterial({ color: 0x8d8d8d });
for (const side of [-1, 1]) {
  const curb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 300), curbMaterial);
  curb.position.set(side * (ROAD_WIDTH / 2 + 0.17), 0.15, -80);
  scene.add(curb);
}

const markGeometry = new THREE.BoxGeometry(0.2, 0.03, 2);
const markMaterial = new THREE.MeshStandardMaterial({ color: 0xf2e6c9 });
const marks = [];
for (const x of [-2.4, -0.8, 0.8, 2.4]) {
  for (let i = 0; i < 25; i++) {
    const mark = new THREE.Mesh(markGeometry, markMaterial);
    mark.position.set(x, 0.05, 12 - i * 8);
    scene.add(mark);
    marks.push(mark);
  }
}

const trees = [];

function placeTree(tree, z) {
  const side = Math.random() < 0.5 ? -1 : 1;
  const s = THREE.MathUtils.randFloat(0.8, 1.7);
  tree.scale.setScalar(s);
  tree.position.set(
    side * (ROAD_WIDTH / 2 + THREE.MathUtils.randFloat(2, 16)),
    0.75 * s,
    z
  );
}

for (let i = 0; i < 40; i++) {
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x6b4423 })
  );
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.3, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x2f7d32 })
  );
  leaves.position.y = 2.35;
  trunk.add(leaves);
  placeTree(trunk, THREE.MathUtils.randFloat(ROAD_END, 25));
  scene.add(trunk);
  trees.push(trunk);
}

//RF02 personaje principal - chilly willy

function createMesh(geometry, color) {
  return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: color }));
}

const PLAYER_BASE_Y = 1.0;

// El cuerpo es el objeto principal; el resto son sus hijos (como camera.add(weapon))
const player = createMesh(new THREE.SphereGeometry(0.8, 32, 24), 0x34495e);
player.position.set(0, PLAYER_BASE_Y, PLAYER_Z);      // centro del camino
scene.add(player);

const belly = createMesh(new THREE.SphereGeometry(0.65, 32, 24), 0xffffff);
belly.scale.set(0.95, 1.1, 0.6);
belly.position.set(0, -0.05, 0.5);
player.add(belly);

const head = createMesh(new THREE.SphereGeometry(0.5, 32, 24), 0x34495e);
head.position.set(0, 0.95, 0.1);
player.add(head);

for (const side of [-1, 1]) {
  const eye = createMesh(new THREE.SphereGeometry(0.13, 16, 12), 0xffffff);
  eye.position.set(side * 0.2, 0.1, 0.42);
  head.add(eye);

  const pupil = createMesh(new THREE.SphereGeometry(0.06, 12, 8), 0x111111);
  pupil.position.set(side * 0.2, 0.1, 0.53);
  head.add(pupil);
}

const beak = createMesh(new THREE.ConeGeometry(0.15, 0.4, 12), 0xf39c12);
beak.rotation.x = Math.PI / 2;        // la punta del cono apunta hacia la cámara
beak.position.set(0, -0.1, 0.5);
head.add(beak);

const hatBand = createMesh(new THREE.SphereGeometry(0.5, 24, 16), 0xffffff);
hatBand.scale.set(1.05, 0.35, 1.05);
hatBand.position.set(0, 0.28, 0);
head.add(hatBand);

const hat = createMesh(new THREE.ConeGeometry(0.42, 0.8, 16), 0x2e86de);
hat.position.set(0, 0.7, 0);
hat.rotation.z = -0.2;
head.add(hat);

const pompom = createMesh(new THREE.SphereGeometry(0.11, 12, 8), 0xffffff);
pompom.position.set(0, 0.44, 0);
hat.add(pompom);

const armL = createMesh(new THREE.BoxGeometry(0.15, 0.8, 0.4), 0x2c3e50);
armL.position.set(-0.85, 0.05, 0);
armL.rotation.z = -0.35;
player.add(armL);

const armR = createMesh(new THREE.BoxGeometry(0.15, 0.8, 0.4), 0x2c3e50);
armR.position.set(0.85, 0.05, 0);
armR.rotation.z = 0.35;
player.add(armR);

const legL = createMesh(new THREE.BoxGeometry(0.4, 0.12, 0.6), 0xf39c12);
legL.position.set(-0.3, -0.92, 0.2);
player.add(legL);

const legR = createMesh(new THREE.BoxGeometry(0.4, 0.12, 0.6), 0xf39c12);
legR.position.set(0.3, -0.92, 0.2);
player.add(legR);

//RF03 ROCA GIGANTE  
const loader = new THREE.TextureLoader();
const stoneTexture = await loader.loadAsync('textures/stone.png');
stoneTexture.colorSpace = THREE.SRGBColorSpace;   // textura de color en sRGB

const rock = new THREE.Mesh(
  new THREE.SphereGeometry(ROCK_RADIUS, 50, 50),
  new THREE.MeshStandardMaterial({ map: stoneTexture, roughness: 0.9, metalness: 0.1 })
);
rock.position.set(0, ROCK_RADIUS, ROCK_Z);
scene.add(rock);

//RF04 conos y pirámides reutilizables
const coneGeometry = new THREE.ConeGeometry(0.65, 2, 10);
const pyramidGeometry = new THREE.ConeGeometry(0.85, 1.8, 4);   // cono de 4 caras = pirámide
const obstacleColors = [0xc0392b, 0x6c5b7b, 0x7f8c8d];

const obstacles = [];
for (let i = 0; i < 10; i++) {
  const isCone = i % 2 === 0;
  const obstacle = createMesh(
    isCone ? coneGeometry : pyramidGeometry,
    obstacleColors[i % 3]
  );
  obstacle.height = isCone ? 2 : 1.8;
  obstacle.active = false;
  obstacle.position.y = -50;     // guardado bajo el suelo hasta que se use
  scene.add(obstacle);
  obstacles.push(obstacle);
}

const laneWidth = (PLAYER_LIMIT * 2) / (LANE_COUNT - 1);
let distanceSinceRow = 0;
let nextGap = THREE.MathUtils.randFloat(ROW_GAP_MIN, ROW_GAP_MAX);

function spawnObstacle(lane, z) {
  const free = obstacles.filter((o) => !o.active);
  if (free.length === 0) return;

  const obstacle = free[Math.floor(Math.random() * free.length)];
  const s = THREE.MathUtils.randFloat(0.9, 1.3);
  obstacle.scale.set(s, s, s);
  obstacle.rotation.y = Math.random() * Math.PI;
  obstacle.position.set(
    -PLAYER_LIMIT + lane * laneWidth + THREE.MathUtils.randFloatSpread(0.4),
    (obstacle.height * s) / 2,
    z
  );
  obstacle.active = true;
}

function spawnRow(z) {
  const count = Math.random() < 0.55 ? 1 : MAX_PER_ROW;
  const lanes = [];
  while (lanes.length < count) {
    const lane = Math.floor(Math.random() * LANE_COUNT);
    if (!lanes.includes(lane)) lanes.push(lane);
  }
  for (const lane of lanes) spawnObstacle(lane, z);
}

spawnRow(SPAWN_Z);   // primera fila al empezar

const keys = {};

addEventListener('keydown', e =>
  keys[e.key.toLowerCase()] = true
);

addEventListener('keyup', e =>
  keys[e.key.toLowerCase()] = false
);

let playerVX = 0;
let elapsed = 0;

function updateWorld(delta) {
  const dz = SPEED * delta;

  for (const mark of marks) {
    mark.position.z -= dz;
    if (mark.position.z < ROAD_END) mark.position.z += ROAD_SPAN;
  }

  for (const tree of trees) {
    tree.position.z -= dz;
    if (tree.position.z < ROAD_END) placeTree(tree, tree.position.z + ROAD_SPAN);
  }
}

function updateObstacles(delta) {
  const dz = SPEED * delta;

  distanceSinceRow += dz;
  if (distanceSinceRow >= nextGap) {
    distanceSinceRow = 0;
    nextGap = THREE.MathUtils.randFloat(ROW_GAP_MIN, ROW_GAP_MAX);
    spawnRow(SPAWN_Z);
  }

  for (const o of obstacles) {
    if (!o.active) continue;

    o.position.z -= dz;

    if (o.position.z < ROCK_Z + ROCK_RADIUS * 0.6) {
      o.scale.y *= Math.exp(-delta * 12);
    }
    o.position.y = (o.height * o.scale.y) / 2;

    if (o.position.z < DESPAWN_Z || o.scale.y < 0.02) {
      o.active = false;
      o.position.y = -50;
    }
  }
}

function updatePlayer(delta) {
  let direction = 0;
  if (keys['a'] || keys['arrowleft']) direction -= 1;
  if (keys['d'] || keys['arrowright']) direction += 1;

  playerVX += (direction * LATERAL_SPEED - playerVX) * Math.min(1, delta * 14);
  player.position.x = THREE.MathUtils.clamp(
    player.position.x + playerVX * delta,
    -PLAYER_LIMIT,
    PLAYER_LIMIT
  );

  const t = elapsed * 14;
  player.position.y = PLAYER_BASE_Y + Math.abs(Math.sin(t)) * 0.15;
  legL.position.z = 0.2 + Math.sin(t) * 0.2;
  legR.position.z = 0.2 - Math.sin(t) * 0.2;
  armL.rotation.z = -0.35 - Math.sin(t) * 0.4;
  armR.rotation.z = 0.35 + Math.sin(t) * 0.4;
  player.rotation.z = Math.sin(t * 0.5) * 0.12 - playerVX * 0.02;   // balanceo + inclinación al girar
}

function updateRock(delta) {
  rock.rotation.x += (SPEED * delta) / ROCK_RADIUS;

  rock.position.x += (player.position.x * 0.5 - rock.position.x) * Math.min(1, delta * 2.5);
  rock.position.y = ROCK_RADIUS + Math.abs(Math.sin(elapsed * 5)) * 0.12;
  rock.position.z = ROCK_Z + Math.sin(elapsed * 1.3) * 0.5;
}

function updateCamera(delta) {
  const px = player.position.x;
  camera.position.x += (px * 0.6 - camera.position.x) * Math.min(1, delta * 4);
  camera.lookAt(px * 0.5, 0, -4);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  elapsed += delta;

  updateWorld(delta);
  updateObstacles(delta);
  updatePlayer(delta);
  updateRock(delta);
  updateCamera(delta);

  renderer.render(scene, camera);
}

animate();