import React from 'react';
import axios from 'axios';

//3 options after being shown a new artist/song:
//I like this song, more by this artist
//Not a fan, find a different artist from previous artist's related artists
//I like this band, show me this band's related artists
export default class SelectedArtist extends React.Component {
  constructor() {
    super();
    this.state = {
      topTracks: [],
      artist: {},
      selectedTrack: {},
    };
    this.findNewTrack = this.findNewTrack.bind(this);
    this.selectTrack = this.selectTrack.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      artist: this.props.artist,
    });
    const topTracks = await axios.get(
      `/api/${this.state.artist.id}/top-tracks`
    );
    this.setState({
      topTracks: topTracks.data,
    });
  }

  render() {
    return (
      <div id="selected-artist">
        <div>
          {this.state.selectedTrack.id
            ? this.state.selectedTrack.name
            : 'Choose a song'}
        </div>
        <img
          src={
            this.state.artist.images
              ? this.state.artist.images[0].url
              : 'http://media.virbcdn.com/cdn_images/crop_300x300/cd/default_song_album.jpg'
          }
        />
        <div>Popular songs by {this.state.artist.name}</div>
        <ul>
          {this.state.topTracks.map(track => {
            return (
              <li
                onClick={async () => {
                  await this.selectTrack(track);
                  await this.findNewTrack();
                }}
                key={track.id}
              >
                {track.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  selectTrack(track) {
    this.setState({
      selectedTrack: track,
    });
  }
  async findNewTrack() {
    const result = await axios.get(
      `/api/${this.state.artist.id}/${this.state.selectedTrack.id}/new-track`
    );
    this.setState({
      selectedTrack: result.data,
    });
    console.log(this.state.selectedTrack);
  }
}
