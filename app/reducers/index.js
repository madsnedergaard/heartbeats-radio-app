// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import podcastAppReducer from '../podcasts/reducer';

const rootReducer = combineReducers({
  router,
  podcastAppReducer
});

export default rootReducer;
