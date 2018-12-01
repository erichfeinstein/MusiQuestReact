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
    };
    this.searchArtist = this.searchArtist.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
  }

  //Mindset: User is prompted to search an artist, confirm the artist, then search the song they want to find similar songs to

  render() {
    return (
      <div>
        <div id="header">MusiQuest</div>
        <div id="search-area">
          <input id="search-input" placeholder="Search artists" />
          <button
            id="search-button"
            type="submit"
            onClick={() => {
              this.searchArtist();
            }}
          >
            Search!
          </button>
        </div>
        {/* Selected Artist Display */}
        {this.state.currentArtist.id ? (
          <SelectedArtist artist={this.state.currentArtist} />
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
    this.setState({
      currentArtist: {},
    });
    try {
      const query = document.getElementById('search-input').value;
      const result = await axios.get(`/api/search-artist?artist=${query}`);
      this.setState({
        artists: result.data.artists.items,
      });
    } catch (err) {
      console.log('problem finding artist');
      console.error(err);
    }
  }
}
