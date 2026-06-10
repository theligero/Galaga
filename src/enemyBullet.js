export default class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
  }

  fire(x, y, targetX) {
    this.enableBody(true, x, y, true, true);
    this.setTint(0xff3355);

    const dx = Phaser.Math.Clamp(targetX - x, -80, 80);
    this.setVelocity(dx, 130);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y > this.scene.game.config.height + 10) {
      this.disableBody(true, true);
      this.body.stop();
    }
  }
}
