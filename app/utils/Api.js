// Series

/*
 Since the Heartbeats API has been closed off, I have modified the API calls to fetch data from a JSON file.
 This way it is possible to see how the app behaves.
*/

import fakeData from '../utils/fakedata.json';

export const fetchAllSeries = next => {
  next(fakeData.series.sort((a, b) => a.name > b.name));
  /* fetch('http://heartbeats.dk/wp-json/wp/v2/series?parent=1284&per_page=100')
    .then(response => response.json())
    .then(json => {
      next(json);
    });
    */
};

// Episodes
export const fetchEpisodes = (seriesId, next) => {
  const episodes = fakeData.episodes.filter(e => e.seriesId === seriesId);
  next(episodes);
  /*
  fetch(`http://heartbeats.dk/wp-json/wp/v2/podcast?series=${seriesId}&per_page=100`)
    .then(response => response.json())
    .then(json => {
      next(json);
    });
    */
};
