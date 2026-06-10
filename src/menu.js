export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    for (let i = 0; i < 45; i++) {
      this.add.rectangle(
        Phaser.Math.Between(0, this.game.config.width - 1),
        Phaser.Math.Between(0, this.game.config.height - 1),
        1,
        1,
        0xffffff,
        Phaser.Math.FloatBetween(0.25, 0.75)
      );
    }

    this.add.text(this.game.config.width / 2, 42, 'GALAGA', {
      fontSize: '38px',
      fill: '#01dada',
      fontFamily: 'arcade'
    })
      .setOrigin(0.5)
      .setStroke('#ffffff', 5);

    this.add.text(this.game.config.width / 2, 100, 'REIMAGINED', {
      fontSize: '10px',
      fill: '#ffff66',
      fontFamily: 'arcade'
    }).setOrigin(0.5);

    this.add.text(this.game.config.width / 2, 145, 'PRESS SPACE', {
      fontSize: '10px',
      fill: '#ffffff',
      fontFamily: 'arcade'
    }).setOrigin(0.5);

    this.add.text(this.game.config.width / 2, 168, 'A/D OR ARROWS  -  SPACE FIRE', {
      fontSize: '7px',
      fill: '#aaaaaa',
      fontFamily: 'arcade'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
  }

  startGame() {
    this.scene.start('level');
  }
}
