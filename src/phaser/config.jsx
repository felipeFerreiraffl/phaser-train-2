import { Phaser } from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 272,
  backgroundColor: "#0C0C0C",
  scene: [],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

export default config;
