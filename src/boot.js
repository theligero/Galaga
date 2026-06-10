/**
 * Escena para la precarga de los assets que se usarán en el juego.
 */
export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  preload() {
    this.load.setPath('assets/');

    // Sprites
    this.load.image('bullet', 'sprites/bullet.png');

    // Spritesheets
    this.load.spritesheet('player', 'sprites/player.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('blue_bee', 'sprites/blue_bee.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('blue_crab', 'sprites/blue_crab.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('orange_butterfly', 'sprites/orange_butterfly.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('enemy_explosion', 'sprites/enemy_explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_explosion', 'sprites/player_explosion.png', { frameWidth: 32, frameHeight: 32 });

    // Sonidos
    this.load.audio('shot', 'sounds/shot.mp3');
    this.load.audio('enemy_dead_1', 'sounds/enemy_dead_1.mp3');
    this.load.audio('enemy_dead_2', 'sounds/enemy_dead_2.mp3');
    this.load.audio('stage_intro', 'sounds/stage_intro.mp3');
  }

  create() {
    this.anims.create({
      key: 'blue_crab_idle',
      frames: this.anims.generateFrameNumbers('blue_crab', { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'blue_bee_idle',
      frames: this.anims.generateFrameNumbers('blue_bee', { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'orange_butterfly_idle',
      frames: this.anims.generateFrameNumbers('orange_butterfly', { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_exploding',
      frames: this.anims.generateFrameNumbers('enemy_explosion', { start: 0, end: 4 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'player_exploding',
      frames: this.anims.generateFrameNumbers('player_explosion', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
    });

    this.startMenuWhenFontIsReady();
  }

  startMenuWhenFontIsReady() {
    // La fuente se define por CSS, no por el loader de Phaser. Si entramos al menú
    // antes de que el navegador la tenga lista, el primer render usa una fuente fallback.
    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('38px arcade'),
        document.fonts.load('10px arcade'),
        document.fonts.ready
      ]).then(() => {
        this.scene.start('menu');
      }).catch(() => {
        this.scene.start('menu');
      });
    } else {
      this.scene.start('menu');
    }
  }
}
