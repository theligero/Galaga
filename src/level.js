import Player from './player.js';
import Bullet from './bullet.js';

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'level'});
  }

  create() {
    // Pool de balas
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,            // Límite de balas simultáneas en pantalla
      runChildUpdate: true    // Vital para que se ejecute el preUpdate de la clase Bullet
    });
    
    // El jugador
    this.player = new Player(this, 125, 350, this.bullets);

    // Pool de enemigos
    this.enemies = this.physics.add.group();

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
  }

  update(time, delta) {

  }

  hitEnemy(bullet, enemy) {
    // Devolvemos la bala al pool
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.stop();

    // Destruimos al enemigo
    enemy.destroy();

    // Sumamos la puntuación
    this.player.point();
  }
}