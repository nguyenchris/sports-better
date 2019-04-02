const express = require('express');

const isAuth = require('../../middleware/is-auth');
const matchesController = require('../../controllers/html/matches');
const checkGames = require('../../middleware/check-game-start');

const router = express.Router();

router.get('/', matchesController.getIndex);

router.get('/matches', isAuth, matchesController.getMatches);

router.get('/leaders', isAuth, checkGames, matchesController.getLeaderboard);

module.exports = router;
