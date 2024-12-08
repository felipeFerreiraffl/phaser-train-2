import Phaser from "phaser";
import config, { gameSettings } from "../config";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  // Criação de lógicas dos arquivos
  create() {
    // Configurações do background
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "background"
    );
    this.background.setOrigin(0, 0);

    // Criação de inimigos
    this.ship = this.add.sprite(
      config.width / 2 - 50,
      config.height / 2,
      "ship"
    );
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(
      config.width / 2 + 50,
      config.height / 2,
      "ship3"
    );

    // Criação de grupo para inimigos
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    // Animações dos inimigos
    this.ship.play("am_ship");
    this.ship2.play("am_ship2");
    this.ship3.play("am_ship3");

    // Criação do jogador
    this.player = this.physics.add.sprite(
      config.width / 2 - 8,
      config.height - 64,
      "player"
    );
    this.player.setCollideWorldBounds(true);

    // Animação do jogador
    this.player.play("am_player");

    // Adição de controles
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Adição dos tiros
    this.projectiles = this.add.group();

    // Armazenamento dos objetos de powerUp
    this.powerUps = this.physics.add.group();

    const maxObjects = 4;
    for (let i = 0; i <= maxObjects; i++) {
      const powerUp = this.physics.add.sprite(16, 16, "powerUp");

      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, config.width, config.height);

      if (Math.random() > 0.5) {
        powerUp.play("am_red_powerUp");
      } else {
        powerUp.play("am_gray_powerUp")
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }
  }

  // Script de coisas que sempre ocorrerão no jogo
  update() {}

  // Funções extras

  // Movimenta as naves no eixo y e retorna ao início quando chega no final
  moveShip(ship, speed) {
    const shipY = (ship.y += speed);
    if (shipY > config.height) {
    }
  }

  // Reseta a posição das naves e as coloca em posições X aleatórias
  resetShipPos(ship) {
    ship.y = 0;

    const randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  // Exclui as naves ao serem clicados
  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("am_explosion");
  }

  // Movimentos do jogador baseado nas setas
  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
  }

  // Ativa o tiro do jogador
  shootBeam() {}

  // Coleta os power ups da tela
  pickPowerUp(powerUp) {
    powerUp.disableBody(true, true);
  }

  // Machuca o jogador quando toca no inimigo
  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);

    if (this.player.alpha < 1) {
      return;
    }

    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false,
    });
  }

  // Machuca o inimigo quando o tiro acerta ele
  hitEnemy(projectile, enemy) {
    projectile.destroy();
    this.resetShipPos(enemy);
  }

  // Adiciona quantidade de zeros à esquerda da pontuação
  zeroPad(number, size) {}

  // Coloca o jogador na posição inicial
  resetPlayer() {
    const x = config.width / 2 - 8;
    const y = config.height + 64;

    this.player.enableBody(true, x, y, true, true);
    this.player.alpha = 0.5;

    const tween = this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: "Power1",
      duration: 1500,
      repeat: 0,
      onComplete: function () {
        this.player.alpha = 1;
      },
      callbackScope: this,
    });
  }
}
