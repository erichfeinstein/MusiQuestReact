import React from 'react';
import axios from 'axios';

export default class App extends React.Component {
  constructor() {
    super();
    this.searchArtist = this.searchArtist.bind(this);
  }

  render() {
    return (
      <div>
        <div>Welcome</div>
        <input id="search-input" placeholder="Search artists" />
        <button
          type="submit"
          onClick={() => {
            this.searchArtist();
          }}
        >
          Search!
        </button>
      </div>
    );
  }

  async searchArtist() {
    try {
      const query = document.getElementById('search-input').value;
      const result = await axios.get(`/api/search-artist?artist=${query}`);
      console.log(result.data.artists.items[0].name);
    } catch (err) {
      console.error(err);
    }
  }
}
