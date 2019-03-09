const moment = require('moment');

const db = require('../../models');

exports.postBet = (req, res, next) => {
    console.log(req.body.match);
    const matchId = parseInt(req.body.match.id);
    const startTime = req.body.match.startTime;
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
                        startTime: startTime
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
    console.log(req.body);

    // db.Match.findAll({
    //     where: {
    //         id:
    //     },
    //     include: [db.Bet]
    // }).then(matches => {
    //     res.json(matches);
    // });
};
