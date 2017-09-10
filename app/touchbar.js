const { mainWindow, webContents, TouchBar, nativeImage } = require('electron');

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarGroup, TouchBarScrubber } = TouchBar;

let spinning = false

// Reel labels
const reel1 = new TouchBarLabel()
const reel2 = new TouchBarLabel()
const reel3 = new TouchBarLabel()

// Spin result label
const result = new TouchBarLabel()

// Heartbeats-icon, Scrobble area (with text?), play/pause
const img = nativeImage.createFromPath('./app/images/icon.png');

const touchBarCB = {
  onPlay: (cb) => {
    cb();
  }
}



// Spin button
const appButton = new TouchBarButton({
  icon: img,
  backgroundColor: '#000',
  click: () => {
//    touchBarCB.onPlay();
  }
})

const controls = new TouchBarGroup({
  items: [
   new TouchBarLabel({label: 'Heartbeats Radio'}),
   // new TouchBarButton({label: 'Play'})
  ]
});

const touchBar = new TouchBar([
  appButton,
  controls,
  new TouchBarSpacer({size: 'large'}),
  reel1,
  new TouchBarSpacer({size: 'small'}),
  reel2,
  new TouchBarSpacer({size: 'small'}),
  reel3,
  new TouchBarSpacer({size: 'large'}),
  result
])

module.exports = { touchBar, touchBarCB };  