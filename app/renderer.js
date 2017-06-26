'use strict';
const { ipcRenderer } = require('electron');
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var audio = document.getElementById('audioplayer');
var audioWrapper = document.querySelector('.player');
var playButton = document.querySelector('.play-button');
var offlineMessage = document.querySelector('.offline-message');


// Initial check to see if its online
if(navigator.onLine) {
	audioWrapper.classList.toggle('hidden');	
}

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
audio.addEventListener('playing', function(){
	console.log('Playing');
});

audio.addEventListener('pause', function(){
	console.log('Pause');
});

audio.addEventListener('play', function(){
	console.log('Play');
});

audio.addEventListener('ended', function(){
	console.log('Ended');
});

audio.addEventListener('suspend', function(){
	console.log('Suspend');
});

audio.addEventListener('stalled', function(){
	console.log('stalled');
});

audio.addEventListener('error', function(err){
	console.log('error: ');
	console.log(err);
	if (navigator.onLine) {
			if (!audio.paused) {
				audio.pause();
			}
	} else {
		offlineMessage.classList.toggle('hidden');
	}
});


window.addEventListener('online',  function(){
	var source = audio.src;
	audio.src = '';
	audio.src = source;
	offlineMessage.classList.toggle('hidden');
	audioWrapper.classList.toggle('hidden');
});
window.addEventListener('offline',  function(){
	if (!audio.paused) {
		toggleRadio(audio, playButton); // Stop	
	}
	offlineMessage.classList.toggle('hidden');
	audioWrapper.classList.toggle('hidden');
});



// On play-button
playButton.addEventListener('click', function () { 
	toggleRadio(audio, playButton);
});

// On keyboard play-media-key
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