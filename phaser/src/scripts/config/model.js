export default class Model {
    constructor() {
        this.userID = ""

        this._currentScene = null

        this._base_gameWidth = 720
        this._base_gameHeight = 1280

        this.g_settings = new globalSettings()
    }
    set currentScene(value) {
        this._currentScene = value
    }
    get currentScene() {
        return this._currentScene
    }
    gameSettings() {
        return this.g_settings.game
    }
    audioSettings() {
        return this.g_settings.audio
    }
    apiSettings() {
        return this.g_settings.api
    }
}

class globalSettings {
    constructor() {
        this.settings = {
            game: {
                debugMode: false,
                debugLog: true,
                spawnRate: 2000,
                maxSpawnRate: 800,
                initialSpeed: 200,
                maxSpeed: 2,
                speedFactor: 40,
                spawnFactor: 30,
                pointsPerCoin: 5
            },
            audio: {
                muteAudio: false,
                masterVolume: 1.0,
                musicVolume: 1.0,
                soundFXVolume: 1.0
            },
            api: {
                IP: "127.0.0.1",
                frontURL: "",
                backURL: "",
                port: ""
            }
        }
    }
}