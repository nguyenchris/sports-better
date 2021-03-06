const db = require('../models');
const axios = require('axios');
const config = require('../config/axios-config');
const nbaAPIurl = 'https://api.mysportsfeeds.com/v2.1/pull/nba/current';

module.exports = (req, res, next) => {
  db.Match.findAll({
    where: {
      playedStatus: false
    },
    include: [db.Bet]
  })
    .then(matches => {
      if (matches) {
        matches.forEach(match => {
          const { startTime, id, homeTeamId, awayTeamId } = match;
          let winningTeamId = null;
          console.log('ID', id);
          console.log('homeTeamId', homeTeamId);
          console.log('awayTeamId', awayTeamId);
          if (Date.parse(startTime) < Date.now() + 11500000) {
            axios
              .get(`${nbaAPIurl}/games/${id}/boxscore.json?`, config)
              .then(result => {
                if (result.data) {
                  const {
                    homeScoreTotal,
                    awayScoreTotal
                  } = result.data.scoring;
                  if (homeScoreTotal > awayScoreTotal) {
                    winningTeamId = homeTeamId;
                  } else {
                    winningTeamId = awayTeamId;
                  }
                  console.log(winningTeamId);
                  return match
                    .update({
                      winningTeamId: winningTeamId,
                      playedStatus: true,
                      awayScoreTotal: awayScoreTotal,
                      homeScoreTotal: homeScoreTotal
                    })
                    .then(match => {
                      match.Bets.forEach(bet => {
                        if (bet) {
                          let isWin;
                          if (bet.selectedTeamId === winningTeamId) {
                            isWin = true;
                          } else {
                            isWin = false;
                          }
                          db.User.findByPk(bet.UserId).then(user => {
                            const updatedWins = user.wins + 1;
                            const updatedLosses = user.losses + 1;
                            if (isWin) {
                              user.update({
                                wins: updatedWins
                              });
                            } else {
                              user.update({
                                losses: updatedLosses
                              });
                            }
                          });
                        }
                      });
                    });
                }
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
