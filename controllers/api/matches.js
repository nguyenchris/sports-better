const fs = require('fs');
const gameJson = require('../../todayGames.json');

exports.getGameJson = (req, res, next) => {
    res.json(gameJson);
}