const express = require('express');
const betsApiController = require('../../controllers/api/bets');

const router = express.Router();

router.post('/bets/user', betsApiController.postBet);
router.get('/bets/matches', betsApiController.getMatchBets);

module.exports = router;
