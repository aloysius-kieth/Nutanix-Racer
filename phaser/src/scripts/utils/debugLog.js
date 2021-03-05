import global from '../config/global'
let g = new global()

var DebugLog = {
    log: function (e) {
        if (g.getSettings().game.debugLog) {
            console.log(e)
        }
    }
}

export default DebugLog