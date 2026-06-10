import Player from './player.js';
import Bullet from './bullet.js';
import Enemy from './enemy.js';
import EnemyBullet from './enemyBullet.js';

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'level' });

    this.PLAYFIELD_WIDTH = 256;
    this.HUD_WIDTH = 64;
  }

  create() {
    this.PLAYFIELD_WIDTH = 256;
    this.HUD_X = this.PLAYFIELD_WIDTH;

    this.stage = 1;
    this.score = 0;
    this.highScore = this.readHighScore();
    this.lives = 3;
    this.gameActive = false;
    this.respawning = false;
    this.stageStarting = false;

    this.physics.world.setBounds(0, 0, this.PLAYFIELD_WIDTH, this.game.config.height);

    this.createBackground();
    this.createHUD();

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 2,
      runChildUpdate: true
    });

    this.enemyBullets = this.physics.add.group({
      classType: EnemyBullet,
      maxSize: 8,
      runChildUpdate: true
    });

    this.player = new Player(this, this.PLAYFIELD_WIDTH / 2, 198, this.bullets);

    this.enemies = this.physics.add.group({
      runChildUpdate: true
    });

    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.enemyBullets, this.player, this.hitPlayerByBullet, null, this);
    this.physics.add.overlap(this.enemies, this.player, this.hitPlayerByEnemy, null, this);

    this.attackTimer = this.time.addEvent({
      delay: 1700,
      callback: this.triggerEnemyAttack,
      callbackScope: this,
      loop: true
    });

    this.startStageIntro();
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#000000');

    this.stars = [];
    for (let i = 0; i < 55; i++) {
      const star = this.add.rectangle(
        Phaser.Math.Between(0, this.PLAYFIELD_WIDTH - 2),
        Phaser.Math.Between(0, this.game.config.height - 2),
        1,
        1,
        0xffffff,
        Phaser.Math.FloatBetween(0.25, 0.8)
      );
      this.stars.push(star);
    }
  }

  createHUD() {
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x050505, 1);
    hudBg.fillRect(this.HUD_X, 0, this.HUD_WIDTH, this.game.config.height);
    hudBg.lineStyle(1, 0x2244ff, 1);
    hudBg.lineBetween(this.HUD_X, 0, this.HUD_X, this.game.config.height);

    const hudStyle = {
      fontFamily: 'arcade',
      fontSize: '8px',
      color: '#ffffff',
      align: 'center'
    };

    const yellowStyle = { ...hudStyle, color: '#ffff66' };
    const redStyle = { ...hudStyle, color: '#ff5555' };

    this.add.text(this.HUD_X + 32, 8, '1UP', redStyle).setOrigin(0.5, 0);
    this.scoreText = this.add.text(this.HUD_X + 32, 20, '000000', hudStyle).setOrigin(0.5, 0);

    this.add.text(this.HUD_X + 32, 44, 'HIGH', yellowStyle).setOrigin(0.5, 0);
    this.highScoreText = this.add.text(this.HUD_X + 32, 56, this.formatScore(this.highScore), hudStyle).setOrigin(0.5, 0);

    this.stageLabel = this.add.text(this.HUD_X + 32, 92, 'STAGE', yellowStyle).setOrigin(0.5, 0);
    this.stageText = this.add.text(this.HUD_X + 32, 104, '1', hudStyle).setOrigin(0.5, 0);

    this.add.text(this.HUD_X + 32, 146, 'LIVES', yellowStyle).setOrigin(0.5, 0);
    this.lifeIcons = [];
    this.updateHUD();
  }

  startStageIntro() {
    this.gameActive = false;
    this.respawning = true;
    this.stageStarting = true;
    this.clearBullets();
    this.player.resetShip(this.PLAYFIELD_WIDTH / 2, 198);
    this.player.body.setVelocity(0, 0);

    // En vez de enseñar READY mientras suena la intro, esperamos a que termine
    // la canción completa. Así se parece más a una presentación arcade.
    const intro = this.sound.add('stage_intro', { volume: 0.65 });
    let introFinished = false;

    const finishIntro = () => {
      if (introFinished || !this.scene.isActive('level')) return;
      introFinished = true;
      intro.destroy();
      this.showStageReadySequence();
    };

    intro.once('complete', finishIntro);
    intro.play();

    // Fallback por si el navegador no lanza el evento complete por bloqueo o carga rara.
    this.time.delayedCall(8300, finishIntro);
  }

  showStageReadySequence() {
    const stageText = this.add.text(this.PLAYFIELD_WIDTH / 2, 102, `STAGE ${this.stage}`, {
      fontFamily: 'arcade',
      fontSize: '14px',
      color: '#00ffea'
    }).setOrigin(0.5);

    this.time.delayedCall(900, () => {
      if (!this.scene.isActive('level')) return;

      const readyText = this.add.text(this.PLAYFIELD_WIDTH / 2, 132, 'READY', {
        fontFamily: 'arcade',
        fontSize: '12px',
        color: '#ffff66'
      }).setOrigin(0.5);

      this.time.delayedCall(1100, () => {
        if (!this.scene.isActive('level')) return;

        stageText.destroy();
        readyText.destroy();
        this.clearBullets();
        this.loadStageFormation();
        this.respawning = false;
        this.stageStarting = false;
        this.gameActive = true;
      });
    });
  }

  loadStageFormation() {
    this.enemies.clear(true, true);

    const rows = [
      { type: 'blue_crab', hp: 2, y: 34, count: 4, startX: 86 },
      { type: 'orange_butterfly', hp: 1, y: 62, count: 8, startX: 44 },
      { type: 'orange_butterfly', hp: 1, y: 86, count: 8, startX: 44 },
      { type: 'blue_bee', hp: 1, y: 112, count: 10, startX: 32 },
      { type: 'blue_bee', hp: 1, y: 136, count: 10, startX: 32 }
    ];

    let order = 0;
    rows.forEach(row => {
      for (let i = 0; i < row.count; i++) {
        const gridX = row.startX + i * 21;
        const enemy = new Enemy(this, gridX, row.y, row.type, row.hp, row.type);
        this.enemies.add(enemy);

        const fromLeft = order % 2 === 0;
        const startX = fromLeft ? -24 : this.PLAYFIELD_WIDTH + 24;
        const startY = 18 + (order % 5) * 18;
        enemy.enterFormation(startX, startY, order * 55);
        order++;
      }
    });
  }

  triggerEnemyAttack() {
    if (!this.gameActive || this.respawning || this.stageStarting) return;

    const aliveEnemies = this.enemies.getChildren().filter(e => e.active && e.state === 'GRID');
    if (aliveEnemies.length === 0) return;

    const attackers = [Phaser.Utils.Array.GetRandom(aliveEnemies)];

    // De vez en cuando baja una pareja, para que recuerde más al patrón de Galaga.
    if (Phaser.Math.Between(0, 100) > 72 && aliveEnemies.length > 1) {
      const second = Phaser.Utils.Array.GetRandom(aliveEnemies.filter(e => e !== attackers[0]));
      attackers.push(second);
    }

    attackers.forEach((enemy, index) => {
      this.time.delayedCall(index * 280, () => {
        if (!this.gameActive || !enemy.active || !this.player.isAlive) return;
        enemy.attack(this.player);
        this.time.delayedCall(650, () => this.fireEnemyBullet(enemy));
        this.time.delayedCall(1250, () => this.fireEnemyBullet(enemy));
      });
    });
  }

  fireEnemyBullet(enemy) {
    if (!this.gameActive || !enemy.active || enemy.state !== 'DIVING' || !this.player.isAlive) return;

    const bullet = this.enemyBullets.get();
    if (bullet) {
      bullet.fire(enemy.x, enemy.y + 8, this.player.x);
    }
  }

  hitEnemy(bullet, enemy) {
    if (!this.gameActive || !enemy.active) return;

    this.disableProjectile(bullet);

    const scoreValue = enemy.getScoreValue();
    const isDead = enemy.takeDamage(1);

    if (isDead) {
      this.sound.play(Phaser.Math.Between(0, 1) === 0 ? 'enemy_dead_1' : 'enemy_dead_2', { volume: 0.5 });
      this.addScore(scoreValue);
      this.checkStageClear();
    }
  }

  hitPlayerByBullet(obj1, obj2) {
    const bullet = obj1 instanceof EnemyBullet ? obj1 : obj2;
    const player = obj1 === this.player ? obj1 : obj2;

    if (!this.gameActive || this.respawning || !player.isAlive) return;

    this.disableProjectile(bullet);
    this.loseLife();
  }

  hitPlayerByEnemy(obj1, obj2) {
    // En Phaser Arcade, con grupo vs sprite, el orden que llega al callback
    // puede no ser el que esperamos. Por eso detectamos quién es realmente quién.
    const enemy = obj1 instanceof Enemy ? obj1 : obj2;
    const player = obj1 === this.player ? obj1 : obj2;

    if (!this.gameActive || this.respawning || !player.isAlive || enemy.state === 'ENTERING') return;

    if (enemy.active && typeof enemy.explode === 'function') {
      enemy.explode();
    } else if (enemy.active) {
      enemy.destroy();
    }

    this.loseLife();
  }

  loseLife() {
    if (this.respawning || !this.player.isAlive) return;

    this.gameActive = false;
    this.respawning = true;
    this.lives--;
    this.updateHUD();
    this.clearBullets();

    this.sound.play('player_dead', { volume: 0.65 });
    
    const explosion = this.add.sprite(this.player.x, this.player.y, 'player_explosion');
    explosion.play('player_exploding');
    explosion.once('animationcomplete', () => explosion.destroy());
    this.player.killShip();

    if (this.lives <= 0) {
      this.saveHighScore();
      this.time.delayedCall(1500, () => this.scene.start('end', { score: this.score, highScore: this.highScore }));
      return;
    }

    const ready = this.add.text(this.PLAYFIELD_WIDTH / 2, 166, 'READY', {
      fontFamily: 'arcade',
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      if (!this.scene.isActive('level')) return;

      ready.destroy();
      this.clearBullets();
      this.player.resetShip(this.PLAYFIELD_WIDTH / 2, 198);

      // Pequeña inmunidad de cortesía: evita que un enemigo en picado o una bala
      // recién creada mate al jugador exactamente en el frame del respawn.
      this.time.delayedCall(650, () => {
        if (!this.scene.isActive('level')) return;
        this.clearBullets();
        this.respawning = false;
        this.gameActive = true;
      });
    });
  }

  checkStageClear() {
    const aliveEnemies = this.enemies.getChildren().filter(e => e.active);
    if (aliveEnemies.length > 0) return;

    this.gameActive = false;
    this.respawning = true;
    this.clearBullets();

    const clearText = this.add.text(this.PLAYFIELD_WIDTH / 2, 118, 'STAGE CLEAR', {
      fontFamily: 'arcade',
      fontSize: '12px',
      color: '#ffff66'
    }).setOrigin(0.5);

    this.time.delayedCall(1800, () => {
      if (!this.scene.isActive('level')) return;

      clearText.destroy();
      this.stage++;
      this.updateHUD();
      this.startStageIntro();
    });
  }

  disableProjectile(projectile) {
    if (!projectile) return;

    if (projectile.body) {
      projectile.body.stop();
      projectile.disableBody(true, true);
    } else {
      projectile.setActive(false);
      projectile.setVisible(false);
    }
  }

  clearBullets() {
    if (this.bullets) {
      this.bullets.getChildren().forEach(b => this.disableProjectile(b));
    }

    if (this.enemyBullets) {
      this.enemyBullets.getChildren().forEach(b => this.disableProjectile(b));
    }
  }

  addScore(points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.updateHUD();
  }

  updateHUD() {
    if (this.scoreText) this.scoreText.setText(this.formatScore(this.score));
    if (this.highScoreText) this.highScoreText.setText(this.formatScore(this.highScore));
    if (this.stageText) this.stageText.setText(String(this.stage));

    this.lifeIcons.forEach(icon => icon.destroy());
    this.lifeIcons = [];

    for (let i = 0; i < this.lives - 1; i++) {
      const icon = this.add.sprite(this.HUD_X + 18 + i * 16, 172, 'player', 6);
      this.lifeIcons.push(icon);
    }
  }

  formatScore(value) {
    return String(value).padStart(6, '0');
  }

  readHighScore() {
    try {
      return Number(localStorage.getItem('galagaHighScore')) || 0;
    } catch (e) {
      return 0;
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem('galagaHighScore', String(this.highScore));
    } catch (e) {
      // Si el navegador bloquea localStorage, simplemente no persistimos la marca.
    }
  }

  update() {
    // Scroll vertical muy sutil para el fondo estrellado.
    this.stars.forEach(star => {
      star.y += 0.15;
      if (star.y > this.game.config.height) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, this.PLAYFIELD_WIDTH - 2);
      }
    });
  }
}
