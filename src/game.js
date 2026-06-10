import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';
import Menu from './menu.js';

let config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 320,
  height: 224,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  scene: [Boot, Menu, Level, End],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

new Phaser.Game(config);
