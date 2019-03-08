const express = require('express');
const betsApiController = require('../../controllers/api/bets');

const router = express.Router();

router.post('/bets', betsApiController.postBet);

module.exports = router;