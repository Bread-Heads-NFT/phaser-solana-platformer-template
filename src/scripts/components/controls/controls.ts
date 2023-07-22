import * as Phaser from 'phaser';
import ControlsSprite from './controlsSprite';

export default class Controls {
    leftIsDown: boolean
    rightIsDown: boolean
    upIsDown: boolean
    downIsDown: boolean
    buttons: { [key: string]: ControlsSprite } = {}

    private _scene: Phaser.Scene
    private _config: { type: string; rotation: number, x: number, y: number }[]

    constructor(scene: Phaser.Scene) {
        this._scene = scene

        this._config = [
            {
                type: 'left',
                rotation: 1.5 * Math.PI,
                x: 90,
                y: this._scene.cameras.main.height - 90,
            },
            {
                type: 'right',
                rotation: 0.5 * Math.PI,
                x: 240,
                y: this._scene.cameras.main.height - 90,
            },
            {
                type: 'up',
                rotation: 0,
                x: this._scene.cameras.main.width - 90,
                y: this._scene.cameras.main.height - 90,
            },
        ]
        this._config.forEach(el => {
            this.buttons[el.type] = new ControlsSprite(scene, el.x, el.y, el)
        });

        this.buttons['left'].onPressed = () => {this.leftIsDown = true};
        this.buttons['left'].onReleased = () => {this.leftIsDown = false};
        this.buttons['right'].onPressed = () => {this.rightIsDown = true};
        this.buttons['right'].onReleased = () => {this.rightIsDown = false};
        this.buttons['up'].onPressed = () => {this.upIsDown = true};
        this.buttons['up'].onReleased = () => {this.upIsDown = false};
    }

    update() {
        this._config.forEach(el => {
            this.buttons[el.type].update()
        });
    }
}