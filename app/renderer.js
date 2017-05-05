'use strict';
const { ipcRenderer } = require('electron');
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var audio = document.getElementById('audioplayer');
var playButton = document.querySelector('.play-button');
playButton.addEventListener('click', function () { 
	toggleRadio(audio, playButton);
});

ipcRenderer.on('MediaPlayPause', function () {
  toggleRadio(audio, playButton);
});

function toggleRadio(audio, button) {
	button.classList.toggle('playing');
	if (audio.paused) {
		audio.play();
		button.innerText = 'Pause';
	} else {
		audio.pause();
		button.innerText = 'Play';
	}
	return true;
}
