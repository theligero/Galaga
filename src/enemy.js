export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, gridX, gridY, texture, hp, type) {
    super(scene, gridX, gridY, texture);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.maxHp = hp;
    this.hp = hp;
    this.enemyType = type;

    this.state = 'ENTERING';
    this.gridX = gridX;
    this.gridY = gridY;
    this.timeOffset = Math.random() * Math.PI * 2;

    this.diveTime = 0;
    this.diveDuration = 2600;
    this.diveStartX = gridX;
    this.diveStartY = gridY;
    this.diveTargetX = gridX;

    this.body.setSize(12, 12);
    this.body.setOffset(2, 2);

    const animKey = `${this.enemyType}_idle`;
    if (this.scene.anims.exists(animKey)) {
      this.play(animKey);
    }
  }

  enterFormation(startX, startY, delay = 0) {
    this.state = 'ENTERING';
    this.setPosition(startX, startY);
    this.body.enable = false;

    this.scene.tweens.add({
      targets: this,
      x: this.gridX,
      y: this.gridY,
      delay,
      duration: 900,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        if (!this.active) return;
        this.state = 'GRID';
        this.body.enable = true;
      }
    });
  }

  getScoreValue() {
    const baseScores = {
      blue_bee: 50,
      orange_butterfly: 80,
      blue_crab: 150
    };

    const diveMultiplier = this.state === 'DIVING' ? 2 : 1;
    return (baseScores[this.enemyType] || 50) * diveMultiplier;
  }

  takeDamage(amount) {
    this.hp -= amount;

    if (this.hp > 0) {
      this.setTint(0xff7777);
      this.scene.time.delayedCall(90, () => {
        if (this.active) this.clearTint();
      });
      return false;
    }

    this.explode();
    return true;
  }

  explode() {
    const explosion = this.scene.add.sprite(this.x, this.y, 'enemy_explosion');
    explosion.play('enemy_exploding');
    explosion.once('animationcomplete', () => explosion.destroy());
    this.destroy();
  }

  attack(player) {
    if (!this.active || this.state !== 'GRID') return;

    this.state = 'DIVING';
    this.diveTime = 0;
    this.diveStartX = this.x;
    this.diveStartY = this.y;
    this.diveTargetX = Phaser.Math.Clamp(player.x + Phaser.Math.Between(-35, 35), 24, this.scene.PLAYFIELD_WIDTH - 24);
    this.body.enable = true;
  }

  returnToFormation() {
    if (!this.active) return;

    this.state = 'ENTERING';
    this.setRotation(0);
    this.setPosition(this.gridX, -20);
    this.body.enable = false;

    this.scene.tweens.add({
      targets: this,
      x: this.gridX,
      y: this.gridY,
      duration: 700,
      ease: 'Sine.easeOut',
      onComplete: () => {
        if (!this.active) return;
        this.state = 'GRID';
        this.body.enable = true;
      }
    });
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.state === 'GRID') {
      this.x = this.gridX + Math.sin(t / 520 + this.timeOffset) * 7;
      this.y = this.gridY + Math.cos(t / 700 + this.timeOffset) * 3;
      this.setRotation(0);
    } else if (this.state === 'DIVING') {
      this.diveTime += dt;
      const p = Phaser.Math.Clamp(this.diveTime / this.diveDuration, 0, 1);

      this.x = Phaser.Math.Linear(this.diveStartX, this.diveTargetX, p) + Math.sin(p * Math.PI * 5) * 28;
      this.y = Phaser.Math.Linear(this.diveStartY, this.scene.game.config.height + 35, p);
      this.setRotation(Math.sin(p * Math.PI * 4) * 0.45);

      if (p >= 1) {
        this.returnToFormation();
      }
    }
  }
}
