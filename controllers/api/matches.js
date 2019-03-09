const moment = require('moment');
const axios = require('axios');
const config = require('../../config/axios-config');
const gameJson = require('../../todayGames.json');

// Controller to get and return today's matches json
// Route: /api/matches
exports.getTodayMatches = (req, res, next) => {
    const today = moment(new Date()).format('YYYYMMDD');
    const dateHeader = moment(new Date()).format('dddd, MMMM Do YYYY');
    axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nba/current/date/${today}/games.json?sort=game.starttime.A`, config)
        .then(result => {
            const origGameArray = result.data.games;
            const newGameArray = origGameArray.map(game => {
                let {
                    playedStatus,
                    startTime
                } = game.schedule;
                game.schedule.startTime = moment(startTime).format('h:mm a');
                if (playedStatus == 'UNPLAYED') {
                    game.schedule.playedStatus = null;
                } else if (playedStatus == 'COMPLETED' || playedStatus == 'COMPLETED_PENDING_REVIEW') {
                    game.schedule.playedStatus = 'FINAL';
                }
                return game;
            })
            res.json({
                games: newGameArray,
                date: dateHeader
            })
        })
}


// /api/matches/odds:matchid

// Controller which returns static json file for testing today's gameJson
exports.getGameJson = (req, res, next) => {
    res.json(gameJson);
}
    


// /api/matches/:id
exports.getMatchOdds = (req, res) => {
    const today = moment(new Date()).format('YYYYMMDD');
    
    axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nba/current/date/${today}/odds_gamelines.json?${id}`, config)
    .then(res => {
        const id = req.params.id
        console.log(res);

    })
}

