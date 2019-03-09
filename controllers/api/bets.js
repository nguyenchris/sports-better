const moment = require('moment');

const db = require('../../models');

exports.postUserBet = (req, res, next) => {
    console.log(req.body.match);
    const matchId = parseInt(req.body.match.id);
    const startTime = req.body.match.startTime;
    const homeTeamId = parseInt(req.body.match.homeTeamId);
    const awayTeamId = parseInt(req.body.match.awayTeamId);
    console.log(startTime);
    req.user
        .createBet({
            amount: parseInt(req.body.bet.amount),
            selectedTeamId: parseInt(req.body.bet.selectedTeamId)
        })
        .then(bet => {
            let createdBet = bet;
            db.Match.findOne({
                where: {
                    id: matchId
                }
            }).then(match => {
                if (!match) {
                    return db.Match.create({
                        id: matchId,
                        playedStatus: false,
                        startTime: startTime,
                        awayTeamId: awayTeamId,
                        homeTeamId: homeTeamId
                    }).then(match => {
                        match.addBet(bet).then(bet => {
                            return res.json(bet);
                        });
                    });
                }
                match.addBet(bet).then(match => {
                    res.json({
                        bet: createdBet,
                        match: match
                    });
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getMatchBets = (req, res, next) => {
    const matchesNumArr = JSON.parse(req.query.matches);
    console.log(matchesNumArr);
    db.Match.findAll({
        where: {
            id: matchesNumArr
        },
        include: [db.Bet]
    }).then(matches => {
        if (matches.length === 0) {
            return res.json(matches);
        }
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
