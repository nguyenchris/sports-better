const moment = require('moment');

const db = require('../../models');

exports.postUserBet = (req, res, next) => {
  const matchId = parseInt(req.body.match.id);
  const { startTime } = req.body.match;
  const homeTeamId = parseInt(req.body.match.homeTeamId);
  const awayTeamId = parseInt(req.body.match.awayTeamId);
  let newBet = {};
  req.user
    .createBet({
      amount: parseInt(req.body.bet.amount),
      selectedTeamId: parseInt(req.body.bet.selectedTeamId)
    })
    .then(bet => {
      newBet = bet;
      return db.Match.findOne({
        where: {
          id: matchId
        }
      });
    })
    .then(match => {
      if (!match) {
        return db.Match.create({
          id: matchId,
          playedStatus: false,
          startTime,
          awayTeamId,
          homeTeamId
        }).then(createdMatch => createdMatch.addBet(newBet));
      }
      return match.addBet(newBet);
    })
    .then(match => {
      res.status(200).json({
        bet: newBet,
        match
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getMatchBets = (req, res, next) => {
  const matchesNumArr = JSON.parse(req.query.matches);
  db.Match.findAll({
    where: {
      id: matchesNumArr
    },
    include: [db.Bet]
  }).then(matches => {
    res.status(200).json({
      matchesArr: matches
    });
  });
};

exports.getUserBets = (req, res, next) => {
  db.User.findByPk(parseInt(req.params.userId)).then(user => {
    user
      .getBets()
      .then(bets => {
        if (bets.length === 0) {
          return res.json(bets);
        }
        const betTotal = bets.reduce((acc, bet) => (acc += bet.amount), 0);
        res.status(200).json({
          user: req.user,
          bets,
          betTotal
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });
};

exports.deleteBet = (req, res, next) => {
  const id = parseInt(req.params.id);
  db.Bet.destroy({
    where: {
      id
    }
  })
    .then(result => {
      console.log('Deleted Bet', result);
      res.status(204).json(result);
    })
    .catch(err => console.log(err));
};
