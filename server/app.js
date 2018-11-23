const axios = require('axios');
const getToken = require('./validate');

//Constants
const key = getToken();
let currentArtistId = -1;

//Querying
async function searchArtistOrSong(query, type) {
  const token = (await key).data.access_token;
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
      console.log('Found artist', currentArtistId, 'finding related...');
      //TEMP, this function will be called elsewhere
      findRelatedArtists(currentArtistId);
    }
    //Handle result in context of function call
    return result.data;
  } catch (err) {
    console.error(err);
  }
}
async function findRelatedArtists(artistId) {
  const token = (await key).data.access_token;
  try {
    const result = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('related artists: ', result.data.artists);
    return result.data;
  } catch (err) {
    console.error(err);
  }
}

//Compare tracks from related artists

// searchArtistOrSong('periphery', 'artist');
searchArtistOrSong('meshuggah', 'artist');
