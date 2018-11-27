const body = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const queries = require('./queries');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', '/client/index.html'));
});

app.get('/api/search-artist', async function(req, res, next) {
  const result = await queries.searchArtistOrSong(req.query.artist, 'artist');
  res.json(result);
});

app.get('/api/:artistId/related-artists', async function(req, res, next) {
  const result = await queries.findRelatedArtists(req.params.artistId);
  res.json(result);
});

app.get('/api/:artistId/top-tracks', async function(req, res, next) {
  const result = await queries.findBestTracks(req.params.artistId);
  res.json(result);
});

//Will we need to pass the visisted tracks here?
//I think this may call for a DB
//User hasMany Artists (that they've already discovered)
//Artists belongsToMany User (who have discovered them)
app.get('/api/:artistId/:trackId/new-track', async function(req, res, next) {
  //related artists -> best tracks (or maybe all tracks) -> compare tracks
  const relatedArtists = await queries.findRelatedArtists(req.params.artistId);
  //For now we will just look at the first artist
  const newArtistTopTracks = await queries.findBestTracks(
    relatedArtists.artists[0].id
  );
  const suggestedTrack = await queries.bestTrackFromList(
    req.params.trackId,
    newArtistTopTracks
  );
  console.log('suggesting track', suggestedTrack);
  res.json(suggestedTrack);
});

const PORT = 8080;
app.listen(PORT, function() {
  console.log('listening on port', PORT);
});
