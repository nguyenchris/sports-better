const express = require('express');
const matchesApiController = require('../../controllers/api/matches');

const router = express.Router();

// router.get('/matches', matchesApiController.getGameJson);

router.get('/matches', matchesApiController.getTodayMatches);

router.get('/matches/:date', matchesApiController.getMatchByDate);

router.get('/matches/modal/:matchId', matchesApiController.getMatchBoxscore);

router.get('/matches/comments', matchesApiController.postComment);

router.get('/matches/odds', matchesApiController.getMatchOdds);

module.exports = router;
