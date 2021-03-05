let instance = null

class Global {
    constructor(){
        if (!instance) {
            instance = this
        }
        this.settings = {}

        return instance
    }

    getSettings(){
        return this.settings
    }
}

export default Global