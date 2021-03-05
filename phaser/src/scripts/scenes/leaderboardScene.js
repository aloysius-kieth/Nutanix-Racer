import SCENES from './scenes'
import PinholeSceneBase from '../transitions/pinholeSceneBase'


var width, height
const Random = Phaser.Math.Between;
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class LeaderboardScene extends PinholeSceneBase {
    constructor() {
        super(SCENES.LEADERBOARD)
    }
    preload() {
        super.preload()
        this.cameras.main.setBackgroundColor(0x000000)
    }
    create() {
        super.create()

        width = this.sys.game.config.width
        height = this.sys.game.config.height

        this.initSettings()
        this.playMusic(this.AUDIO.bgm)

        var print = this.add.text(0, 0, '');
        // var loginDialog = CreateLoginDialog(this, {
        //     x: width / 2,
        //     y: height / 2,
        //     title: 'Welcome',
        //     username: 'abc',
        //     password: '123',
        // })
        //     .on('login', function (username, password) {
        //         print.text += `${username}:${password}\n`;
        //     })
        //     //.drawBounds(this.add.graphics(), 0xff0000);
        //     .popUp(500);

        //this.addBackground()
        var scrollMode = 0; // 0:vertical, 1:horizontal
        var gridTable = this.rexUI.add.gridTable({
            x: width / 2,
            y: height / 2,
            width: (scrollMode === 0) ? width / 2 : height / 2,
            height: (scrollMode === 0) ? height / 2 : width / 2,

            scrollMode: scrollMode,

            background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

            table: {
                cellWidth: (scrollMode === 0) ? undefined : 60,
                cellHeight: (scrollMode === 0) ? 60 : undefined,

                columns: 3,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: true,
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },

            scroller: {
                threshold: 10,
                slidingDeceleration: 5000,
                backDeceleration: 2000,
            },

            header: this.rexUI.add.label({
                width: (scrollMode === 0) ? undefined : 30,
                height: (scrollMode === 0) ? 30 : undefined,

                orientation: scrollMode,
                background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.add.text(0, 0, 'Header'),
            }),

            //footer: GetFooterSizer(this, scrollMode),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,

                        orientation: scrollMode,
                        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: (scrollMode === 0) ? 15 : 0,
                            top: (scrollMode === 0) ? 0 : 15,
                        }
                    });
                    console.log(cell.index + ': create new cell-container');
                } else {
                    console.log(cell.index + ': reuse cell-container');
                }

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('text').setText(item.id); // Set text of text object
                cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
                cellContainer.getElement('background').setStrokeStyle(2, COLOR_DARK).setDepth(0);
                return cellContainer;
            },
            items: CreateItems(100)
        })
            .layout()

    }
    initSettings() {
        //console.log(gameSettings)
    }
    addButtons() {

    }
    addBackground() {
        this.background = this.add.image(0, 0, 'background')
        this.background.displayWidth = width
        this.background.displayHeight = height
        this.background.setOrigin(0, 0)
    }
}

var CreateItems = function (count) {
    var data = [];
    for (var i = 0; i < count; i++) {
        data.push({
            id: i,
            color: Random(0, 0xffffff)
        });
    }
    return data;
}
const GetValue = Phaser.Utils.Objects.GetValue;
var CreateLoginDialog = function (scene, config, onSubmit) {
    var username = GetValue(config, 'username', '');
    var password = GetValue(config, 'password', '');
    var title = GetValue(config, 'title', 'Welcome');
    var x = GetValue(config, 'x', 0);
    var y = GetValue(config, 'y', 0);
    var width = GetValue(config, 'width', undefined);
    var height = GetValue(config, 'height', undefined);

    var background = scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_PRIMARY);
    var titleField = scene.add.text(0, 0, title);
    var userNameField = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 20).setStrokeStyle(0, COLOR_LIGHT),
        icon: scene.add.image(0, 0, 'user'),
        text: scene.rexUI.add.BBCodeText(0, 0, username, { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
        space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
    })
        .setInteractive()
        .on('pointerdown', function () {
            var config = {
                onTextChanged: function (textObject, text) {
                    if (text.length >= 10) {
                        editor.close()
                        return
                    }
                    username = text;
                    textObject.text = text;
                }
            }
            var editor = scene.rexUI.edit(userNameField.getElement('text'), config);
        });

    var passwordField = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 20).setStrokeStyle(0, COLOR_LIGHT),
        icon: scene.add.image(0, 0, 'password'),
        text: scene.rexUI.add.BBCodeText(0, 0, markPassword(password), { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
        space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
    })
        .setInteractive()
        .on('pointerdown', function () {
            var config = {
                type: 'password',
                text: password,
                onTextChanged: function (textObject, text) {
                    password = text;
                    textObject.text = markPassword(password);
                }
            };
            scene.rexUI.edit(passwordField.getElement('text'), config);
        });

    var loginButton = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
        text: scene.add.text(0, 0, 'SUBMIT'),
        space: { top: 8, bottom: 8, left: 8, right: 8 }
    })
        .setInteractive()
        .on('pointerdown', function () {
            loginDialog.emit('login', username, password);
        });

    var loginDialog = scene.rexUI.add.sizer({
        orientation: 'y',
        x: x,
        y: y,
        width: width,
        height: height,
    })
        //.addBackground(background)
        .add(titleField, 0, 'center', { top: 10, bottom: 10, left: 10, right: 10 }, false)
        .add(userNameField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
        .add(passwordField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
        .add(loginButton, 0, 'center', { bottom: 10, left: 10, right: 10 }, false)
        .layout();
    return loginDialog;
};
var markPassword = function (password) {
    return new Array(password.length + 1).join('•');
};


// var GetFooterSizer = function (scene, orientation) {
//     return scene.rexUI.add.sizer({
//         orientation: orientation
//     })
//         .add(
//             CreateFooterButton(scene, 'Reset', orientation),   // child
//             1,         // proportion
//             'center'   // align
//         )
//         .add(
//             CreateFooterButton(scene, 'Exit', orientation),    // child
//             1,         // proportion
//             'center'   // align
//         )
// }

// var CreateFooterButton = function (scene, text, orientation) {
//     return scene.rexUI.add.label({
//         height: (orientation === 0) ? 40 : undefined,
//         width: (orientation === 0) ? undefined : 40,
//         orientation: orientation,
//         background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
//         text: scene.add.text(0, 0, text),
//         icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
//         align: 'center',
//         space: {
//             icon: 10
//         }
//     })
//         .setInteractive()
//         .on('pointerdown', function () {
//             console.log(`Pointer down ${text}`)
//         })
//         .on('pointerover', function () {
//             this.getElement('background').setStrokeStyle(1, 0xffffff);
//         })
//         .on('pointerout', function () {
//             this.getElement('background').setStrokeStyle();
//         })
// }
