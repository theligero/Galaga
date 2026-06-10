import Player from './player.js';
import Bullet from './bullet.js';
import Enemy from './enemy.js'

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'level'});

    // Definición de niveles
    this.levelConfig = [
      {
        id: 1,
        waves: [
          { type: 'blue_bee', x: 60, y: 40, hp: 1 },
          { type: 'orange_butterfly', x: 196, y: 40, hp: 1 },
          { type: 'blue_crab', x: 128, y: 20, hp: 2 }
        ]
      }
    ];
    this.currentLevel = 0;
  }

  create() {
    // Pool de balas
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true
    });

    this.player = new Player(this, 125, 200, this.bullets);

    // Pool de enemigos modificado para ejecutar preUpdate
    this.enemies = this.physics.add.group({
      runChildUpdate: true
    });

    // Cargamos la primera oleada
    this.loadLevel(this.currentLevel);

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    // Temporizador para que un enemigo aleatorio ataque cada x segundos
    this.time.addEvent({
      delay: 3000,
      callback: this.triggerEnemyAttack,
      callbackScope: this,
      loop: true
    });
  }

  loadLevel(index) {
    const levelData = this.levelConfig[index];
    levelData.waves.forEach(enemyData => {
      let enemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.type, 
        enemyData.hp, enemyData.type);
      this.enemies.add(enemy);
    })
  }

  triggerEnemyAttack() {
    const aliveEnemies = this.enemies.getChildren().filter(e => e.active && e.state === 'GRID');
    if (aliveEnemies.length > 0) {
      // Selecciona un enemigo aleatorio de la formación para que rompa filas
      const randomEnemy = Phaser.Utils.Array.GetRandom(aliveEnemies);
      randomEnemy.attack();
    }
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