import constants from '../config/constants'

class Overlay extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'overlay')
        scene.add.existing(this)

        this.displayWidth = scene.width
        this.displayHeight = scene.height
        this.alpha = 0
        this.setOrigin(0)
        this.setDepth(constants.SORTING_LAYER.UI)
    }
}
class CountdownBox extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'countdownbox')
        scene.add.existing(this)

        this.x = -scene.width * 2
        this.y = scene.height / 2.5
        this.setDepth(constants.SORTING_LAYER.UI)
    }
}

class Countdown {
    constructor(scene) {
        this.scene = scene

        this.count = 2
        this.countEmit = new Phaser.Events.EventEmitter()

        this.overlay = new Overlay(this.scene)
        this.countdownBox = new CountdownBox(this.scene)
        this.cdText = new Phaser.GameObjects.Text(scene, 0, 0, 'READY', {
            fontSize: '40px',
            fill: '#084488',
            fontFamily: 'Gotham-MediumItalic',
            align: 'center'
        })
        this.cdText.alpha = 0
        this.cdText.scale = 0
        this.cdText.setOrigin(0.5)
        this.cdText.setAngle(-12)
        this.cdText.setDepth(constants.SORTING_LAYER.UI)
        Phaser.Display.Align.In.Center(this.cdText, this.countdownBox, -30, 160)
        this.cdNumberText = new Phaser.GameObjects.Text(scene, 0, 0, '3', {
            fontSize: '150px',
            fill: '#084488',
            fontFamily: 'Gotham-BlackItalic',
            align: 'center'
        })
        this.cdNumberText.alpha = 0
        this.cdNumberText.scale = 0
        this.cdNumberText.setOrigin(0.5)
        this.cdNumberText.setAngle(-12)
        this.cdNumberText.setDepth(constants.SORTING_LAYER.UI)
        Phaser.Display.Align.In.Center(this.cdNumberText, this.countdownBox, -60, -40)
        this.scene.add.existing(this.cdText)
        this.scene.add.existing(this.cdNumberText)
    }
    startCount() {
        this.scene.add.tween({
            targets: this.overlay,
            duration: 1000,
            alpha: {
                ease: 'Expo.easeInOut',
                from: 0,
                start: 0,
                to: 1,
            },
            onComplete: () => {
                this.scene.add.tween({
                    targets: this.countdownBox,
                    duration: 1000,
                    x: this.countdownBox.displayWidth / 2,
                    ease: 'Expo.easeInOut',
                    onComplete: () => {
                        Phaser.Display.Align.In.Center(this.cdNumberText, this.countdownBox, -15, -40)
                        Phaser.Display.Align.In.Center(this.cdText, this.countdownBox, 0, 80)
                        this.scene.add.tween({
                            targets: [this.cdText, this.cdNumberText],
                            duration: 1000,
                            alpha: {
                                ease: 'Expo.easeInOut',
                                from: 0,
                                start: 0,
                                to: 1,
                            },
                        })
                        this.scene.add.tween({
                            targets: [this.cdText, this.cdNumberText],
                            duration: 750,
                            scale: {
                                ease: 'Expo.easeInOut',
                                from: 0,
                                start: 0,
                                to: 1,
                            },
                            onComplete: () => {
                                this.scene.playSound(this.scene.AUDIO.countBeep)
                                this.scene.add.tween({
                                    targets: [this.cdText, this.cdNumberText],
                                    duration: 750,
                                    scale: {
                                        ease: 'Expo.easeInOut',
                                        from: 1,
                                        start: 0,
                                        to: 0,
                                    },
                                    onComplete: () => {
                                        this.scene.add.tween({
                                            targets: [this.cdText, this.cdNumberText],
                                            duration: 750,
                                            //repeatDelay: 500,
                                            scale: {
                                                ease: 'Expo.easeInOut',
                                                from: 0,
                                                start: 0,
                                                to: 1,
                                            },
                                            yoyo: true,
                                            repeat: 1,
                                            onStart: () => {
                                                this.cdText.text = 'STEADY'
                                                this.cdNumberText.text = '2'
                                            },
                                            onYoyo: () => {
                                                if (this.count == -2) {
                                                    this.scene.playSound(this.scene.AUDIO.countFinish)
                                                } else {
                                                    this.scene.playSound(this.scene.AUDIO.countBeep)
                                                }
                                            },
                                            onRepeat: () => {
                                                this.countEmit.emit('onCount')
                                            },
                                            onComplete: () => {
                                                this.scene.add.tween({
                                                    targets: this.overlay,
                                                    duration: 1000,
                                                    alpha: {
                                                        ease: 'Expo.easeInOut',
                                                        from: 1,
                                                        start: 0,
                                                        to: 0,
                                                    },
                                                })
                                                this.scene.add.tween({
                                                    targets: this.countdownBox,
                                                    duration: 1000,
                                                    x: -this.scene.width * 2,
                                                    ease: 'Expo.easeInOut',
                                                    onComplete: () => {
                                                        this.scene.playMusic(this.scene.AUDIO.bgm)
                                                        this.scene.startSpawn()
                                                        this.scene.startGameTimer()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

export default Countdown




