const express = require('express');
const matchesApiController = require('../../controllers/api/matches');

const router = express.Router();

// router.get('/matches', matchesApiController.getGameJson);

router.get('/matches', matchesApiController.getTodayMatches);

router.get('matches/odds/:matches', )

module.exports = router;

