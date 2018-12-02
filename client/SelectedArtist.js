import React from 'react';
import axios from 'axios';

import { Recommender } from './Recommender';

//3 options after being shown a new artist/song:
//I like this song, more by this artist
//Not a fan, find a different artist from previous artist's related artists
//I like this band, show me this band's related artists
export default class SelectedArtist extends React.Component {
  constructor() {
    super();
    this.state = {
      topTracks: [],
      selectedArtist: {},
      selectedTrack: {},
      seedArtists: [],
      seedTracks: [],
      potentialTracks: [],
      outOfSuggestions: false,
      playing: false,
      audio: {},
      visitedTrackIds: [],
    };
    this.findNewTracks = this.findNewTracks.bind(this);
    this.selectTrack = this.selectTrack.bind(this);
    this.skipTrack = this.skipTrack.bind(this);
    this.likeTrack = this.likeTrack.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.play = this.play.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      selectedArtist: this.props.artist,
      audio: new Audio(),
    });

    const topTracks = await axios.get(
      `/api/${this.state.selectedArtist.id}/top-tracks`
    );
    this.setState({
      topTracks: topTracks.data,
    });
  }
  async componentWillUnmount() {
    let music = this.state.audio;
    music.src = '';
    await this.setState({
      audio: {},
    });
  }

  render() {
    return (
      <div id="selected-artist">
        {this.state.seedArtists.length === 0 &&
        this.state.seedTracks.length === 0 ? (
          <div>
            <img
              src={
                this.state.selectedArtist.images
                  ? this.state.selectedArtist.images[0].url
                  : 'http://media.virbcdn.com/cdn_images/crop_300x300/cd/default_song_album.jpg'
              }
            />
            <div>Popular songs by {this.state.selectedArtist.name}</div>
            <ul>
              {this.state.topTracks.map(track => {
                return (
                  <li
                    className="popular-track-li"
                    onClick={async () => {
                      await this.selectTrack(track);
                      await this.findNewTracks();
                    }}
                    key={track.id}
                  >
                    {track.name}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <Recommender
            id="recommender"
            artist={this.state.selectedArtist}
            track={this.state.selectedTrack}
            skipTrack={this.skipTrack}
            likeTrack={this.likeTrack}
            outOfSuggestions={this.state.outOfSuggestions}
          />
        )}
      </div>
    );
  }

  async selectTrack(track) {
    const trackInfo = await axios.get(`/api/tracks/${track.id}`);
    let newSeedTracks = this.state.seedTracks;
    newSeedTracks.push(trackInfo.data);
    let newSeedArtists = this.state.seedArtists;
    newSeedArtists.push(trackInfo.data.artists[0]);
    await this.setState({
      selectedTrack: trackInfo.data,
      selectedArtist: trackInfo.data.artists[0],
      seedTracks: newSeedTracks,
      seedArtists: newSeedArtists,
    });
  }
  async findNewTracks() {
    const result = await axios.get(
      `/api/recommend?artistId=${
        this.state.selectedArtist.id
      }&trackIds=${this.state.seedTracks
        .map(track => {
          return track.id;
        })
        .join('%2C')}`
    );
    //Ensure the next track has not been visited
    let oldVisitedTrackIds = this.state.visitedTrackIds;
    while (oldVisitedTrackIds.indexOf(result.data.tracks[0].id) > 0) {
      console.log('found a visited track. skipping');
      result.data.tracks.shift(1);
    }
    oldVisitedTrackIds.push(result.data.tracks[0].id);
    await this.setState({
      potentialTracks: result.data.tracks,
      selectedTrack: result.data.tracks[0],
      selectedArtist: result.data.tracks[0].artists[0],
      visitedTrackIds: oldVisitedTrackIds,
    });
    let oldAudio = this.state.audio;
    oldAudio.src = this.state.selectedTrack.preview_url;
    await this.play();
  }
  //Get next song from previous recommendations
  async skipTrack() {
    if (this.state.potentialTracks.length <= 1) {
      await this.setState({
        outOfSuggestions: true,
      });
      alert('Out of suggestions! Try starting again with a new artist');
    } else {
      let newList = this.state.potentialTracks.splice(1);
      //Ensure the next track has not been visited
      let oldVisitedTrackIds = this.state.visitedTrackIds;
      while (oldVisitedTrackIds.indexOf(newList[0].id) > 0) {
        console.log('found a visited track. skipping');
        newList.shift(1);
      }
      oldVisitedTrackIds.push(newList[0].id);
      await this.setState({
        potentialTracks: newList,
        selectedTrack: newList[0],
        selectedArtist: newList[0].artists[0],
        visitedTrackIds: oldVisitedTrackIds,
      });
      let oldAudio = this.state.audio;
      oldAudio.src = this.state.selectedTrack.preview_url;
      await this.play();
    }
  }
  //Adjust seed and get new recommendation from new seed
  likeTrack() {
    let prevSeedTracks = this.state.seedTracks;
    prevSeedTracks.push(this.state.selectedTrack);
    if (prevSeedTracks.length > 4) prevSeedTracks.shift(); //Remove oldest seed element
    this.setState({
      seedTracks: prevSeedTracks,
    });
    this.findNewTracks();
  }

  //music
  async togglePlay() {
    await this.setState({ playing: !this.state.playing });
    this.state.playing ? this.state.audio.play() : this.state.audio.pause();
  }
  async play() {
    await this.setState({
      playing: true,
    });
    await this.state.audio.play();
  }
}
