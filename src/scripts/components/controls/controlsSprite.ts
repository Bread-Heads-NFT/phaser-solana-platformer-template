import * as Phaser from 'phaser';

export default class ControlsSprite extends Phaser.GameObjects.Image {
    type: string
    isDown: boolean;
    onPressed: any;
    onReleased: any;

    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, y, x, 'controls')
        scene.add.existing(this)

        this.setX(x)
            .setY(y)
            .setAlpha(0.1)
            .setRotation(config.rotation)
            .setScrollFactor(0)
            .setScale(0.75)

        this.type = config.type

        // hide control on non-touch devices
        if (!scene.sys.game.device.input.touch) this.setAlpha(0)

        this.setInteractive();
        this.isDown = false;

        this.onPressed = null;
        this.onReleased = null;

        this.on('pointerdown', () => { this.isDown = true; });
        this.on('pointerup', () => { this.pointerUp(); });
        this.on('pointerout', () => { this.pointerUp(); });
    }

    pointerUp()
    {
        this.isDown = false;
        if(this.onReleased != null) this.onReleased();
    }

    update()
    {
        if(this.isDown && this.onPressed != null) this.onPressed();
    }
}