import React from 'react';
import axios from 'axios';

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
      <div>
        <div>
          {this.state.selectedTrack.id
            ? this.state.selectedTrack.name
            : 'nothing yet'}
        </div>
        <img
          src={
            this.state.artist.images
              ? this.state.artist.images[0].url
              : 'http://media.virbcdn.com/cdn_images/crop_300x300/cd/default_song_album.jpg'
          }
        />
        <div>{this.state.artist.name}</div>
        <ol>
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
        </ol>
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
