import apiCall from '../utils/apiCall'
import d from '../utils/debugLog'

export default class Base extends Phaser.Scene {
    AUDIO = {
        bgm: 'bgm',
        buttonclick: 'buttonclick',
        gameover: 'gameover',
        explode: 'explode',
        cone: 'cone',
        coin1: 'coin1',
        coin2: 'coin2',
        coin3: 'coin3',
        coin4: 'coin4',
        countBeep: 'countdownBeep',
        countFinish: 'countdownFinish',
    }

    width
    height

    p_scene = null
    g_settings = null
    apicall = null

    constructor(scene) {
        super(scene)
        this.p_scene = scene
    }
    preload() {
        this.width = this.sys.game.config.width
        this.height = this.sys.game.config.height

        this.model = this.sys.game.globals.model
        this.model.currentScene = this.p_scene

        //console.log(this.sys.game.globals.model.currentScene)
        this.apicall = new apiCall(this.model.apiSettings())
    }
    create() {

    }
    playSound(key) {
        let sfx = this.sound.get(key)
        if (sfx != null) {
            sfx.play()
        } else {
            console.log('no sfx to play from!')
        }
    }
    playSoundOnce(key, config) {
        this.sound.play(key, config)
    }
    playSoundCallback(key, callback = null) {
        var sfx = this.sound.add(key)
        if (sfx != null) {
            sfx.play()
            sfx.once(Phaser.Sound.Events.COMPLETE, () => {
                if (callback != null) {
                    callback()
                }
                //this.sound.remove(temp)
            })
        } else {
            console.log('no sfx to play from!')
        }
    }
    playMusic(key) {
        let music = this.sound.get(key)
        if (music != null) {
            music.play()
        } else {
            console.log('no music to play from!')
        }
    }
    fadeOutMusic(key, vol = 0, stopPlaying = true, time = 1500) {
        let music = this.sound.get(key)
        if (music != null && music.isPlaying) {
            this.tweens.add({
                targets: music,
                volume: vol,
                duration: time,
                ease: 'Linear',
                onComplete: function () {
                    if (stopPlaying) {
                        music.stop()
                    }
                }
            })
        }
    }
    fadeInMusic(key, vol = 1, time = 1500) {
        let music = this.sound.get(key)
        if (music != null) {
            music.play()
            this.tweens.add({
                targets: music,
                volume: vol,
                duration: time,
                ease: 'Linear',
            })
        }
    }
    stopMusic(key) {
        let music = this.sound.get(key)
        if (music != null) {
            music.stop()
        } else {
            console.log('no music to stop!')
        }
    }
    log(e) {
        d.log(e)
    }
}