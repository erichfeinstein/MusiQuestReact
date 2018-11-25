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

const PORT = 8080;
app.listen(PORT, function() {
  console.log('listening on port', PORT);
});
