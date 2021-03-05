export default class InputKeys extends Phaser.Input.InputPlugin {
    constructor(config){
        super(config)
        this.scene = config

        this.init()
    }
    init(){
        this.KEY_SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.RIGHT_ARROW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.LEFT_ARROW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    }
}