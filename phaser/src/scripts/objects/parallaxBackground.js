class ParallaxBackground extends Phaser.GameObjects.TileSprite {
    constructor(config) {
        super(config.scene, 0,0, 0,0, 'road')
        config.scene.add.existing(this)

        this.setOrigin(0.5)
        this.x = config.scene.sys.game.config.width / 2
        this.y  = config.scene.sys.game.config.height / 2
        //this.displayWidth = config.scene.sys.game.config.width
        this.displayHeight = config.scene.sys.game.config.height
        this.setScrollFactor(0)
        this.speed = Phaser.Math.GetSpeed(200, 1)
    }

    update(delta) {
        this.tilePositionY -= this.speed * delta
    }
}

export default ParallaxBackground