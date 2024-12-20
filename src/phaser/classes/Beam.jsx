import Phaser from "phaser";

export default class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        const x = scene.player.x;
        const y = scene.player.y - 16;

        super(scene, x, y, "beam");
        scene.add.existing(this);

        this.play("am_beam");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;

        scene.projectiles.add(this);
    }

    update() {
        if (this.y < 32) {
            this.destroy();
        }
    }
}