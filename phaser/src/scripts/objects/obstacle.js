import constants from '../config/constants'

class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        this.scene = scene

        this.speed = 0
        this.depth = constants.SORTING_LAYER.GAME
    }
    spawn(x, y) {
        this.setPosition(x, y)

        this.setActive(true)
        this.setVisible(true)
    }
    update(time, delta) {
        if (this.active && this.visible) {
            this.y += this.speed * delta

            // if (this.y > this.scene.height) {
            //     this.visible = false
            //     this.active = false
            //     //this.destroy()
            // }
        }
    }
}

export default Obstacle