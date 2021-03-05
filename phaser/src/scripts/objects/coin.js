import Obstacle from './obstacle'

class Coin extends Obstacle {
    constructor(scene, x, y) {
        super(scene, x, y, 'coin1')

        var coinAnimKeys = []
        for (var i = 1; i < 22; i++) {
            coinAnimKeys.push({ key: `coin${i}` })
        }
        scene.anims.create({
            key: 'coin-play',
            frames: coinAnimKeys,
            frameRate: 25,
            repeat: -1
        })

        this.play('coin-play')
    }
    playSound() {
        var rand = Phaser.Math.Between(1, 4)
        this.scene.playSound(`coin${rand}`)
    }
}

export default Coin