export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    // Método que llamaremos desde el nivel para disparar
    fire(x, y) {
        this.body.reset(x, y);      // Resetea las físicas
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(-400);    // Velocidad lineal hacia arriba 
    }

    // Phaser ejecuta automáticamente preUpdate si configuramos bien el grupo
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Si la bala sale de la pantalla por arriba, la devolvemos al pool
        if (this.y <= -10) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}