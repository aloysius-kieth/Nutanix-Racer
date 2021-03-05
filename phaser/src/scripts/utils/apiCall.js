import utils from '../utils/utils'
import d from '../utils/debugLog'

const STATUS_OK = 200

export default class APICall {
    constructor(config) {
        this.config = config
    }
    updateScore(_userID, data, callback) {
        if (!_userID || 0 === _userID.length) return

        if (this.config != null) {
            var url = this.config.frontURL + this.config.port + this.config.backURL + 'updateScore'
            utils.POST(url, data, (result) => {
                if (result.status == STATUS_OK) {
                    d.log('Success sending score: ' + result.responseJSON)
                    callback(result.responseJSON, true)
                } else {
                    callback(result.responseJSON, false)
                }
            })
        } else {
            d.log(`Unable to call API ${result.status} <updateScore>`)
            callback(result.responseJSON, false)
        }
    }
    checkMaxTries(_userID, callback) {
        console.log("Checking max tries limit...")
        if (!_userID || 0 === _userID.length) return

        this.apiResult = new apiResultClass()
        if (this.config != null) {
            var url = this.config.frontURL + this.config.port + this.config.backURL + 'checkPlayValid/' + _userID
            utils.POST(url, null, (result) => {
                console.log(result.responseJSON)
                if (result.status == STATUS_OK) {
                    callback(result.responseJSON, true)
                } else {
                    callback(result, false)
                }
            })
        } else {
            console.log('Could not call API <CheckMaxTries>')
        }
    }
    addGameResult(_userID, callback) {
        console.log("Adding game result...")
        if (!_userID || 0 === _userID.length) return

        var data = {
            playID: _userID,
            score: _score,
            timeTaken: _timetaken
        }
        if (this.config != null) {
            var url = this.config.frontURL + this.config.port + this.config.backURL + 'addSpinWinResult/'
            utils.POST(url, data, (result) => {
                console.log(result.responseJSON)
                if (result.status == STATUS_OK) {
                    callback(result.responseJSON, true)
                } else {
                    callback(result, false)
                }
            })
        } else {
            console.log('Could not call API <addGameResult>')
        }
    }
}

class apiResultClass {
    constructor() {
        this.request = new requestClass()
        this.error = new errorClass()
        this.data = new dataClass()
    }
}

class requestClass {
    api = ''
    result = ''
}

class errorClass {
    error_code = ''
    error_message = ''
}

class dataClass {
    data = null
}