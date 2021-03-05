import 'phaser'
import '@babel/polyfill'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'

import utils from './utils/utils'
import SCENES from './scenes/scenes'
import Model from './config/model'

import GlobalScene from './scenes/globalScene'
import BootScene from './scenes/bootScene'
import PreloadScene from './scenes/preloadScene'
import GameScene from './scenes/gameScene'
import ResultScene from './scenes/resultScene'
// import LeaderboardScene from './scenes/leaderboardScene'

var gameOptions = {
  gameWidth: 540,
  gameHeight: 960
}

window.onload = function () {
  let isReady = false

  if (utils.GetBrowserPlatform() != 'desktop') {
    //console.log(window.orientation)
    if (window.orientation != 0) {
      window.addEventListener('orientationchange', orientEvent)
    } else {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var ratio = windowHeight / windowWidth;
      // console.log(windowWidth)
      // console.log(windowHeight)
      console.log('ratio: ' + ratio)
      if (ratio >= 1) {
        if (ratio < 1.5) {
          gameOptions.gameWidth = gameOptions.gameHeight / ratio;
        }
        else {
          gameOptions.gameHeight = gameOptions.gameWidth * ratio;
        }
      }
      isReady = true
    }
  } else {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var ratio = windowHeight / windowWidth;
    // console.log(windowWidth)
    // console.log(windowHeight)
    console.log('ratio: ' + ratio)
    if (ratio >= 1) {
      if (ratio < 1.5) {
        gameOptions.gameWidth = gameOptions.gameHeight / ratio;
      }
      else {
        gameOptions.gameHeight = gameOptions.gameWidth * ratio;
      }
    }
    isReady = true
  }

  //Wait until innerheight changes, for max 120 frames
  function orientationChanged() {
    const timeout = 120;
    return new window.Promise(function (resolve) {
      const go = (i, height0) => {
        //console.log("waiting")
        window.innerHeight != height0 || i >= timeout ?
          resolve() :
          window.requestAnimationFrame(() => go(i + 1, height0));
      };
      go(0, window.innerHeight);
    });
  }

  function orientEvent() {
    if (window.orientation == 0) {
      orientationChanged().then(function () {
        //console.log("done")
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var ratio = windowHeight / windowWidth;
        console.log('ratio: ' + ratio)
        if (ratio >= 1) {
          if (ratio < 1.5) {
            config.scale.width = gameOptions.gameWidth = gameOptions.gameHeight / ratio;
          }
          else {
            config.scale.height = gameOptions.gameHeight = gameOptions.gameWidth * ratio;
          }
        }
        isReady = true;
        window.removeEventListener('orientationchange', orientEvent);
      });
    }
  }

  var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    autoFocus: true,
    disableContextMenu: false,
    scale: {
      parent: 'phaser-game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: gameOptions.gameWidth,
      height: gameOptions.gameHeight,
    },
    dom: {
      createContainer: true
    },
    // plugins: {
    //   scene: [
    //     {
    //       key: 'rexUI',
    //       plugin: RexUIPlugin,
    //       mapping: 'rexUI'
    //     }
    //   ]
    // },
    physics: {
      default: 'arcade',
      arcade:{
        debug: false
      }
    },
    audio: {
      disableWebAudio: false,
    },
  }

  class Game extends Phaser.Game {
    constructor() {
      super(config)

      const model = new Model()
      this.globals = { model }

      console.log('Canvas W: ' + config.scale.width + ' | ' + 'Canvas H: ' + config.scale.height)

      this.scene.add(SCENES.GLOBAL, GlobalScene)
      this.scene.add(SCENES.BOOT, BootScene)
      this.scene.add(SCENES.PRELOAD, PreloadScene)
      this.scene.add(SCENES.GAME, GameScene)
      this.scene.add(SCENES.RESULT, ResultScene)

      this.scene.start(SCENES.BOOT)
    }
  }

  function checkReady() {
    if (!isReady) {
      setTimeout(checkReady, 100);
    } else {
      const game = new Game(config);
    }
  }

  checkReady()
}
