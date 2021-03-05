import SCENES from './scenes'
import BaseScene from './base'
import Global from '../config/global'

export default class BootScene extends BaseScene {
    constructor(){
        super(SCENES.BOOT)
    }
    preload() {
        super.preload() 

        this.load.json('settings', 'assets/json/settings.json')
    }
    create(){
        let global = new Global()
        global.settings = this.cache.json.get('settings')
        this.model.g_settings = this.cache.json.get('settings')
        this.log(global.getSettings())

        this.scene.start(SCENES.PRELOAD)
    }
}