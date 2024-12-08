import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  // Pré-carregamento de imagens, sprites, aúdios, etc.
  preload() {
    // Os assets devem estar em /public
    this.load.image("background", "assets/images/background.png");

    // Sprites
    this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("player", "assets/spritesheets/player.png", {
      frameWidth: 16,
      frameHeight: 24,
    });
    this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Fonte do jogo
    this.load.bitmapFont(
      "pixelFont",
      "assets/font/font.png",
      "assets/font/font.xml"
    );

    // Áudios (au_name)
    this.load.audio("au_beam", [
      "assets/sounds/beam.ogg",
      "assets/sounds/beam.mp3",
    ]);
    this.load.audio("au_explosion", [
      "assets/sounds/explosion.ogg",
      "assets/sounds/explosion.mp3",
    ]);
    this.load.audio("au_pickUp", [
      "assets/sounds/pickup.ogg",
      "assets/sounds/pickup.mp3",
    ]);
    this.load.audio("au_music", [
      "assets/sounds/sci-fi_platformer12.ogg",
      "assets/sounds/sci-fi_platformer12.mp3",
    ]);
  }

  // Criação de animações e imagens
  create() {
    this.scene.start("MainScene");

    // Criação de animações (am_name)
    this.anims.create({
      key: "am_ship",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_ship2",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_ship3",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_explosion",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
    this.anims.create({
      key: "am_red_powerUp",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_gray_powerUp",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_player",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "am_beam",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1,
    });
  }
}
