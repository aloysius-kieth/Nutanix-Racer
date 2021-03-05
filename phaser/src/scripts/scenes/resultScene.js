import SCENES from './scenes'
import PineholeSceneBase from '../transitions/pinholeSceneBase'

export default class ResultScene extends PineholeSceneBase {
    constructor() {
        super(SCENES.RESULT)
    }
    preload() {
        super.preload()
        this.cameras.main.setBackgroundColor(0x000000)
    }
    create() {
        super.create()
        this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
            this.time.delayedCall(2000, () => {
                if (this.model.gameSettings().debugMode) {
                    alert('go to result page')
                } else {
                    parent.backToPlayLobby()
                }
            })
        })
    }
}