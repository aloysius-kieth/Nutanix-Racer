import constants from '../config/constants'

const INVUNERABLE = false

export default class Car extends Phaser.Physics.Arcade.Sprite {
    LANE = {
        LEFT: 1,
        MIDDLE: 2,
        RIGHT: 3,
    }

    constructor(config, x, y) {
        super(config.scene, x, y, 'carMove0')
        this.scene = config.scene
        config.scene.add.existing(this)
        config.scene.physics.add.existing(this)

        this.invunerable = INVUNERABLE
        this.body.setSize(75, 160, true)
        this.body.offset = new Phaser.Math.Vector2(62.5, 70)

        var carMoveAnimKeys = []
        for (var i = 1; i < 31; i++) {
            carMoveAnimKeys.push({ key: `carMove${i}` })
        }
        var carMoveDeathKeys = []
        for (var i = 1; i < 31; i++) {
            carMoveDeathKeys.push({ key: `carDeath${i}` })
        }

        config.scene.anims.create({
            key: 'car-move',
            frames: carMoveAnimKeys,
            frameRate: 25,
            repeat: -1
        })

        config.scene.anims.create({
            key: 'car-death',
            frames: carMoveDeathKeys,
            frameRate: 25,
        })

        this.initialize()
    }
    initialize() {
        this.setImmovable(true)
        this.lives = constants.MAX_LIVES
        this.blink = false
        this.lane = this.LANE.MIDDLE
        this.playAnimation('car-move')
        //this.move(this.lane, this.scene.sys.game.config.width / 2)
    }
    move(laneNum, pos) {
        if (laneNum == this.LANE.LEFT) {
            this.lane = this.LANE.LEFT
            this.scene.tweens.add({
                targets: this,
                ease: 'Linear',
                duration: constants.CAR_MOVE_DURATION,
                x: /*this.scene.sys.game.config.width / 3*/pos[0]
            })
        } else if (laneNum == this.LANE.MIDDLE) {
            this.lane = this.LANE.MIDDLE
            this.scene.tweens.add({
                targets: this,
                ease: 'Linear',
                duration: constants.CAR_MOVE_DURATION,
                x: /*this.scene.sys.game.config.width / 2*/pos[1]
            })
        } else if (laneNum == this.LANE.RIGHT) {
            this.lane = this.LANE.RIGHT
            this.scene.tweens.add({
                targets: this,
                ease: 'Linear',
                duration: constants.CAR_MOVE_DURATION,
                x: /*this.scene.sys.game.config.width / 1.58*/pos[2]
            })
        }
    }
    hurtBlink() {
        if (!this.bink) {
            this.blink = true
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 125,
                yoyo: true,
                onComplete: () => {
                    this.blink = false
                    this.alpha = 1
                }
            })
        }
    }
    playExplodeSound() {
        this.scene.playSound(this.scene.AUDIO.explode)
    }
    playAnimation(anim) {
        this.play(anim)
    }
}