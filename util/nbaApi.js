const axios = require('axios');
const btoa = require('btoa');
const fs = require('fs')
require('dotenv').config();

const key = process.env.NBA_APIKEY
const pw = process.env.NBA_PASSWORD

const credentials = btoa(key + ':' + pw);


// API call to pull json data and then write the json file to the root directory.
// Run file to get the new data for todays games
axios.get('https://api.mysportsfeeds.com/v2.0/pull/nba/current/games.json?date=today', {
    method: 'get',
    headers: {
        'Authorization': 'Basic ' + credentials
    },
    responseType: 'json'
}).then(result => {
    const obj = {
        games: result.data.games
    }
    const json = JSON.stringify(obj);
    fs.writeFile('todayGames.json', json, 'utf8', () => {
        console.log('file created');
    });
});