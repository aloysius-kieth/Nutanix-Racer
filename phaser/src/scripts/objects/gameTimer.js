import constants from '../config/constants'

class TimerText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, startTime, config){
        super(scene, x, y, startTime, config)
        scene.add.existing(this)

        this.setOrigin(0.5)
        this.setDepth(constants.SORTING_LAYER.UI)
    }
}

export default class GameTimer extends Phaser.GameObjects.Image {
    constructor(config, startTime, textConfig) {
        super(config.scene, config.x, config.y, config.texture)
        config.scene.add.existing(this)
        this.scene = config.scene

        this.setDepth(constants.SORTING_LAYER.UI)

        this.countUp = true
        this.gameOver = true

        this.timerText = new TimerText(config.scene, 0, 0, startTime, textConfig)

        Phaser.Display.Align.In.Center(this.timerText, this)
        this.emitter = new Phaser.Events.EventEmitter()
        // this.initialize()
    }
    initialize() {
        
    }
    startClock() {
        this.timer = this.scene.time.addEvent({
            delay: Phaser.Math.MAX_SAFE_INTEGER,
            callback: this.onStartClock(),
            callbackScope: this,
            loop: true
        })
    }
    onStartClock() {
        this.emitter.emit('onStart', false)
    }
    stopClock(){
        this.timer.paused = true
        this.gameOver = true
        this.emitter.emit('onGameover', false)
        // this.timer.remove()
    }
    getElapsedTime(){
        return this.timer.elapsed.toFixed()
    }
}