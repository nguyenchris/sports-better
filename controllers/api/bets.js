const db = require('../../models');

exports.postBet = (req, res, next) => {
    const matchId = parseInt(req.body.matchId);
    const startTime = parseInt(req.body.startTime);
    req.user
        .createBet({
            amount: parseInt(req.body.amount),
            selectedTeamId: parseInt(req.body.selectedTeamId)
        })
        .then(bet => {
            db.Match.findOne({
                where: {
                    id: matchId
                }
            })
                .then(match => {
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
                    match.addBet(bet);
                })
                .then(bet => {
                    res.json(bet);
                });
        })
        .catch(err => {
            console.log(err);
        });
};
