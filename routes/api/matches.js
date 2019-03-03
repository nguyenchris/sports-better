const express = require('express');
const matchesApiController = require('../../controllers/api/matches');

const router = express.Router();

router.get('/matches', matchesApiController.getGameJson);

module.exports = router;

