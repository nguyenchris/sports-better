const express = require('express');

const isAuth = require('../../middleware/is-auth');
const matchesController = require('../../controllers/html/matches');

const router = express.Router();

router.get('/', isAuth, matchesController.getIndex);

router.get('/matches', isAuth, matchesController.getMatches);

router.get('/leaders', isAuth, matchesController.getLeaderboard);

module.exports = router;