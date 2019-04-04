const moment = require('moment');
const axios = require('axios');
const config = require('../../config/axios-config');
const dateHelper = require('../../util/format-dates');
const nbaColors = require('../../hex-colors2.json');

const nbaAPIurl = 'https://api.mysportsfeeds.com/v2.1/pull/nba/current';

// Controller to get and return today's matches json
// Route: /api/matches
exports.getTodayMatches = (req, res, next) => {
  const today = moment(new Date()).format('YYYYMMDD');
  const dateHeader = moment(new Date()).format('MMMM D, YYYY');
  const dayHeader = moment(new Date()).format('dddd');
  let currentGameTime = 'Tipoff Soon';

  axios
    .get(`${nbaAPIurl}/date/${today}/games.json?sort=game.starttime.A`, config)
    .then(result => {
      const origGameArray = result.data.games;
      const newGameArray = origGameArray.map(game => {
        let { playedStatus, startTime } = game.schedule;
        let {
          currentQuarterSecondsRemaining,
          currentQuarter,
          currentIntermission
        } = game.score;
        game.indexDate = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
        game.currentGameTime = 'Tipoff Soon';
        if (playedStatus == 'LIVE') {
          if (currentIntermission === 2) {
            game.currentGameTime = 'HALFTIME';
          }
          if (currentQuarterSecondsRemaining !== null) {
            const minutes = dateHelper.formatToMinutes(
              currentQuarterSecondsRemaining
            );
            if (currentQuarter > 4) {
              currentQuarter = 'OT';
            } else {
              currentQuarter = `Q${currentQuarter}`;
            }
            game.currentGameTime = `${currentQuarter} ${minutes}`;
          }
        }
        game.startTime = moment(startTime).format('h:mm a');
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
        let { playedStatus, startTime } = game.schedule;
        game.startTime = moment(startTime).format('h:mm a');
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

// Route: /api/matches/stats/:homeId-:awayId
exports.getMatchStats = (req, res, next) => {
  const homeId = req.params.homeId;
  const awayId = req.params.awayId;
  axios
    .get(
      `${nbaAPIurl}/standings.json?team=${homeId},${awayId}&stats=FG%25,3P%25,FT%25,W,L`,
      config
    )
    .then(result => {
      const arr = result.data.teams.map(teamObj => {
        const hex = nbaColors.find(obj => {
          return obj.name.includes(teamObj.team.city);
        });
        return (teamObj.color = hex);
      });
      res.json(result.data);
    });
};

// Route: /api/matches/modal/:matchId
exports.getModalMatch = (req, res, next) => {
  console.log(req.params);
  axios.get(`${nbaAPIurl}/games/{game}/boxscore.{format}`);
};

// Controller which returns static json file for testing today's gameJson
// exports.getGameJson = (req, res, next) => {
//   res.json(gameJson);
// };

exports.postComment = (req, res, next) => {
  console.log('=====  Comments  =====');
  console.log(req.body);
};
