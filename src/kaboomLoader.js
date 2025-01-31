import kaboom from '../lib/kaboom.mjs'

export const scale = 2;
export const GRAVITY = 800;
export const PLAYER_SPEED = 150;
export const JUMP_FORCE = 400;

export const k = kaboom({
  width: 640 * scale,
  height: 360 * scale,
  scale,
  letterbox: true,
  global: false,
});

const loadPlayerSprites = () => {
  const sprites = [
    { name: "playerIdle", path: "./assets/Player/Idle.png", sliceX: 6, anims: { idle: { from: 0, to: 5, loop: true } } },
    { name: "playerRun", path: "./assets/Player/Run.png", sliceX: 8, anims: { run: { from: 0, to: 7, loop: true } } },
    { name: "playerJump", path: "./assets/Player/Jump.png", sliceX: 12, anims: { jump: { from: 0, to: 11 } } },
    { name: "playerAttack", path: "./assets/Player/Attack_1.png", sliceX: 5, anims: { attack: { from: 0, to: 4 } } },
    { name: "playerDeath", path: "./assets/Player/dead.png", sliceX: 4, anims: { death: { from: 0, to: 3 } } },
    { name: "playerWalk", path: "./assets/Player/Walk.png", sliceX: 8, anims: { walk: { from: 0, to: 7, loop: true } } },
    { name: "playerShield", path: "./assets/Player/Shield.png", sliceX: 4, anims: { shield: { from: 0, to: 3 } } },
  ];

  sprites.forEach(({ name, path, sliceX, anims }) => {
    k.loadSprite(name, path, { sliceX, anims });
  });
};

loadPlayerSprites();

k.loadSprite("room1", "./maps/room1.png");