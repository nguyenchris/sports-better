const gameJson = require('../../todayGames.json');
const moment = require('moment');


const axios = require('axios');
const btoa = require('btoa');
require('dotenv').config();

const key = process.env.NBA_APIKEY
const pw = process.env.NBA_PASSWORD

const credentials = btoa(key + ':' + pw);


// API call to pull json data and then write the json file to the root directory.
// Run file to get the new data for todays games
// axios.get('https://api.mysportsfeeds.com/v2.0/pull/nba/current/games.json?date=today', {
//     method: 'get',
//     headers: {
//         'Authorization': 'Basic ' + credentials
//     },
//     responseType: 'json'
// }).then(result => {
//     const gamesArray = result.data.games

//     const statusOfGameArr = gamesArray.map(game => {
//         if (game.schedule.playedStatus == 'COMPLETED') {
//             schedule
//         }
//     })
//     const obj = {
//         games: result.data.games
//     }
// });




exports.getIndex = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        activeIndex: true
    });
};

exports.getMatches = (req, res, next) => {
    const time = "2019-03-03T18:00:00.000Z"
    console.log('time', moment(time).format('MMMM Do, h:mm'));
    // .format('')
    res.render('matches', {
        title: 'Matches',
        activeMatches: true,
        games: gameJson.games
    });
};

exports.getLeaderboard = (req, res, next) => {
    res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true
    });
};