// import { Phaser } from "phaser";
import config from "./config";
import Phaser from 'phaser';
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

export default class Game extends Phaser.Game {
  constructor() {
    super({
      ...config,
      scene: [PreloadScene, MainScene],
    });
  }
}
