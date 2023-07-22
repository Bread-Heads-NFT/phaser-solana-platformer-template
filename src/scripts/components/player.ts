import * as Phaser from 'phaser';
import Controls from './controls/controls'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    private isFrozen: Boolean = false;
    private isAlive: Boolean = true;
    private invincibleTimer: Phaser.Time.TimerEvent | null = null;
    private invincible: boolean = false;

    SPEED = 200;
    JUMP_SPEED = 600;
    BOUNCE_SPEED = 200;
    SCALE = 2;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);

        this.scene = scene

        // scene.anims.create({
        //   key: 'walk',
        //   frames: scene.anims.generateFrameNames('player'),
        //   frameRate: 8,
        //   repeat: -1
        // })
        // this.play('walk')

        // this.setVisible(false)

        this.setScale(this.SCALE);
        // this.setOrigin(0, 1)
        // this.setDragX(1500)
        // this.body.setSize(70, 132)
        // this.body.setOffset(25, 24)

        this.createAnimations(this.scene);
    }

    update(cursors: any, controls: Controls) {
        if (this.isFrozen || !this.isAlive) return

        // check if out of camera and kill
        if (this.body.right < 0 || this.body.left > this.scene.cameras.main.getBounds().width || this.body.top > this.scene.cameras.main.getBounds().height) {
            this.die()
        }

        // controls left & right
        if (cursors.left.isDown || controls.leftIsDown) {
            this.moveLeft();
        } else if (cursors.right.isDown || controls.rightIsDown) {
            this.moveRight();
        } else if (this.body.velocity.y > 0) {
            this.anims.play("fall", true);
        } else {
            this.stand();
        }

        // controls up
        if ((cursors.up.isDown || cursors.space.isDown || controls.upIsDown) && this.body.blocked.down) {
            this.jump();
        }

        // const falling = this.body.velocity.y > 0;
        // if (falling) {
        //     this.anims.play("fall", true);
        // }
    }

    moveLeft(): void {
        if (this.isFrozen) return;

        this.body?.setVelocityX(-this.SPEED); // move left

        const isRunning = this.body?.velocity.x !== 0/* && this.body?.velocity.y === 0*/;

        if (isRunning) {
            this.anims.play("run", true);
        }

        this.flipX = true; // flip the sprite to the left
    }

    moveRight(): void {
        if (this.isFrozen) return;

        this.body?.setVelocityX(this.SPEED); // move right

        const isRunning = this.body?.velocity.x !== 0/* && this.body?.velocity.y === 0*/;

        if (isRunning) {
            this.anims.play("run", true);
        }

        this.flipX = false; // use the original sprite looking to the right
    }

    stand(): void {
        this.body?.setVelocityX(0);

        const isStanding =
            this.body?.velocity.x === 0 &&
            this.body?.velocity.y === 0 &&
            this.body?.blocked.down;

        if (isStanding) {
            this.anims.play("stop", true);
        }
    }

    jump() {
        const canJump = this.body?.blocked.down && this.isAlive && !this.isFrozen;

        if (canJump) {
            this.body?.setVelocityY(-this.JUMP_SPEED);
            this.anims.play("jump", true);
            // this.scene.sfx.jump.play();
        }

        return canJump;
    }

    bounce() {
        this.body?.setVelocityY(-this.BOUNCE_SPEED);
    }

    freeze() {
        if (this.body) {
            this.body.enable = false;
        }
        this.anims.play("stop", true);
        this.isFrozen = true;
    }

    die() {
        this.isAlive = false;
        if (this.body) {
            this.body.enable = false;
        }

        // this.anims.play("die");
        this.destroy();
    }

    makeInvincible() {
        this.invincible = true;
        this.invincibleTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.invincible = false;
            }
        });
    }

    isInvincible() {
        return this.invincible;
    }

    private createAnimations(scene: Phaser.Scene) {
        scene.anims.create({
            key: "stop",
            frames: scene.anims.generateFrameNumbers("player", {
                frames: [0]
            })
        });
        scene.anims.create({
            key: "run",
            frames: scene.anims.generateFrameNumbers("player", {
                frames: [3, 4, 5]
            }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: "jump",
            frames: scene.anims.generateFrameNumbers("player", {
                frames: [1]
            })
        });

        scene.anims.create({
            key: "fall",
            frames: scene.anims.generateFrameNumbers("player", {
                frames: [2]
            })
        });
    }
}