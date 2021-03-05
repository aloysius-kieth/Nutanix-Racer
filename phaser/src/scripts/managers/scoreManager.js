import d from '../utils/debugLog'
import constants from '../config/constants'

let instance = null
const INITIAL_FONTSIZE = 24

class ScoreText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, config){
        super(scene, x, y, '0', config)
        scene.add.existing(this)
        this.setFontSize(INITIAL_FONTSIZE)
        this.setOrigin(0.5)
        this.setDepth(constants.SORTING_LAYER.UI)
    }
}

class ScoreManager {
    constructor(scene, x, y, config) {
        this.scene = scene

        if (!instance) {
            instance = this
        }

        this.scoreText = new ScoreText(this.scene, x, y, config)
        this.initialize()

        return instance
    }

    initialize() {
        this.score = 0
        this.scoreText.text = this.score.toString()
        this.fontSize = INITIAL_FONTSIZE
        this.currentStrLength = this.scoreText.text.length
    }

    getScore() {
        return this.score
    }

    addScore(amt) {
        this.score += amt
        this.scoreText.setText(this.score.toString())
        if (this.scoreText.text.length > 5) {
            if (this.scoreText.text.length > this.currentStrLength) {
                this.currentStrLength = this.scoreText.text.length
                this.scoreText.setFontSize(this.fontSize * 0.9)
            }
        }
    }

    addScorebox(x, y) {
        this.scorebox = this.scene.add.image(0, 0, 'scorebox')
        this.scorebox.x = x
        this.scorebox.y = y
        // this.scorebox.x = width / 2 - roadBackground.displayWidth / 2.3
        // this.scorebox.y = height / 2 - roadBackground.displayHeight / 2.7

        Phaser.Display.Align.In.Center(this.scoreText, this.scorebox, 5, -15)
    }
}

export default ScoreManager