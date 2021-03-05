import BaseScene from '../scenes/base'

const MASK_MIN_SCALE = 0;
const MASK_MAX_SCALE = 5;
const textureKey = 'pinholeMask'

export default class PinholeSceneBase extends BaseScene {

    delayDuration = 2750
    create() {
        super.create()

        const maskShape = new Phaser.Geom.Circle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.centerY / 2
        );
        this.maskGfx = this.add.graphics()
            .fillCircleShape(maskShape)
            .generateTexture(textureKey)

        this.mask = this.add.image(0, 0, textureKey)
            .setPosition(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
            )

        this.bitMapMask = new Phaser.Display.Masks.BitmapMask(this, this.mask)
        this.cameras.main.setMask(this.bitMapMask);

        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MIN_SCALE,
                start: MASK_MIN_SCALE,
                to: MASK_MAX_SCALE,
            };

            this.tweens.add({
                delay: this.delayDuration,
                duration: 1500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
            });
        });

        this.events.on(Phaser.Scenes.Events.TRANSITION_OUT, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MAX_SCALE,
                start: MASK_MAX_SCALE,
                to: MASK_MIN_SCALE,
            };

            this.tweens.add({
                duration: 2500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
            });
        });
    }
}