export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp, type) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Estadísticas
        this.hp = hp;
        this.enemyType = type;

        // Máquina de estados para las trayectorias
        this.state = 'GRID';

        // Coordenadas base en la formación
        this.gridX = x;
        this.gridY = y;

        // Offset de tiempo para que no todos se muevan a la vez en la formación
        this.timeOffset = Math.random() * Math.PI * 2;

        // Creamos de forma dinámica el nombre de la animación
        let animKey = `${this.enemyType}_idle`;

        // Comprobamos si la animación existe
        if (this.scene.anims.exists(animKey)) {
            this.play(animKey);
        }
    }

    /**
     * Lógica de vidas 
     */
    takeDamage(amount) {
        this.hp -= amount;

        // Si sobrevive al impacto, parpadea en rojo
        if (this.hp > 0) {
            this.setTint(0xff7777);
            this.scene.time.delayedCall(90, () => {
                if (this.active) this.clearTint();
            });
            return false; // sigue vivo
        }

        this.destroy();
        return true; // ha muerto
    }

    attack() {
        this.state = 'DIVING';
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // Lógica de trayectorias matemáticas
        if (this.state === 'GRID') {
            // Trayectorias de "respiración": movimiento senoidal en la formación
            this.x = this.gridX + Math.sin(t / 500 + this.timeOffset) * 15;
            this.y = this.gridY + Math.cos(t / 500 + this.timeOffset) * 5;
        } else if (this.state === 'DIVING') {
            // Trayectoria de ataque: caída en zig-zag
            this.y += 2;
            this.x += Math.sin(t / 500) * 4;

            // Si el enemigo sale por la parte inferior de la pantalla
            if (this.y > 250) {
                this.y = -20; // vuelve por arriba
                this.state = 'GRID'; // regresa a la formación
            }
        }
    }
}