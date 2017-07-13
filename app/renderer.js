'use strict';
/*jshint esversion: 6 */ 

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
   	podcasts: {},
   	isFetching: false,
   	online: false
  },
  view: (state, actions) => (
		h('section', {class: 'app'}, [
			h('div', {class: state.online ? 'connection-indicator' : 'connection-indicator offline' }, 'No internet connection'),
			h('div',  {class: state.isFetching ? 'logo loading' : 'logo'}, null),
//			h('p', {class: 'offline-message'}, 'No internet connection'),
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
			h('section',  {class: 'flexy'}, [
			// Beats
			h('div', {class: 'col'}, [
				h('h2', {onclick: () => actions.toggle()}, 'Beats'),
				 h('div', {class: 'list '}, Object.keys(state.podcasts).sort().map(s =>
				 	h('button', {class: s === state.selectedShow ? 'button item selected' : 'button item',  onclick: () => actions.selectShow(s)}, s)
				 ))

			]),
			// Episodes
			h('div', {class: 'col'}, state.selectedShow ? [
				h('h2', null, 'Episodes'),
				h('div', {class: 'list '}, state.podcasts[state.selectedShow] && state.podcasts[state.selectedShow].length > 0 ? 
					state.podcasts[state.selectedShow].map(p => 
				 		h('button', {class: p.title === state.selectedEpisode ? 'button item selected' : 'button item',  onclick: () => actions.play(p)}, p.title)
				 	)
				: h('p', null, !state.isFetching ? 'no episodes available' : '')
				)
			] : null),
			])
		])
  ),
  actions: {
  	play: (state, actions, podcast) => ({
  		playing: true,
  		source: podcast.source,
  		selectedEpisode: podcast.title
  	}),
  	toggle: (state, actions) => ({
  		playing: !state.playing
  	}),
  	toggleConnectivity: (state, actions) => ({
  		online: !state.online
  	}),
  	//pause: state => state.playing = false,
  	updatePodcasts: (state, actions, { podcasts, isFetching }) => ({
      podcasts: podcasts || [],
      isFetching
    }),
    updateEpisodes: (state, actions, { episodes, isFetching}) => {
    	if (episodes) {
    		state.podcasts[state.selectedShow] = episodes;
    	}
    	state.isFetching = isFetching;
    	return state;
    },
    updateSelected: (state, actions, {selectedShow, selectedEpisode}) => {
    	
    	return {
    	selectedShow: selectedShow ? selectedShow : state.selectedShow,
    	selectedEpisode: selectedEpisode ? selectedEpisode : state.selectedEpisode
  	  };    	
  	},
  	selectShow: (state, actions, data, emit) => {
  		actions.updateSelected({selectedShow: data});
  		if (state.podcasts.length === 0 ) {
  			actions.loadShows();
  		} else {
	  		if(state.podcasts[data].length === 0) {
		  		actions.loadEpisodes();
	  		}  			
  		}
  	},
  	loadShows: (state, actions) => {
  		actions.updatePodcasts({isFetching: true});
		  fetch(`http://heartbeats.dk/wp-admin/admin-ajax.php?action=podcast_series`)
      .then(response => response.json())
      .then(data => data.beats.series.reduce((o, key) => Object.assign(o, {[key]: []}), {}))
      .then(podcasts => actions.updatePodcasts({ podcasts, isFetching: false }));
  	},

    loadEpisodes: (state, actions) => {
  		actions.updateEpisodes({isFetching: true});
			fetch(`http://heartbeats.dk/wp-json/posts?type=podcast&filter[series]=Beats&filter[series]=${state.selectedShow}`)
      .then(episodes => episodes.json())
      .then(episodes => episodes.length > 0 ? episodes.map(podcast => ({
        title: cleanString(podcast.title),
        source: podcast.post_meta.audio_file
	  	  })) : null
    	)
      .then(episodes => actions.updateEpisodes({ episodes, isFetching: false }))
    },
  },
  events: {
    init: (state, actions) => {
  		// On keyboard play-media-key
			ipcRenderer.on('MediaPlayPause', function () {
				actions.toggle();
			});
			
  	},
  	loaded: (state, actions) => {  		
  		if (navigator.onLine) {
  			actions.loadShows();
  			actions.toggleConnectivity();
  		}
  		addEventListener('online', () => {
  			actions.toggleConnectivity(); 
  			actions.loadShows();
  		});
  		addEventListener('offline', () => {
  			actions.toggleConnectivity();
  		});

  	},
  },
    mixins: [Logger]
});

function cleanString(string) {
	var cleanString = string
		.replace(/&#038;/g, '&')
		.replace(/&amp;/g, '&')
		.replace(/&#8211;/g, '–')
		.replace(/&#8217;/g, '\'')
	;
	return cleanString;
}

// // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
// audio.addEventListener('playing', function(){
// 	console.log('Playing');
// });

// audio.addEventListener('pause', function(){
// 	console.log('Pause');
// });

// audio.addEventListener('play', function(){
// 	console.log('Play');
// });

// audio.addEventListener('ended', function(){
// 	console.log('Ended');
// });

// audio.addEventListener('suspend', function(){
// 	console.log('Suspend');
// });

// audio.addEventListener('stalled', function(){
// 	console.log('stalled');
// });

// audio.addEventListener('error', function(err){
// 	console.log('error: ');
// 	console.log(err);
// 	// if (navigator.onLine) {
// 	// 		if (!audio.paused) {
// 	// 			audio.pause();
// 	// 		}
// 	// } else {
// 	// 	offlineMessage.classList.toggle('hidden');
// 	// }
// });


window.addEventListener('online',  function(){
//	console.log('online');
	// var source = audio.src;
	// audio.src = '';
	// audio.src = source;
	// offlineMessage.classList.toggle('hidden');
	// audioWrapper.classList.toggle('hidden');
	//beatsWrapper.classList.toggle('hidden');
});
window.addEventListener('offline',  function(){
	//console.log('offline');
	// if (!audio.paused) {
	// 	toggleRadio(audio, playButton); // Stop	
	// }
	// offlineMessage.classList.toggle('hidden');
	// audioWrapper.classList.toggle('hidden');
	//beatsWrapper.classList.toggle('hidden');
});


// On keyboard play-media-key
// ipcRenderer.on('MediaPlayPause', function () {
// 	var audio = document.getElementById('audioplayer');
//   toggleRadio(audio);
// });


function toggleRadio(audio) {
	//button.classList.toggle('playing');
	if (audio.paused) {
		audio.play();
		//button.innerText = 'Pause';
	} else {
		audio.pause();
		//button.innerText = 'Play';
	}
	return true;
}