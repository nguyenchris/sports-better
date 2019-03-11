const moment = require('moment');

const db = require('../../models');

exports.postUserBet = (req, res, next) => {
    const matchId = parseInt(req.body.match.id);
    const startTime = req.body.match.startTime;
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
                    startTime: startTime,
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId
                }).then(match => {
                    return match.addBet(newBet);
                });
            }
            return match.addBet(newBet);
        })
        .then(match => {
            res.json({
                bet: newBet,
                match: match
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
        // if (matches.length === 0) {
        //     return res.json(matches);
        // }
        res.json({
            matchesArr: matches
        });
    });
};

exports.getUserBets = (req, res, next) => {
    db.User.findByPk(parseInt(req.params.userId)).then(user => {
        user.getBets()
            .then(bets => {
                if (bets.length === 0) {
                    return res.json(bets);
                }
                const betTotal = bets.reduce((acc, bet) => {
                    return (acc += bet.amount);
                }, 0);
                res.json({
                    user: req.user,
                    bets: bets,
                    betTotal: betTotal
                });
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    });
};
