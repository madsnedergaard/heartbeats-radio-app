import {
  FETCHING_SERIES,
  FETCHING_SERIES_FAILED,
  FETCHING_SERIES_SUCCEEDED,
  FETCHING_EPISODES,
  FETCHING_EPISODES_FAILED,
  FETCHING_EPISODES_SUCCEEDED,
  SELECT_SERIES,
  SELECT_EPISODE,
  TOGGLE_AUDIO
} from '../actions/podcasts';

const initialState = {
  isPlaying: false,
  selectedSource: null,
  selectedShow: null,
  selectedEpisode: null,
  podcasts: [],
  series: [],
  isFetching: false,
  online: false,
  time: 0
};

const normalizeData = (series) => {
  const podcasts = {};
  series.forEach((el) => {
    podcasts[el.id] = el;
  });
  return podcasts;
};


function podcastAppReducer(state = initialState, action) {
  switch (action.type) {
//    case SET_FETCHING_STATUS:
//      return Object.assign({}, state, {
//        isFetching: action.status
//      });
    case SELECT_SERIES:
      return {
        ...state,
        selectedShow: action.selectedShow
      };
    case SELECT_EPISODE:
      return {
        ...state,
        selectedEpisode: action.selectedEpisode,
        selectedSource: action.selectedSource,
        isPlaying: action.isPlaying
      };
    case TOGGLE_AUDIO:
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    case FETCHING_SERIES:
      return {
        ...state,
        isFetching: true
      };
    case FETCHING_SERIES_SUCCEEDED:
      // const normalizedData = normalize(action.articles, schema.articles);
      return {
        ...state,
        isFetching: false,
        series: action.series // normalizeData(action.series)
      };
    case FETCHING_SERIES_FAILED:
      // handle error;
      return {
        ...state,
        isFetching: false
      };
    case FETCHING_EPISODES:
      return {
        ...state,
        isFetching: true
      };
    case FETCHING_EPISODES_FAILED:
      return {
        ...state,
        isFetching: false
      };
    case FETCHING_EPISODES_SUCCEEDED:
      return {
        ...state,
        isFetching: false,
        podcasts: action.episodes  // normalizeData(action.series)
      };

    default:
      return state;
  }
}

export default podcastAppReducer;
