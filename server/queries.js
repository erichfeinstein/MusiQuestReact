const axios = require('axios');
const getToken = require('./validate');

//Constants
const tokenPromise = getToken();

async function searchArtistOrSong(query) {
  const token = (await tokenPromise).data.access_token;
  try {
    const result = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${query}&type=artist,track`,
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.data;
  } catch (err) {
    console.error(err);
  }
}

async function findTrackInfo(trackId) {
  const token = (await tokenPromise).data.access_token;
  try {
    const result = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/tracks/${trackId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (err) {
    console.error(err);
  }
}

async function findBestTracks(artistId) {
  const token = (await tokenPromise).data.access_token;
  try {
    const topTracksResult = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      headers: { Authorization: `Bearer ${token}` },
    });
    //Find top tracks to compare
    const topTracks = topTracksResult.data.tracks.map(function(track) {
      return {
        name: track.name,
        id: track.id,
      };
    });
    return topTracks;
  } catch (err) {
    console.error(err);
  }
}

async function getRecommendations(artist = '', track = '') {
  const token = (await tokenPromise).data.access_token;
  try {
    const trackRecs = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/recommendations?seed_artists=${artist}${
        track !== '' ? '&seed_tracks=' + track : ''
      }`,
      headers: { Authorization: `Bearer ${token}` },
    });
    return trackRecs.data;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  tokenPromise,
  searchArtistOrSong,
  findTrackInfo,
  findBestTracks,
  getRecommendations,
};
