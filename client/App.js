import React from 'react';
import axios from 'axios';
//Components
import ArtistList from './ArtistList';
import SelectedArtist from './SelectedArtist';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSong: {},
      currentArtist: {},
      artists: [],
      audioEnabled: true,
    };
    this.searchArtist = this.searchArtist.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
  }

  //Mindset: User is prompted to search an artist, confirm the artist, then search the song they want to find similar songs to

  render() {
    return (
      <div>
        <div className="home" align="center">
          <div id="header">MusiQuest</div>
          <button id="toggle-audio-button" onClick={this.toggleAudio}>
            Music: {this.state.audioEnabled ? 'On' : 'Off'}
          </button>
        </div>
        <div id="search-area">
          <input id="search-input" placeholder="Search artists" />
          <button
            id="search-button"
            type="submit"
            onClick={async () => {
              await this.searchArtist();
            }}
          >
            Search!
          </button>
        </div>
        {/* Selected Artist Display */}
        {this.state.currentArtist.id ? (
          <SelectedArtist
            artist={this.state.currentArtist}
            audioEnabled={this.state.audioEnabled}
          />
        ) : (
          <ArtistList
            artists={this.state.artists}
            selectArtist={this.selectArtist}
          />
        )}
      </div>
    );
  }

  //Local functions
  async selectArtist(artist) {
    await this.setState({
      artists: [],
      currentArtist: artist,
    });
  }

  //Axios functions
  async searchArtist() {
    await this.setState({
      currentArtist: {},
    });
    try {
      const query = document.getElementById('search-input').value;
      const result = await axios.get(`/api/search-artist?artist=${query}`);
      await this.setState({
        artists: result.data.artists.items,
      });
    } catch (err) {
      console.log('problem finding artist');
      console.error(err);
    }
  }

  toggleAudio() {
    let audioSetting = this.state.audioEnabled;
    this.setState({
      audioEnabled: !audioSetting,
    });
  }
}
