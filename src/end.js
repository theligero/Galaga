export default class End extends Phaser.Scene {
  constructor() {
    super({ key: 'end' });
  }

  create(data) {
    this.cameras.main.setBackgroundColor('#000000');

    const score = data?.score || 0;
    const highScore = data?.highScore || score;

    this.add.text(this.game.config.width / 2, 58, 'GAME OVER', {
      fontFamily: 'arcade',
      fontSize: '22px',
      color: '#ff5555'
    }).setOrigin(0.5);

    this.add.text(this.game.config.width / 2, 104, `SCORE   ${String(score).padStart(6, '0')}`, {
      fontFamily: 'arcade',
      fontSize: '10px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.game.config.width / 2, 126, `HIGH    ${String(highScore).padStart(6, '0')}`, {
      fontFamily: 'arcade',
      fontSize: '10px',
      color: '#ffff66'
    }).setOrigin(0.5);

    this.add.text(this.game.config.width / 2, 174, 'PRESS ANY KEY', {
      fontFamily: 'arcade',
      fontSize: '9px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.time.delayedCall(700, () => {
      this.input.keyboard.once('keydown', () => this.scene.start('menu'));
      this.input.once('pointerdown', () => this.scene.start('menu'));
    });
  }
}
