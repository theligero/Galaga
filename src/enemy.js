export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, gridX, gridY, texture, hp, type) {
        super(scene, gridX, gridY, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Estadísticas
        this.maxHp = hp;
        this.hp = hp;
        this.enemyType = type;

        // Máquina de estados para las trayectorias
        this.state = 'ENTERING';

        // Coordenadas base en la formación
        this.gridX = gridX;
        this.gridY = gridY;

        // Offset de tiempo para que no todos se muevan a la vez en la formación
        this.timeOffset = Math.random() * Math.PI * 2;

        // Variables para el cálculo del picado matemático
        this.diveTime = 0;
        this.diveDuration = 2600;
        this.diveStartX = gridX;
        this.diveStartY = gridY;
        this.diveTargetX = gridX;

        // Ajuste fino de la hitbox
        this.body.setSize(12, 12);
        this.body.setOffset(2, 2);

        // Creamos de forma dinámica el nombre de la animación
        const animKey = `${this.enemyType}_idle`;

        // Comprobamos si la animación existe
        if (this.scene.anims.exists(animKey)) {
            this.play(animKey);
        }
    }

    enterFormation(startX, startY, delay = 0) {
        this.state = 'ENTERING';
        this.setPosition(startX, startY);
        this.body.enable = false; // sin colisiones mientras entra

        this.scene.tweens.add({
            targets: this,
            x: this.gridX,
            y: this.gridY,
            delay,
            duration: 900,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (!this.active) return;
                this.state = 'GRID';
                this.body.enable = true; // activamos colisiones al llegar a su sitio
            }
        });
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

    attack(player) {
        if (!this.active || this.state !== 'GRID') return;

        this.state = 'DIVING';
        this.diveTime = 0;
        this.diveStartX = this.x;
        this.diveStartY = this.y;
        // Apunta hacia el jugador con un poco de margen aleatorio
        this.diveTargetX = Phaser.Math.Clamp(player.x + Phaser.Math.Between(-35, 35), 24, 232);
        this.body.enable = true;
    }

    returnToFormation() {
        if (!this.active) return;

        this.state = 'ENTERING';
        this.setRotation(0);
        this.setPosition(this.gridX, -20); // aparece arriba
        this.body.enable = false;

        this.scene.tweens.add({
            targets: this,
            x: this.gridX,
            y: this.gridY,
            duration: 700,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (!this.active) return;
                this.state = 'GRID';
                this.body.enable = true;
            }
        });
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // Lógica de trayectorias matemáticas
        if (this.state === 'GRID') {
            // Respiración de la formación
            this.x = this.gridX + Math.sin(t / 520 + this.timeOffset) * 7;
            this.y = this.gridY + Math.cos(t / 700 + this.timeOffset) * 3;
            this.setRotation(0);
        } else if (this.state === 'DIVING') {
            // Interpolación lineal combinada con ondas senoidales
            this.diveTime += dt;
            const p = Phaser.Math.Clamp(this.diveTime / this.diveDuration, 0, 1);

            this.x = Phaser.Math.Linear(this.diveStartX, this.diveTargetX, p) + Math.sin(p * Math.PI * 5) * 28;
            // Baja hasta salir un poco de la pantalla
            this.y = Phaser.Math.Linear(this.diveStartY, 250, p);
            this.setRotation(Math.sin(p * Math.PI * 4) * 0.45);

            if (p >= 1) {
                this.returnToFormation();
            }
        }
    }
}