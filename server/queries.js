const axios = require('axios');
const getToken = require('./validate');

//Constants
const tokenPromise = getToken();
let currentArtistId = -1;
//TEMP. Add a Spotify song URL here to test
let currentTrackId = '6YX4TgG7dOFC931bICwE3O';
let topTracks = [];

async function searchArtistOrSong(query, type) {
  const token = (await tokenPromise).data.access_token;
  try {
    const result = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${query}&type=${type}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    //Handle result for type
    if (type === 'artist') {
      //Add ability to move through artists if top result was not accurate
      currentArtistId = result.data.artists.items[0].id;

      //TEMP, this function will be called elsewhere
      findBestTrack(currentArtistId);
    }
    //Handle result in context of function call
    return result.data;
  } catch (err) {
    console.error(err);
  }
}
async function findRelatedArtists(artistId) {
  const token = (await tokenPromise).data.access_token;
  try {
    const result = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.data;
  } catch (err) {
    console.error(err);
  }
}
//Get an artist's top tracks and return the track most similar to the one stored in 'currentTrackId'
async function findBestTrack(artistId) {
  const token = (await tokenPromise).data.access_token;
  try {
    const topTracksResult = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      headers: { Authorization: `Bearer ${token}` },
    });
    //Find top tracks to compare
    topTracks = topTracksResult.data.tracks.map(function(track) {
      return {
        name: track.name,
        id: track.id,
      };
    });
    const trackScores = topTracks.map(function(track) {
      return compareTracks(currentTrackId, track.id);
    });
    let bestScore = await trackScores[0];
    let bestScoreIndex = 0;
    for (let i = 1; i < topTracks.length; i++) {
      if ((await trackScores[i]) < bestScore) {
        bestScore = await trackScores[i];
        bestScoreIndex = i;
      }
    }
    console.log('best song match is', topTracks[bestScoreIndex].name);
  } catch (err) {
    console.error(err);
  }
}

//Returns a 'score' for track 2's similarity to track 1, lower is better
async function compareTracks(track1Id, track2Id) {
  const token = (await tokenPromise).data.access_token;
  try {
    const tracksFeatures = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features?ids=${track1Id}%2C${track2Id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const track1 = tracksFeatures.data.audio_features[0];
    const track2 = tracksFeatures.data.audio_features[1];
    //Absolute difference between the tempos of the songs
    const tempoDiff = Math.abs(track1.tempo - track2.tempo);
    //Energy level is a percentage
    const energyDiff = Math.abs(track1.energy * 100 - track2.energy * 100);
    //Add more comparison factors here!
    return tempoDiff + energyDiff;
  } catch (err) {
    console.error(err);
  }
}

//Enter an artist name here to search it, find it's best songs and compare those songs to the one stored in currentSongId
// searchArtistOrSong('queens of the stone age', 'artist');

module.exports = {
  tokenPromise,
  searchArtistOrSong,
  findRelatedArtists,
  findBestTrack,
  compareTracks,
};
