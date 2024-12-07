// import { Phaser } from "phaser";
import config from "./config";
import { Phaser } from 'phaser';

export default class Game extends Phaser.Game {
  constructor() {
    super({
      ...config,
      scene: [],
    });
  }
}
