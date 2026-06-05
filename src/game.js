import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width:  256,
    height: 224,
    scale: {
        mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot, Level, End],
    physics: { 
        default: 'arcade', 
        arcade: { 
            debug: true 
        } 
    }
};

new Phaser.Game(config);