/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets/');

    // Sprites
    this.load.image('bullet', 'sprites/bullet.png');

    // Spritesheets
    this.load.spritesheet('player', 'sprites/player.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('blue_bee', 'sprites/blue_bee.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('blue_crab', 'sprites/blue_crab.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('orange_butterfly', 'sprites/orange_butterfly.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('enemy_explosion', 'sprites/enemy_explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_explosion', 'sprites/player_explosion.png', { frameWidth: 32, frameHeight: 32 });

    // Sonidos
    this.load.audio('shot', 'sounds/shot.mp3');
    this.load.audio('enemy_dead_1', 'sounds/enemy_dead_1.mp3');
    this.load.audio('enemy_dead_2', 'sounds/enemy_dead_2.mp3');
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.anims.create({
      key: 'blue_crab_idle',
      frames: this.anims.generateFrameNumbers('blue_crab', { start: 6, end: 7 }),
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'blue_bee_idle',
      frames: this.anims.generateFrameNumbers('blue_bee', { start: 6, end: 7 }),
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'orange_butterfly_idle',
      frames: this.anims.generateFrameNumbers('orange_butterfly', { start: 6, end: 7 }),
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_exploding',
      frames: this.anims.generateFrameNumbers('enemy_explosion', { start: 0, end: 3 }),
      frameRate: 2,
      repeat: 0
    });

    this.anims.create({
      key: 'player_exploding',
      frames: this.anims.generateFrameNumbers('player_explosion', { start: 0, end: 3 }),
      frameRate: 2,
      repeat: 0
    });

    this.scene.start('menu');
  }
}