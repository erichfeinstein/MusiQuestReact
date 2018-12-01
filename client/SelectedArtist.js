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
    };
    this.findNewTracks = this.findNewTracks.bind(this);
    this.selectTrack = this.selectTrack.bind(this);
    this.skipTrack = this.skipTrack.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      selectedArtist: this.props.artist,
    });
    const topTracks = await axios.get(
      `/api/${this.state.selectedArtist.id}/top-tracks`
    );
    this.setState({
      topTracks: topTracks.data,
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
            artist={this.state.selectedArtist}
            track={this.state.selectedTrack}
            skipTrack={this.skipTrack}
          />
        )}
      </div>
    );
  }

  async selectTrack(track) {
    const trackInfo = await axios.get(`/api/tracks/${track.id}`);
    let newSeedTracks = this.state.seedTracks;
    newSeedTracks.push(trackInfo.data);
    this.setState({
      selectedTrack: trackInfo.data,
      selectedArtist: trackInfo.data.artists[0],
      seedTracks: newSeedTracks,
    });
  }
  async findNewTracks() {
    const result = await axios.get(
      `/api/recommend?artistId=${this.state.selectedArtist.id}&trackId=${
        this.state.selectedTrack.id
      }`
    );
    this.setState({
      potentialTracks: result.data.tracks,
      selectedTrack: result.data.tracks[0],
      selectedArtist: result.data.tracks[0].artists[0],
    });
  }
  //Get next song from previous recommendations
  skipTrack() {
    let newList = this.state.potentialTracks.splice(1);
    console.log(newList);
    this.setState({
      potentialTracks: newList,
      selectedTrack: newList[0],
      selectedArtist: newList[0].artists[0],
    });
  }
  //TODO like track handler
}
