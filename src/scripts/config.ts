import * as Phaser from 'phaser';
import GameScene from './scenes/game';
import LoginScene from './scenes/login';

type scaleMode = 'FIT' | 'SMOOTH'

export const DEFAULT_WIDTH: number = 630
export const DEFAULT_HEIGHT: number = 462

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#FFFFFF',
    parent: 'phaser-game',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    scale: {
      // The game will be scaled manually in the resize()
      mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: false
        },
    },
    scene: [LoginScene, GameScene]
};