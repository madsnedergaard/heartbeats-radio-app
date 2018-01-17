// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import podcastAppReducer from '../reducers/podcasts';

const rootReducer = combineReducers({
  router,
  podcastAppReducer
});

export default rootReducer;
