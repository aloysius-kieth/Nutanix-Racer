import SCENES from './scenes'
import PinholeSceneBase from '../transitions/pinholeSceneBase'
import InputKeyHandler from '../utils/inputKeys'
import constants from '../config/constants'
import utils from '../utils/utils'

import ScoreManager from '../managers/scoreManager'
import Coin from '../objects/coin'
import Cone from '../objects/cone'
import Car from '../objects/car'
import Heart from '../objects/heart'
import ParallaxBackground from '../objects/parallaxBackground'
import GameTimer from '../objects/gameTimer'
import DebugText from '../objects/debugText'
import ObjectPooler from '../objects/objectPooler'
import Countdown from '../objects/countdown'

var width, height
var gameSettings = {
    spawnRate: 2000,
    maxSpawnRate: 800, // maximum spawn rate the game will go at
    initialSpeed: 200,
    maxSpeed: 2,
    speedFactor: 40,
    spawnFactor: 30,
    pointsPerCoin: 5
}

let hearts = []

let scoremanager
let background
let roadBackground

let LANE_SPAWN_POSITION
let gameTimer
let spawnTimer

export default class GameScene extends PinholeSceneBase {
    constructor() {
        super(SCENES.GAME)
    }
    preload() {
        super.preload()
        this.cameras.main.setBackgroundColor(0x000000)
    }
    create() {
        super.create()

        this.inputKeyHandler = new InputKeyHandler(this)

        width = this.sys.game.config.width
        height = this.sys.game.config.height
        this.coinHeight = this.textures.get('coin1').getSourceImage().height
        this.coneHeight = this.textures.get('cone').getSourceImage().height
        this.heartHeight = this.textures.get('heart').getSourceImage().height

        var gameTimerTextConfig = {
            fontSize: '26px',
            fill: '#ffffff',
            fontFamily: 'Gotham-BlackItalic',
            align: 'center'
        }

        gameTimer = new GameTimer({
            scene: this,
            x: width / 2,
            y: this.textures.get('timerbox').getSourceImage().height,
            texture: 'timerbox'
        }, '00:00:00', gameTimerTextConfig)

        this.addBackground()
        if (!utils.CheckDesktopBrowser()) {
            this.addGUIControls()
        }
        scoremanager = new ScoreManager(this, 0, 0, {
            fill: '#014189',
            fontFamily: 'Gotham-BlackItalic',
            align: 'right'
        })
        scoremanager.addScorebox(width / 2 - roadBackground.displayWidth / 2.31, height / 2 - roadBackground.displayHeight / 2.7)

        if (this.model.gameSettings().debugLog) {
            this.debugText = new DebugText({
                scene: this,
                x: 16,
                y: 16
            }, {
                fill: '#00FF9A',
                fontFamily: 'monospace',
                fontSize: '26px',
                lineSpacing: 4
            })
        }

        this.player = new Car(this.scene, width / 2, 0)
        this.player.y = height - this.player.displayHeight / 3

        for (var i = 0; i < constants.MAX_LIVES; i++) {
            var heart = new Heart({
                scene: this,
                x: width / 2 + roadBackground.displayWidth / 2,
                y: i + this.heartHeight / 2
            })
            hearts.push(heart)
        }

        for (var i = 0; i < hearts.length; i++) {
            var h = hearts[i]
            h.y += i * this.heartHeight
        }

        // this.coinGrp = this.physics.add.group({
        //     classType: Coin,
        //     maxSize: 100,
        //     visible: false,
        //     active: false,
        //     runChildUpdate: true
        // })
        this.coinGrp = new ObjectPooler(this, Coin, constants.COIN_POOL_SIZE)
        this.coneGrp = new ObjectPooler(this, Cone, constants.CONE_POOL_SIZE)
        // this.coneGrp = this.physics.add.group({
        //     classType: Cone,
        //     maxSize: 100,
        //     visible: false,
        //     active: false,
        //     runChildUpdate: true
        // })
        this.initSettings()
        // this.count = 2

        this.physics.add.collider(this.player, this.coinGrp, this.onCoinCollidePlayer)
        this.physics.add.collider(this.player, this.coneGrp, this.onConeCollidePlayer)
        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            this.time.delayedCall(4000, () => {
                this.addCountdown()
            })
        })

        gameTimer.emitter.on('onStart', this.onGamestart, this)
        gameTimer.emitter.on('onGameover', this.onGameover, this)
        // this.countEmit.on('onCount', this.onCount, this)
    }
    initSettings() {
        var spawnTimerConfig = {
            delay: gameSettings.spawnRate,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true,
            paused: true
        }

        gameSettings.spawnRate = this.model.gameSettings().spawnRate
        gameSettings.spawnFactor = this.model.gameSettings().spawnFactor
        gameSettings.speedFactor = this.model.gameSettings().speedFactor
        gameSettings.maxSpawnRate = this.model.gameSettings().maxSpawnRate
        gameSettings.initialSpeed = this.model.gameSettings().initialSpeed
        gameSettings.maxSpeed = this.model.gameSettings().maxSpeed
        gameSettings.pointsPerCoin = this.model.gameSettings().pointsPerCoin

        this.initialSpeed = gameSettings.initialSpeed
        spawnTimer = this.time.addEvent(spawnTimerConfig)
        LANE_SPAWN_POSITION = [[(width / 2 - roadBackground.displayWidth / 4), 0], [width / 2, 0], [(width / 2 + roadBackground.displayWidth / 4), 0]]
    }
    updateGameTimer() {
        let elapsedTime = gameTimer.timer.getElapsedSeconds();
        let minutes = Math.floor(elapsedTime / 60)
        let seconds = Math.floor(elapsedTime - (minutes * 60))
        let fraction = elapsedTime * 1000
        fraction = (fraction % 1000)
        if (minutes < 10) {
            minutes = '0' + minutes
        } if (seconds < 10) {
            seconds = '0' + seconds
        }
        gameTimer.timerText.text = minutes.toString() + ":" + seconds.toString() + ":" + fraction.toString().substr(0, 2);
    }
    update(time, delta) {
        if (!gameTimer.gameOver) {

            this.updateGameTimer()

            if (roadBackground) {
                roadBackground.update(delta)
            }

            this.raceWordsBackground.tilePositionY -= roadBackground.speed * delta

            // this.coinGrp.getChildren().forEach(coin => {
            //     coin.update(time, delta)
            // })
            // this.coinGrp.update(time, delta)
            // this.coneGrp.update(time, delta)
            this.coinGrp.update(time, delta)
            this.coneGrp.update(time, delta)
            this.coinGrp.getChildren().forEach((e) => {
                e.update(time, delta)
            })
            this.coneGrp.getChildren().forEach((e) => {
                e.update(time, delta)
            })
            // this.coneGrp.getChildren().forEach(cone => {
            //     cone.update(time, delta)
            // })
            if (utils.CheckDesktopBrowser()) {
                if (Phaser.Input.Keyboard.JustDown(this.inputKeyHandler.LEFT_ARROW)) {
                    this.playerMove(true)
                } else if (Phaser.Input.Keyboard.JustDown(this.inputKeyHandler.RIGHT_ARROW)) {
                    this.playerMove(false)
                }
            }

            if (this.debugText != null) {
                this.debugText.update([
                    this.coinGrp.getLength(),
                    this.coinGrp.maxSize,
                    this.coinGrp.countActive(true),
                    this.coinGrp.countActive(false),
                    this.coinGrp.getTotalUsed(),
                    this.coinGrp.getTotalFree(),
                    this.coinGrp.isFull(),
                    gameSettings.spawnRate,
                    Phaser.Math.GetSpeed(this.initialSpeed, 1),
                    this.initialSpeed])
            }
        }

        // if (this.model.gameSettings().debugMode) {
        //     if (Phaser.Input.Keyboard.JustDown(this.inputKeyHandler.KEY_SPACE) && this.gameTimer.gameOver) {
        //         this.startSpawn()
        //         this.startGameTimer()
        //     }
        // }
    }
    onCount() {
        this.countdown.count -= 2
        if (this.countdown.count == 0) {
            this.countdown.cdText.text = 'GO!'
            this.countdown.cdNumberText.text = '1'
        }
    }
    onGamestart(gameStarted) {
        gameTimer.gameOver = gameStarted
    }
    onGameover() {
        this.stopMusic(this.AUDIO.bgm)
        this.playSoundCallback(this.AUDIO.gameover, () => {
            this.gotoResultpage()
        })
    }
    onCoinCollidePlayer(player, coin) {
        coin.playSound()
        coin.destroy()
        scoremanager.addScore(gameSettings.pointsPerCoin)
    }
    onConeCollidePlayer(player, cone) {
        if (player.invunerable) {
            return
        }
        cone.playSound()
        cone.destroy()
        player.hurtBlink()
        player.lives--
        for (var i = hearts.length; i >= 0; i--) {
            if (player.lives == i) {
                hearts[i].onHurt()
            }
        }
        if (player.lives <= 0) {
            gameTimer.stopClock()
            spawnTimer.destroy()

            player.playAnimation('car-death')
            player.playExplodeSound()
        }
    }
    gotoResultpage() {
        this.saveSessionData()
        var resultData = {
            playID: this.model.userID,
            score: scoremanager.getScore(),
            timetaken: gameTimer.getElapsedTime()
        }
        if (!this.model.gameSettings().debugMode) {
            this.apicall.updateScore(this.model.userID, resultData, (result, success) => {
                if (success) {
                    if (result) {
                        this.log(`Send ${scoremanager.getScore()} | ${gameTimer.getElapsedTime()}`)
                        this.scene.transition({
                            duration: 2500,
                            target: SCENES.RESULT,
                        })
                    }
                }
                else {
                    this.log('ERROR <updateScore>')
                }
            })
        } else {
            this.scene.transition({
                duration: 2500,
                target: SCENES.RESULT,
            })
        }
    }
    addBackground() {
        background = this.add.image(0, 0, 'background')
        background.displayWidth = width
        background.displayHeight = height
        background.setOrigin(0, 0)
        roadBackground = new ParallaxBackground({
            scene: this,
            texture: 'background'
        })
        this.raceWordsBackground = this.add.tileSprite(width / 2, height / 2, 0, 0, 'road_words')
        this.raceWordsBackground.displayWidth = width
        this.raceWordsBackground.displayHeight = height
        this.raceWordsBackground.setOrigin(0.5)
        this.raceWordsBackground.setScrollFactor(0)
    }
    addCountdown() {
        this.countdown = new Countdown(this)
        this.countdown.countEmit.on('onCount', this.onCount, this)
        this.time.delayedCall(1250, () => {
            this.countdown.startCount()
        })
    }
    addGUIControls() {
        this.leftArrowBtn = this.add.sprite(0, 0, 'button')
        this.leftArrowBtn.x = this.leftArrowBtn.displayWidth / 2
        this.leftArrowBtn.y = height - this.leftArrowBtn.displayWidth / 2
        this.leftArrowBtn.setInteractive()
        this.leftArrowBtn.on('pointerdown', () => {
            if (!gameTimer.gameOver) {
                this.playerMove(true)
            }
        })
        this.rightArrowBtn = this.add.sprite(0, 0, 'button')
        this.rightArrowBtn.x = width - this.rightArrowBtn.displayWidth / 2
        this.rightArrowBtn.y = height - this.rightArrowBtn.displayWidth / 2
        this.rightArrowBtn.flipX = true
        this.rightArrowBtn.setInteractive()
        this.rightArrowBtn.on('pointerdown', () => {
            if (!gameTimer.gameOver) {
                this.playerMove(false)
            }
        })
    }
    playerMove(left) {
        var pos = [(width / 2 - roadBackground.displayWidth / 4), this.width / 2, (width / 2 + roadBackground.displayWidth / 4)]
        if (this.player != null) {
            // this.player press left
            if (left) {
                if (this.player.lane == this.player.LANE.LEFT) {
                    return
                } else if (this.player.lane == this.player.LANE.RIGHT) {
                    this.player.move(this.player.LANE.MIDDLE, pos)
                } else if (this.player.lane == this.player.LANE.MIDDLE) {
                    this.player.move(this.player.LANE.LEFT, pos)
                }
            } else { // this.player press right
                if (this.player.lane == this.player.LANE.RIGHT) {
                    return
                } else if (this.player.lane == this.player.LANE.LEFT) {
                    this.player.move(this.player.LANE.MIDDLE, pos)
                } else if (this.player.lane == this.player.LANE.MIDDLE) {
                    this.player.move(this.player.LANE.RIGHT, pos)
                }
            }
        }
    }
    spawnObstacle() {
        var obstacleNum = Phaser.Math.Between(1, 3)
        var randType = Phaser.Math.FloatBetween(0, 1)
        var obstacle = []
        var randPos = Phaser.Math.Between(0, LANE_SPAWN_POSITION.length - 1)
        if (randType >= 0.5) {
            for (var i = 0; i < obstacleNum; i++) {
                obstacle.push(this.coinGrp.get())
            }
            if (obstacle.length > 0) {
                for (var i = 0; i < obstacle.length; i++) {
                    obstacle[i].spawn(LANE_SPAWN_POSITION[randPos][0], -(i + 1) * this.coinHeight)
                }
            }
        } else {
            for (var i = 0; i < obstacleNum; i++) {
                obstacle.push(this.coneGrp.get())
            }
            if (obstacle.length > 0) {
                for (var i = 0; i < obstacle.length; i++) {
                    obstacle[i].spawn(LANE_SPAWN_POSITION[randPos][0], -(i + 1) * this.coneHeight)
                }
            }
        }

        roadBackground.speed = Phaser.Math.GetSpeed(this.initialSpeed, 1)
        this.coinGrp.getChildren().forEach(e => {
            e.speed = Phaser.Math.GetSpeed(this.initialSpeed, 1)
        })
        this.coneGrp.getChildren().forEach(e => {
            e.speed = Phaser.Math.GetSpeed(this.initialSpeed, 1)
        })
    }
    addObstacle() {
        // if (gameSettings.spawnRate > gameSettings.maxSpawnRate) {
        //     gameSettings.spawnRate -= gameSettings.spawnFactor
        //     //gameSettings.obstacleVelocity = 675000 / gameSettings.spawnRate
        //     spawnTimer.delay = gameSettings.spawnRate
        //     this.initialSpeed += gameSettings.speedFactor
        // }
        if (this.initialSpeed <= gameSettings.maxSpeed) {
            gameSettings.spawnRate -= gameSettings.spawnFactor
            spawnTimer.delay = gameSettings.spawnRate
            this.initialSpeed += gameSettings.speedFactor
        }
        this.spawnObstacle()
    }
    startGameTimer() {
        // Game Timer
        gameTimer.startClock()
    }
    startSpawn() {
        spawnTimer.paused = false
    }
    saveSessionData() {
        utils.SetSessionStorageItem(constants.SESSION_KEYS.GAME_SCORE, scoremanager.getScore())
    }
}