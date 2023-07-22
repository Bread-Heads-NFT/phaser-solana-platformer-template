import * as Phaser from 'phaser';
import Player from '../components/player';
import Controls from '../components/controls/controls';

export default class GameScene extends Phaser.Scene {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    controls: Controls;
    player: Player;

    constructor() {
        super('game');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('tiles', 'assets/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('controls', 'assets/controls.png');
    }

    create() {
        console.log(this);
        const map = this.make.tilemap({ key: 'map' });
        map.setCollision([496, 497, 498, 499]);
        console.log('map: ', map);
        const tiles = map.addTilesetImage('Kenney', 'tiles');
        console.log('tilesets: ', map.tilesets);

        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn()

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.input.addPointer(1);
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(map.widthInPixels, map.heightInPixels);

        const layer = map.createLayer(0, tiles!, 0, 0);
        this.player = new Player(this, 100, 100);
        this.controls = new Controls(this);

        this.physics.add.collider(this.player, layer!);
        console.log(layer);

        this.cameras.main.startFollow(this.player);
    }

    update() {
        this.player.update(this.cursors, this.controls);
        this.controls.update();
    }
}