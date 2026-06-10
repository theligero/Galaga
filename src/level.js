import Player from './player.js';
import Bullet from './bullet.js';
import Enemy from './enemy.js'

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'level'});

    // Definimos el ancho jugable temporal
    this.PLAYFIELD_WIDTH = 256;
  }

  create() {
    this.score = 0;

    // Pool de balas
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true
    });

    this.player = new Player(this, this.PLAYFIELD_WIDTH / 2, 200, this.bullets);

    // Pool de enemigos modificado para ejecutar preUpdate
    this.enemies = this.physics.add.group({
      runChildUpdate: true
    });

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    // Cargamos la formación dinámica
    this.loadStageFormation();

    // Temporizador para que un enemigo aleatorio ataque cada x segundos
    this.time.addEvent({
      delay: 3000,
      callback: this.triggerEnemyAttack,
      callbackScope: this,
      loop: true
    });
  }

  loadStageFormation() {
    this.enemies.clear(true, true);

    // Definición de filas
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

        // Lógica para que entren alternando desde izquierda y derecha
        const fromLeft = order % 2 === 0;
        const startX = fromLeft ? -24 : this.PLAYFIELD_WIDTH + 24;
        const startY = 18 + (order % 5) * 18;

        // Llamamos al nuevo método con delay
        enemy.enterFormation(startX, startY, order * 55);
        order++;
      }
    });
  }

  triggerEnemyAttack() {
    const aliveEnemies = this.enemies.getChildren().filter(e => e.active && e.state === 'GRID');
    if (aliveEnemies.length === 0) return;

    // Seleccionamos atacantes
    const attackers = [Phaser.Utils.Array.GetRandom(aliveEnemies)];

    // De vez en cuando baja una pareja, para que recuerde más al patrón clásico
    if (Phaser.Math.Between(0, 100) > 72 && aliveEnemies.length > 1) {
      const second = Phaser.Utils.Array.GetRandom(aliveEnemies.filter(e => e !== attackers[0]));
      attackers.push(second);
    }

    attackers.forEach((enemy, index) => {
      this.time.delayedCall(index * 280, () => {
        if (!enemy.active) return;
        enemy.attack(this.player);
      });
    });
  }

  hitEnemy(bullet, enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.stop();

    // Ahora aplicamos daño en lugar de destruir al instante
    const isDead = enemy.takeDamage(1);

    if (isDead) {
      // Lógica de puntuación dependiendo del tipo de enemigo
      let points = (enemy.enemyType === 'blue_crab') ? 2 : 1;
      // Ahora la puntuación la gestiona el nivel, no el jugador
      this.score += points;
      console.log("Score interno: " + this.score); // log temporal
    }
  }
}