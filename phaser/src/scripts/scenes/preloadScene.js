import SCENES from './scenes'
import BaseScene from './base'
import utils from '../utils/utils'
import constants from '../config/constants'

var loadingCircle
var percentText
var width, height

var loadingText

export default class PreloadScene extends BaseScene {
    constructor() {
        super(SCENES.PRELOAD)
    }
    preload() {
        super.preload()

        this.cameras.main.setBackgroundColor(0xffffff)
        this.scene.launch(SCENES.GLOBAL)

        width = this.cameras.main.centerX
        height = this.cameras.main.centerY

        percentText = this.add.text(width, height, '0 %', {
            font: '36px Gotham-Medium',
            fill: '#004CA6'
        })
        percentText.setOrigin(0.5, 0.45)

        loadingCircle = this.add.graphics();
        loadingCircle.lineStyle(13, 0xC8EF3D)

        loadingText = this.make.text({
            x: width,
            y: height - 120,
            text: 'Loading...',
            style: {
                font: '34px Gotham-Medium',
                fill: '#004CA6'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.loadTextTween = this.tweens.add({
            targets: loadingText,
            ease: 'Linear',
            repeat: -1,
            duration: 500,
            alpha: { from: 0, to: 1 },
            yoyo: true
        })

        // update progress bar
        this.load.on('progress', this.updateProgressBar);

        // update file progress text
        this.load.on('fileprogress', function (file) {
            //assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', () => {
            this.initAudio()

            if (this.model.gameSettings().debugMode) {
                this.model.userID = '3622020093023443195757780150480800ab7bf56f-d4b8-4586-a21d-ba2756f26968'
            } else {
                // let params = new URLSearchParams(location.search)
                // if (params.has('userID')) {
                //     this.model.userID = params.get('userID')
                // }
                this.model.userID = utils.GetSessionStorageItem(constants.SESSION_KEYS.USER_ID)
            }

            this.log('userID: ' + this.model.userID)

            var audio = utils.GetSessionStorageItem(constants.SESSION_KEYS.AUDIO)
            if (audio != '') {
                if (audio == 'off') {
                    this.sound.mute = true
                } else if (audio == 'on') {
                    this.sound.mute = false
                }
            }

            if (this.model.userID != '' && this.model.userID != undefined) {
                this.delay = this.time.delayedCall(3000, function () {
                    loadingText.destroy()
                    percentText.destroy()
                    loadingCircle.destroy()
                    this.ready();
                }, [], this)
            } else {
                loadingText.text = 'No User ID Found!'
            }
        });

        this.ready();

        // load sprites
        this.loadSprites()

        this.loadPNGSeq()

        // load json files
        this.loadJsonFiles()

        // load audio
        this.loadAudio()
    }
    initAudio() {
        let musicProp = {
            volume: this.model.audioSettings().musicVolume,
            loop: true
        }
        let soundProp = {
            volume: this.model.audioSettings().soundFXVolume
        }

        this.sound.add(this.AUDIO.bgm, musicProp)
        for (var i = 1; i < 5; i++) {
            this.sound.add(`coin${i}`, soundProp)
        }
        this.sound.add(this.AUDIO.explode, soundProp)
        this.sound.add(this.AUDIO.countBeep, soundProp)
        this.sound.add(this.AUDIO.countFinish, soundProp)
        this.sound.add(this.AUDIO.cone, soundProp)
        this.sound.add(this.AUDIO.gameover, soundProp)
    }
    loadJsonFiles() {
        this.load.json('settings', 'assets/json/settings.json')
    }
    loadAudio() {
        this.load.audio('bgm', 'assets/audio/bgm/game.mp3')
        for (var i = 1; i < 5; i++) {
            this.load.audio(`coin${i}`, `assets/audio/sfx/coin(${i}).mp3`)
        }
        this.load.audio('explode', 'assets/audio/sfx/explode.mp3')
        this.load.audio('cone', 'assets/audio/sfx/cone.mp3')
        this.load.audio('countdownBeep', 'assets/audio/sfx/countdownBeep.mp3')
        this.load.audio('countdownFinish', 'assets/audio/sfx/countdownFinish.mp3')
        this.load.audio('gameover', 'assets/audio/sfx/gameover.mp3')
    }
    loadSprites() {
        this.load.image('background', 'assets/img/game/bg.png')
        this.load.image('road', 'assets/img/game/road.png')
        this.load.image('road_words', 'assets/img/game/race_words_bg.png')
        this.load.image('car', 'assets/img/game/car.png')
        this.load.image('button', 'assets/img/game/button.png')
        this.load.image('cone', 'assets/img/game/cone.png')
        this.load.image('scorebox', 'assets/img/game/score.png')
        this.load.image('timerbox', 'assets/img/game/timer_box.png')
        this.load.image('heart', 'assets/img/game/heart.png')
        this.load.image('overlay', 'assets/img/game/overlay.png')
    }
    loadPNGSeq() {
        // Car move animation
        for (var i = 1; i < 31; i++) {
            this.load.image(`carMove${i}`, `assets/img/game/animation/CarMove/carMove(${i}).png`)
        }
        // Car death animation
        for (var i = 1; i < 31; i++) {
            this.load.image(`carDeath${i}`, `assets/img/game/animation/CarDeath/carDeath(${i}).png`)
        }
        this.load.image('countdownbox', 'assets/img/game/countdownbox.png')

        // Coin animation
        for (var i = 1; i < 22; i++) {
            this.load.image(`coin${i}`, `assets/img/game/animation/Coin/Coin(${i}).png`)
        }
    }
    init() {
        this.readyCount = 0;
    }
    create() {
        super.create()
        /**
         * This is how you would dynamically import the mainScene class (with code splitting),
         * add the mainScene to the Scene Manager
         * and start the scene.
         * The name of the chunk would be 'mainScene.chunk.js
         * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
         */
        // let someCondition = true
        // if (someCondition)
        //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
        //     this.scene.add('MainScene', mainScene.default, true)
        //   })
        // else console.log('The mainScene class will not even be loaded by the browser')
    }
    ready() {
        this.readyCount++;
        if (this.readyCount === 2) {
            this.scene.start(SCENES.GAME)
        }
    }
    updateProgressBar(value) {
        percentText.setText(Phaser.Math.RoundTo(value * 100) + " %")
        loadingCircle.beginPath()
        loadingCircle.arc(width, height, 80, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad((270 + (value * 360))), false, 0.02)
        loadingCircle.strokePath()

        loadingText.text = value < 0.5 ? 'Preparing...' :
            value < 0.99 ? 'Halfway there!' : 'Done!'
    }
}