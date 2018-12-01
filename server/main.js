const body = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const queries = require('./queries');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', '/client/index.html'));
});

//Initial search
app.get('/api/search-artist', async function(req, res, next) {
  const result = await queries.searchArtistOrSong(req.query.artist, 'artist');
  res.json(result);
});

//Used when selecting track from list
app.get('/api/tracks/:trackId', async function(req, res, next) {
  const result = await queries.findTrackInfo(req.params.trackId);
  res.json(result);
});

//Generate recommendations
app.get('/api/recommend/', async function(req, res, next) {
  const artistID = req.query.artistId;
  const trackIDs = req.query.trackIds;
  const result = await queries.getRecommendations(artistID, trackIDs);
  res.json(result);
});

//Retrieve an artist's top tracks to present to user
app.get('/api/:artistId/top-tracks', async function(req, res, next) {
  const result = await queries.findBestTracks(req.params.artistId);
  res.json(result);
});

const PORT = 8080;
app.listen(PORT, function() {
  console.log('listening on port', PORT);
});
