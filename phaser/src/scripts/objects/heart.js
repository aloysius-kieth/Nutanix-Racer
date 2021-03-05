import constants from '../config/constants'

export default class Heart extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, 'heart')

        config.scene.add.existing(this)

        // this.x = config.scene.width - this.displayWidth
        this.y = this.displayHeight
        //this.setDepth(constants.SORTING_LAYER.UI + 10)
    }
    onHurt() {
        this.alpha = 0
    }
}