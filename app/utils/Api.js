// Series
export const fetchAllSeries = (next) => {
  fetch("http://heartbeats.dk/wp-json/wp/v2/series?parent=1284&per_page=100")
    .then(response => response.json())
    .then(json => {
      next(json);
    }
  );
};

// Episodes
export const fetchEpisodes = (seriesId, next) => {
  fetch(`http://heartbeats.dk/wp-json/wp/v2/podcast?series=${seriesId}&per_page=100`)
    .then(response => response.json())
    .then(json => {
      next(json);
    }
    );
};
