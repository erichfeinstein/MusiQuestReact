import React from 'react';
import axios from 'axios';

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
        <div id="header">Welcome to MusiQuest</div>
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
        <div>
          <ul>
            {this.state.artists.map(artist => {
              return (
                <div
                  className="artist"
                  key={artist.id}
                  onClick={() => this.selectArtist(artist)}
                >
                  <img src={artist.images[0] ? artist.images[0].url : ''} />
                  <div>{artist.name}</div>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  //Local functions
  async selectArtist(artist) {
    await this.setState({
      currentArtist: artist,
    });
    console.log('you selected', this.state.currentArtist);
  }

  //Axios functions
  async searchArtist() {
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
