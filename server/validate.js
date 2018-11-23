const axios = require('axios');
const auth = require('./auth.json');

module.exports = function getToken() {
  return axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      grant_type: 'client_credentials',
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: auth.client_id,
      password: auth.client_secret,
    },
  });
};
