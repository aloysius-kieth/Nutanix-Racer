import Obstacle from "./obstacle"

class Cone extends Obstacle {
    constructor(scene, x, y) {
        super(scene, x, y, 'cone')
    }
    playSound() {
        this.scene.playSound(this.scene.AUDIO.cone)
    }
}

export default Cone
