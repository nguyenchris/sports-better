const axios = require('axios');
const btoa = require('btoa');
const fs = require('fs');
const nbaColor = require('nba-color');
const teamColors = require('../nba-colors.json');
require('dotenv').config();

const key = process.env.NBA_APIKEY;
const pw = process.env.NBA_PASSWORD;

const credentials = btoa(key + ':' + pw);

// API call to pull json data and then write the json file to the root directory.
// Run file to get the new data for todays games
// axios.get('https://api.mysportsfeeds.com/v2.1/pull/nba/current/date/20190304/games.json?sort=game.starttime.A', {
//     method: 'get',
//     headers: {
//         'Authorization': 'Basic ' + credentials
//     },
//     responseType: 'json'
// }).then(result => {
//     const obj = {
//         games: result.data.games
//     }

// });

const arr = teamColors.filter(team => {
    return team.league == 'nba';
});

const hexArr = arr.map(team => {
    let obj = {};
    let rgb = team.colors.rgb;
    // if (team.league == 'nba') {
    return (obj = {
        name: team.name,
        rgb: [rgb[0], rgb[1]]
        // });
    });
    // return rgb2hex(team.colors.rgb);
});

console.log(hexArr);

const color = JSON.stringify(hexArr);
// const json = JSON.stringify(obj);
fs.writeFile('hex-colors2.json', color, 'utf8', () => {
    console.log('file created');
});
