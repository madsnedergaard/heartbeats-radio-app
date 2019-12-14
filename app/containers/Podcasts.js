// @flow
import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import Sound from 'react-sound';
import { ipcRenderer } from 'electron';

import { Logo, OfflineIndicator } from '../components/display';
import { Button, PlayButton } from '../components/Button';
import { List, ListItem } from '../components/List';
import podcastAppReducer from '../reducers/podcasts';

// import {
//  setFetchingStatus
// } from './actions';

import { fetchSeries, fetchEpisodes, selectSeries, selectEpisode, toggleAudio } from '../actions/podcasts';

const mapStateToProps = rootState => {
  const state = rootState.podcastAppReducer;
  return {
    isFetching: state.isFetching,
    isPlaying: state.isPlaying,
    selectedSource: state.selectedSource,
    selectedShow: state.selectedShow,
    selectedEpisode: state.selectedEpisode,
    podcasts: state.podcasts,
    series: state.series,
    online: state.online,
    time: state.time,
  };
};

const mapDispatchToProps = {
  fetchSeries,
  fetchEpisodes,
  selectSeries,
  selectEpisode,
  toggleAudio,
};
/*
    Wrapper
      Container: Header
        - Logo
        - PlayButton
        - audio
      Container: Beats
        - List (beats) props:[shows,selected_show, onSelectShow()]
          - Buttons
        - List (Episodes) props:[shows,selected_show, onSelectEpisode()]
          - Buttons
      OfflineIndicator
*/

class PodcastsPage extends Component {
  componentDidMount() {
    if (!this.props.series || Object.keys(this.props.series).length === 0) {
      this.props.fetchSeries();
    }
    ipcRenderer.on('MediaPlayPause', this.onMediaPlayPause);
  }
  componentWillUnmount() {
    ipcRenderer.removeListener('MediaPlayPause', this.onMediaPlayPause);
  }

  onMediaPlayPause = () => {
    if (this.props.selectedEpisode) {
      this.props.toggleAudio();
    }
  };

  handleSongFinishedPlaying = () => {
    if (this.props.selectedEpisode) {
      this.props.toggleAudio();
    }
  };

  _handleSeriesClick = id => {
    this.props.selectSeries(id);
    this.props.fetchEpisodes(id);
    // if (!this.props.series || Object.keys(this.props.series).length === 0) {
    //  this.props.fetchSeries();
    // }
  };

  _handleEpisodeClick = (id, source) => {
    this.props.selectEpisode(id, source);
  };

  render() {
    const {
      isFetching,
      isPlaying,
      selectedSource,
      selectedShow,
      selectedEpisode,
      podcasts,
      series,
      online,
      time,
      toggleAudio,
    } = this.props;

    return (
      <div className="app">
        <section className="header">
          <Logo loading={isFetching} />
          <PlayButton playing={isPlaying} disabled={!selectedSource} onClick={() => this.props.toggleAudio()}>
            {isPlaying ? 'Pause' : 'Play' /* ${isNaN(time) ? 0 : time}% */}
          </PlayButton>
          <Sound
            url={selectedSource || ''}
            playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
            playFromPosition={0 /* in milliseconds */}
            onLoading={this.handleSongLoading}
            onPlaying={this.handleSongPlaying}
            onFinishedPlaying={this.handleSongFinishedPlaying}
          />
        </section>
        <section className="flexy">
          <List title="Beats">
            {series ? (
              series.map(s => (
                <ListItem key={s.id} selected={this.props.selectedShow === s.id} onClick={() => this._handleSeriesClick(s.id)}>
                  {s.name}
                </ListItem>
              ))
            ) : (
              <p>No episodes available</p>
            )}
          </List>
          <List title="Episodes">
            {podcasts
              ? podcasts
                  .map(p => (
                    <ListItem
                      key={p.id}
                      selected={this.props.selectedEpisode === p.id}
                      onClick={() => this._handleEpisodeClick(p.id, p.meta.audio_file)}
                      dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                    />
                  ))
              : '...'}
          </List>
        </section>
        <OfflineIndicator>No internet connection</OfflineIndicator>
      </div>
    );
  }
}
PodcastsPage.propTypes = {};

PodcastsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastsPage);
export default PodcastsPage;
