const express = require('express');
const betsApiController = require('../../controllers/api/bets');

const router = express.Router();

router.post('/bets/user', betsApiController.postUserBet);
router.get('/bets/matches', betsApiController.getMatchBets);
router.get('/bets/:userId', betsApiController.getUserBets);
router.delete('/bets/:id', betsApiController.deleteBet);

module.exports = router;
