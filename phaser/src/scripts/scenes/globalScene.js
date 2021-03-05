import SCENES from './scenes'
import utils from '../utils/utils'

export default class GlobalScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.GLOBAL
        })
    }

    create(){
        this.model = this.sys.game.globals.model
    }

    update() {
        if (utils.isLandscape && !this.scene.isPaused(SCENES.GAME)) {
            this.scene.pause(this.model.currentScene)
        } else if (!utils.isLandscape && this.scene.isPaused(SCENES.GAME)) {
            this.scene.resume(this.model.currentScene)
        }
        // console.log(this.currentScene)
    }
}