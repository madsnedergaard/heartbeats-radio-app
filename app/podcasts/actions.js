import * as Api from '../utils/Api';

export const SELECT_SERIES = 'SELECT_SERIES';
export const selectSeries = (seriesId) => ({
  type: SELECT_SERIES,
  selectedShow: seriesId
});

export const SELECT_EPISODE = 'SELECT_EPISODE';
export const selectEpisode = (episodeId, source) => ({
  type: SELECT_EPISODE,
  selectedEpisode: episodeId,
  selectedSource: source,
  isPlaying: true
});

export const TOGGLE_AUDIO = 'TOGGLE_AUDIO';
export const toggleAudio = () => ({
  type: TOGGLE_AUDIO
});


// Fetch series
export const FETCHING_SERIES = 'FETCHING_SERIES';
export const FETCHING_SERIES_FAILED = 'FETCHING_SERIES_FAILED';
export const FETCHING_SERIES_SUCCEEDED = 'FETCHING_SERIES_SUCCEEDED';
export const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';

// Action creators
export const fetchingSeries = () => ({
  type: FETCHING_SERIES
});
export const fetchingSeriesSucceeded = (json) => ({
  type: FETCHING_SERIES_SUCCEEDED,
  series: json,
  receivedAt: Date.now()
});
export const fetchSeries = () => dispatch => {
  dispatch(fetchingSeries());
  Api.fetchAllSeries((json) => dispatch(fetchingSeriesSucceeded(json)));
};


export const FETCHING_EPISODES = 'FETCHING_EPISODES';
export const FETCHING_EPISODES_FAILED = 'FETCHING_EPISODES_FAILED';
export const FETCHING_EPISODES_SUCCEEDED = 'FETCHING_EPISODES_SUCCEEDED';

// Action creators
export const fetchingEpisodes = () => ({
  type: FETCHING_EPISODES
});
export const fetchingEpisodesSucceeded = (json) => ({
  type: FETCHING_EPISODES_SUCCEEDED,
  episodes: json,
  receivedAt: Date.now()
});
export const fetchEpisodes = (seriesId) => dispatch => {
  dispatch(fetchingEpisodes());
  Api.fetchEpisodes(seriesId, (json) => dispatch(fetchingEpisodesSucceeded(json)));
};



//export function setFetchingStatus(status) {
//  return { type: SET_FETCHING_STATUS, status };
//}
