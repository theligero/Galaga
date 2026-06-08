export default class Menu extends Phaser.Scene {
    constructor() {
        super({key : 'menu' });
    }

    create() {
        this.add.text(this.game.config.width / 2, 40, 'GALAGA', {
            fontSize: '40px',
            fill: '#01data',
            fontFamily: 'arcade'
        })
            .setOrigin(0.5)
            .setStroke('#ffffff', 6);


        this.add.text(this.game.config.width / 2, (this.game.config.height / 2) + 40, 'PLAY', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'arcade'
        })
            .setOrigin(0.5)
            .setInteractive( { useHandCursor: false })
                .on('pointerdown', () => this.startGame());
    }

    startGame() {
        this.scene.start('level');
    }
}
