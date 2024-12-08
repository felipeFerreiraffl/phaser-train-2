import Phaser from "phaser";
import config, { gameSettings } from "../config";
import Beam from "../classes/Beam";
import Explosion from "../classes/Explosion";

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
        powerUp.play("am_gray_powerUp");
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    // Adição de colisões
    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      function (projectile) {
        projectile.destroy();
      }
    );
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    // Adição de pontuação em cima da tela
    const graphics = this.add.graphics();
    graphics.fillStyle("#000000", 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

    // Adição de sons
    this.beamSound = this.sound.add("au_beam");
    this.explosionSound = this.sound.add("au_explosion");
    this.pickupSound = this.sound.add("au_pickUp");

    // Adição de música
    this.music = this.sound.add("au_music");
    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    };
    this.music.play(musicConfig);
  }

  // Script de coisas que sempre ocorrerão no jogo
  update() {
    // Movimento dos inimigos
    this.moveShip(this.ship, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    // Parallax do fundo
    this.background.tilePositionY -= 0.5;

    // Movimentos do jogador
    this.movePlayerManager();

    // Espaço para atirar
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }

    // Elimina os tiros após chegar a um certo ponto
    for (let i = 0; i < this.projectiles.getChildren().length; i++) {
      const beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  // Funções extras

  // Movimenta as naves no eixo y e retorna ao início quando chega no final
  moveShip(ship, speed) {
    const shipY = (ship.y += speed);
    if (shipY > config.height) {
      this.resetShipPos(ship);
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
  shootBeam() {
    const beam = new Beam(this);
    this.beamSound.play();
  }

  // Coleta os power ups da tela
  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
    this.pickupSound.play();
  }

  // Machuca o jogador quando toca no inimigo
  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);

    if (this.player.alpha < 1) {
      return;
    }

    const explosion = new Explosion(this, player.x, player.y);

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
    const explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    this.resetShipPos(enemy);

    this.score += 15;

    var scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormatted;

    this.explosionSound.play();
  }

  // Adiciona quantidade de zeros à esquerda da pontuação
  zeroPad(number, size) {
    var stringNum = String(number);
    while (stringNum.length < (size || 2)) {
      stringNum = "0" + stringNum;
    }

    return stringNum;
  }

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
