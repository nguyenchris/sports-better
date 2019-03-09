const db = require('../models');
const Op = db.Sequelize.Op;
const dtHelper = require('../util/date-hours');

module.exports = (req, res, next) => {
    db.Match.findAll({
        where: {
            playedStatus: false,
            startTime: {
                [Op.and]: [{ [Op.lte]: new Date() }, { [Op.gte]: dtHelper }]
            }
        },
        include: [db.Bet]
    }).then(matches => {
        console.log(matches);

        if (matches.length == 0) {
            // next();
        }
        // console.log(matches);
    });
};

// let betChoices = match.Bets.reduce((acc, bet) => {
//     return acc +=
//         }, {})

// var deskTypes = desks.reduce((acc, desk) => {

//     acc[desk.type] += 1
//     return acc;

// }, { sitting: 0, standing: 0 });

db.Match.findAll({
    where: {
        playedStatus: false,
        startTime: {
            [Op.and]: [{ [Op.lte]: new Date() }, { [Op.gte]: dtHelper }]
        }
    },
    include: [db.Bet]
}).then(matches => {
    console.log(matches);

    if (matches.length == 0) {
        // next();
    }
    // console.log(matches);
});
