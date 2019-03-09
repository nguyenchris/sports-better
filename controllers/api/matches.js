const moment = require('moment');
const axios = require('axios');
const querystring = require('querystring');
const config = require('../../config/axios-config');
const gameJson = require('../../todayGames.json');

const nbaAPIurl = 'https://api.mysportsfeeds.com/v2.1/pull/nba/current';

// Controller to get and return today's matches json
// Route: /api/matches
exports.getTodayMatches = (req, res, next) => {
  const today = moment(new Date()).format('YYYYMMDD');
  const dateHeader = moment(new Date()).format('MMMM D, YYYY');
  const dayHeader = moment(new Date()).format('dddd');

  axios
    .get(`${nbaAPIurl}/date/${today}/games.json?sort=game.starttime.A`, config)
    .then(result => {
      const origGameArray = result.data.games;
      const newGameArray = origGameArray.map(game => {
        let {playedStatus, startTime} = game.schedule;
        game.schedule.startTime = moment(startTime).format('h:mm a');
        if (playedStatus == 'UNPLAYED') {
          game.schedule.playedStatus = 'VS';
        } else if (
          playedStatus == 'COMPLETED' ||
          playedStatus == 'COMPLETED_PENDING_REVIEW'
        ) {
          game.schedule.playedStatus = 'FINAL';
        }
        return game;
      });
      res.json({
        games: newGameArray,
        date: dateHeader,
        day: dayHeader
      });
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Route: /api/matches/:date
exports.getMatchByDate = (req, res, next) => {
  const utcDate = new Date(req.params.date);
  const date = moment(utcDate).format('YYYYMMDD');
  const dateHeader = moment(utcDate).format('MMMM D, YYYY');
  const dayHeader = moment(utcDate).format('dddd');
  const today = moment(new Date()).format('MMMM D, YYYY');
  axios
    .get(`${nbaAPIurl}/date/${date}/games.json?sort=game.starttime.A`, config)
    .then(result => {
      const origGameArray = result.data.games;
      const newGameArray = origGameArray.map(game => {
        let {playedStatus, startTime} = game.schedule;
        game.schedule.startTime = moment(startTime).format('h:mm a');
        if (playedStatus == 'UNPLAYED') {
          game.schedule.playedStatus = 'VS';
        } else if (
          playedStatus == 'COMPLETED' ||
          playedStatus == 'COMPLETED_PENDING_REVIEW'
        ) {
          game.schedule.playedStatus = 'FINAL';
        }
        return game;
      });
      res.json({
        games: newGameArray,
        date: dateHeader,
        day: dayHeader,
        today: today
      });
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Route: /api/matches/modal/:matchId
exports.getMatchBoxscore = (req, res, next) => {
  const id = req.params.matchId;
  axios.get(`${nbaAPIurl}/games/${id}/boxscore.json`, config).then(result => {
    res.json(result.data);
  });
};

// Route: /api/matches/modal/:matchId
// exports.getModalMatch = (req, res, next) => {
//     console.log(req.params);
//     // axios.get('https://api.mysportsfeeds.com/v2.1/pull/nba/{season}/games/{game}/boxscore.{format}')
// }


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


exports.postComment = (req, res, next) => {
  console.log('=====  Comments  =====');
  console.log(req.body);
}
