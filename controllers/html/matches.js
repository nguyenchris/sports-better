const gameJson = require('../../todayGames.json');
const moment = require('moment');
const axios = require('axios');
const config = require('../../config/axios-config');

// Controller to render homepage HTML
// Route: /
exports.getIndex = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        activeIndex: true
    });
};

// Controller to get today's matches and render HTML
// Route: /matches
exports.getMatches = async (req, res, next) => {
    const today = moment(new Date()).format('YYYYMMDD')
    // axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nba/current/date/${today}/games.json?sort=game.starttime.A`, config)
    //     .then(result => {
    //         const origGameArray = result.data.games;
    //         const newGameArray = origGameArray.map(game => {
    //             let {
    //                 playedStatus,
    //                 startTime
    //             } = game.schedule;
    //             game.schedule.startTime = moment(startTime).format('h:mm a');
    //             if (playedStatus == 'UNPLAYED') {
    //                 game.schedule.playedStatus = null;
    //             } else if (playedStatus == 'COMPLETED' || playedStatus == 'COMPLETED_PENDING_REVIEW') {
    //                 game.schedule.playedStatus = 'FINAL';
    //             }
    //             return game;
    //         })
    //         console.log(newGameArray);
            res.render('matches', {
                title: 'Matches',
                activeMatches: true
            });
        // })
};

// Controller to get leaders in bet earnings
// Route: /leaders
exports.getLeaderboard = (req, res, next) => {
    res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true
    });
};