import podcastAppReducer from '../../app/podcasts/reducer';
import { TOGGLE_AUDIO,SELECT_SERIES,SELECT_EPISODE,FETCHING_EPISODES,FETCHING_EPISODES_FAILED,FETCHING_EPISODES_SUCCEEDED,FETCHING_SERIES,FETCHING_SERIES_FAILED,FETCHING_SERIES_SUCCEEDED,SET_FETCHING_STATUS } from '../../app/podcasts/actions';

describe('Podcast reducer', () => {
  describe('player', () => {
    it('should toggle audio', () => {
      expect(podcastAppReducer(undefined, { type: TOGGLE_AUDIO })).toMatchSnapshot();
    });

    it('should select a series', () => {
      expect(podcastAppReducer(undefined, { type: SELECT_SERIES, selectedShow: 1 })).toMatchSnapshot();
    });

    it('should select episode and start playing', () => {
      expect(podcastAppReducer(undefined, { type: SELECT_EPISODE, selectedEpisode: 1, selectedSource: 'source', isPlaying: true })).toMatchSnapshot();
    });
  });
  describe('API', () => {
    it('should start fetching series', () => {
      expect(podcastAppReducer(undefined, { type: FETCHING_SERIES })).toMatchSnapshot();
    });
    // TODO Mock API calls
  })

  it('should handle unknown action type', () => {
    expect(podcastAppReducer(undefined, { type: 'unknown' })).toMatchSnapshot();
  });
})
