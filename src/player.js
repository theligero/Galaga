import Star from './star.js';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, bulletGroup) {
    super(scene, x, y, 'player', 6);
    this.score = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // Queremos que el jugador no se salga de los límites del mundo
    this.body.setCollideWorldBounds();
    this.speed = 40;
    // Esta label es la UI en la que pondremos la puntuación del jugador
    this.label = this.scene.add.text(10, 10, "");
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.updateScore();

    this.bullets = bulletGroup;
    this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.lastFired = 0;
  }

  /**
   * El jugador ha recogido una estrella por lo que este método añade un punto y
   * actualiza la UI con la puntuación actual.
   */
  point() {
    this.score++;
    this.updateScore();
  }
  
  /**
   * Actualiza la UI con la puntuación actual
   */
  updateScore() {
    this.label.text = 'Score: ' + this.score;
  }

  /**
   * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
   * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
   * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
   * @override
   */
  preUpdate(t,dt) {
    super.preUpdate(t,dt);

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
    } else {
      this.body.setVelocityX(0);
    }


    if (this.body.velocity.x != 0 && this.body.velocity.y != 0){
      var aux = this.speed * this.speed / Math.sqrt(this.speed * this.speed + this.speed * this.speed);
      if (this.body.velocity.x > 0) {
        this.body.setVelocityX(aux);
        if (this.body.velocity.y > 0){
          this.body.setVelocityY(aux);
        }
        else{
          this.body.setVelocityY(-aux);
        }
      }
      else{
        this.body.setVelocityX(-aux);
        if (this.body.velocity.y > 0){
          this.body.setVelocityY(aux);
        }
        else{
          this.body.setVelocityY(-aux);
        }
      }
    }

    // Lógica de disparo
    if (this.fireKey.isDown && t > this.lastFired) {
      let bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this.x, this.y - 15);
        this.lastFired = t + 200;
      }
    }
  }
  
}
