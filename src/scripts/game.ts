import * as Phaser from 'phaser';
import { config } from './config';

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  let loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.visibility = 'hidden';
  }
});