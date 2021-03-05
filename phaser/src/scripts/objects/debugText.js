const format = (
    'Total:    %1\n' +
    'Max:      %2\n' +
    'Active:   %3\n' +
    'Inactive: %4\n' +
    'Used:     %5\n' +
    'Free:     %6\n' +
    'Full:     %7\n' +
    '\n' +
    'SpawnRate: %8\n' +
    'Roadbackground Speed: %9\n' +
    'Obstacle Speed: %10\n'
)

export default class DebugText extends Phaser.GameObjects.Text {
    constructor(config, textStyle) {
        super(config.scene, config.x, config.y, '', textStyle)

        config.scene.add.existing(this)
        this.setDepth(999)
    }
    update(values) {
        this.setText(Phaser.Utils.String.Format(format, values))
    }

}