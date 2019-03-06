const express = require('express');
const matchesApiController = require('../../controllers/api/matches');

const router = express.Router();

// router.get('/matches', matchesApiController.getGameJson);

router.get('/matches', matchesApiController.getTodayMatches);

router.get('/matches/:date', matchesApiController.getMatchByDate);

router.get('/matches/modal/:matchId', matchesApiController.getModalMatch);

module.exports = router;

