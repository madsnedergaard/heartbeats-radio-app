'use strict';
const { ipcRenderer } = require('electron');
const { h, app } = require('hyperapp');
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Logger = () => ({
  events: {
    action: (state, actions, data) => {
    	console.group('%c LOGGER', 'color: green');
    	console.log('%c state before','color: #666; font-weight: bold; font-style: italic;', state);
			console.log('%c '+data.name,'color: blue; font-weight: bold; font-style: italic;', data.data);
    	console.groupEnd();
    }
  }
})

app({
  state: {
   	playing: false,
   	source: null,
   	selectedShow: null,
   	selectedEpisode: null,
   	podcasts: [],
   	isFetching: false
  },
  view: (state, actions) => (
		h('section', {class: 'beats'}, [
			// Play button
	  	h(
	  		'button', 
	  		{
	  			class: state.playing ? 'button play-button playing' : 'button play-button', 
	  			disabled: state.source ? false : true,
	  			onclick: () => actions.toggle() 
	  		}, 
	  		state.playing ? 'Pause' : 'Play'
	  	),
			// Audio element
			h(
				'audio', 
				{
					src: state.source, 
					id: 'audioplayer', 
					onupdate: el => state.playing ? el.play() : el.pause() 
				}, 
				state.playing
			),
			// Beats
			h('div', null, [
				h('h2', {onclick: () => actions.toggle()}, 'Beats'),
				 h('div', {class: 'list '}, Object.keys(state.podcasts).map(s =>
				 	h('button', {class: s === state.selectedShow ? 'button item selected' : 'button item',  onclick: () => actions.loadEpisodes}, s)
				 ))

			]),
			// Episodes
			h('div', null, [
				h('h2', null, 'Episodes'),
				// h('div', {class: 'list '}, state.podcasts.map(p => 
				// 	h('button', {class: p.title === state.selectedEpisode ? 'button item selected' : 'button item',  onclick: () => actions.play(p)}, p.title)
				// ))
			])
		])
  ),
  actions: {
  	play: (state, actions, podcast) => {
  		return {
  		playing: true,
  		source: podcast.source,
  		selectedEpisode: podcast.title
  	}},
  	toggle: (state, actions) => ({
  		playing: !state.playing
  	}),
  	//pause: state => state.playing = false,
  	updatePodcasts: (state, actions, { podcasts, isFetching }) => ({
      podcasts: podcasts || [],
      isFetching
    }),
    loadEpisodes: (state, actions, show) => {
			fetch(`http://heartbeats.dk/wp-json/posts?type=podcast&filter[series]=Beats&filter[series]=${show.title}`)
      .then(episodes => episodes.json())
      .then(episodes => episodes.map(podcast => ({
        title: podcast.title.replace(/&#038;/g, '&'),
        source: podcast.post_meta.audio_file
	  	  }))
    	)
      .then(podcasts => actions.updatePodcasts({ podcasts, isFetching: false }))
    },
    logState: (state) => ({state})
  },
  events: {
  	loaded: (state, actions) => {
  		actions.updatePodcasts({isFetching: true});
		  fetch(`http://heartbeats.dk/wp-admin/admin-ajax.php?action=podcast_series`)
      .then(response => response.json())
       .then(data => data.beats.series.reduce((o, key) => Object.assign(o, {[key]: []}), {})
       )
      ////.replace(/&#038;/g, '&')
      .then(podcasts => actions.updatePodcasts({ podcasts, isFetching: false }))
  		// actions.updatePodcasts({isFetching: true});
			 // fetch(`http://heartbeats.dk/wp-json/posts?type=podcast&filter[series]=Beats&filter[series]=Varme Rytmer`)
			 //        .then(podcasts => podcasts.json())
			 //        .then(podcasts => podcasts.map(podcast => ({
		  //           title: podcast.title.replace(/&#038;/g, '&'),
		  //           source: podcast.post_meta.audio_file
		  //       	  }))
		  //       	)
			 //        .then(podcasts => actions.updatePodcasts({ podcasts, isFetching: false }))
  	},
  },
    mixins: [Logger]
});


/*
var audio = document.getElementById('audioplayer');
var audioWrapper = document.querySelector('.player');
var playButton = document.querySelector('.play-button');
var offlineMessage = document.querySelector('.offline-message');

var beatsWrapper = document.querySelector('.beats');
var playBeatsButton = document.getElementsByClassName('episode');


// Initial check to see if its online
if(navigator.onLine) {
	console.log('navigator onLine');
	audioWrapper.classList.toggle('hidden');	
	//beatsWrapper.classList.toggle('hidden');	
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
	console.log('online');
	var source = audio.src;
	audio.src = '';
	audio.src = source;
	offlineMessage.classList.toggle('hidden');
	audioWrapper.classList.toggle('hidden');
	//beatsWrapper.classList.toggle('hidden');
});
window.addEventListener('offline',  function(){
	console.log('offline');
	if (!audio.paused) {
		toggleRadio(audio, playButton); // Stop	
	}
	offlineMessage.classList.toggle('hidden');
	audioWrapper.classList.toggle('hidden');
	//beatsWrapper.classList.toggle('hidden');
});


var playBeat = function() {
    var source = this.getAttribute("data-src");
    console.log(source);
  	audio.src = source;
  	toggleRadio(audio, playButton);
};

for (var i = 0; i < playBeatsButton.length; i++) {
    playBeatsButton[i].addEventListener('click', playBeat, false);
}



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
*/