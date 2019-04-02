const db = require('../models');
const Op = db.Sequelize.Op;
const dtHelper = require('../util/date-hours');
const moment = require('moment');
const axios = require('axios');
const config = require('../config/axios-config');
const nbaAPIurl = 'https://api.mysportsfeeds.com/v2.1/pull/nba/current';

module.exports = (req, res, next) => {
  db.Match.findAll({
    where: {
      playedStatus: false
    }
  })
    .then(matches => {
      if (matches) {
        matches.forEach(match => {
          const { startTime, id, homeTeamId, awayTeamId } = match;
          let winningTeamId = '';
          if (Date.parse(startTime) < Date.now()) {
            axios
              .get(`${nbaAPIurl}/games/${id}/boxscore.json?offset=10`, config)
              .then(result => {
                const { homeScoreTotal, awayScoreTotal } = result.data.scoring;
                if (homeScoreTotal > awayScoreTotal) {
                  winningTeamId = homeTeamId;
                } else {
                  winningTeamId = awayTeamId;
                }
                return match
                  .update({
                    winningTeamId: winningTeamId,
                    playedStatus: true,
                    awayScoreTotal: awayScoreTotal,
                    homeScoreTotal: homeScoreTotal
                  })
                  .then(result => {
                    return result;
                  });
              });
          }
        });
      }

      next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    });
  //   db.Match.findAll({
  //     where: {
  //       playedStatus: false,
  //       startTime: {
  //         [Op.and]: [{ [Op.lte]: new Date() }, { [Op.gte]: dtHelper }]
  //       }
  //     },
  //     include: [db.Bet]
  //   }).then(matches => {
  //     console.log(matches);

  //     // if (matches.length == 0) {
  //     //     // next();
  //     // }
  //     // console.log(matches);
  //   });
};

// let betChoices = match.Bets.reduce((acc, bet) => {
//     return acc +=
//         }, {})

// var deskTypes = desks.reduce((acc, desk) => {

//     acc[desk.type] += 1
//     return acc;

// }, { sitting: 0, standing: 0 });

// db.Match.findAll({
//   where: {
//     playedStatus: false,
//     startTime: {
//       [Op.and]: [{ [Op.lte]: new Date() }, { [Op.gte]: dtHelper }]
//     }
//   },
//   include: [db.Bet]
// }).then(matches => {
//   console.log(matches);

//   if (matches.length == 0) {
//     // next();
//   }
//   // console.log(matches);
// });
