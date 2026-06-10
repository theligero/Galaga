export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, bulletGroup) {
    super(scene, x, y, 'player', 6);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(12, 12);
    this.body.setOffset(2, 2);

    this.speed = 95;
    this.bullets = bulletGroup;
    this.isAlive = true;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.lastFired = 0;
  }

  resetShip(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    this.isAlive = true;
    this.body.enable = true;
    this.body.setVelocity(0, 0);
  }

  killShip() {
    this.isAlive = false;
    this.body.setVelocity(0, 0);
    this.body.enable = false;
    this.setVisible(false);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (!this.scene.gameActive || !this.isAlive) {
      if (this.body) this.body.setVelocity(0, 0);
      return;
    }

    const left = this.cursors.left.isDown || this.aKey.isDown;
    const right = this.cursors.right.isDown || this.dKey.isDown;

    if (left && !right) {
      this.body.setVelocityX(-this.speed);
    } else if (right && !left) {
      this.body.setVelocityX(this.speed);
    } else {
      this.body.setVelocityX(0);
    }

    // Disparo tipo arcade: cadencia limitada y pocas balas simultáneas.
    if (this.fireKey.isDown && t > this.lastFired) {
      const bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this.x, this.y - 12);
        this.lastFired = t + 360;
        this.scene.sound.play('shot', { volume: 0.45 });
      }
    }
  }
}
