const express = require('express');
const matchesApiController = require('../../controllers/api/matches');

const router = express.Router();

// router.get('/matches', matchesApiController.getGameJson);

router.get('/matches', matchesApiController.getTodayMatches);

router.get('/matches/:date', matchesApiController.getMatchByDate);

router.get(
    '/matches/stats/:homeId-:awayId',
    matchesApiController.getMatchStats
);

router.get('/matches/comments', matchesApiController.postComment);

module.exports = router;
