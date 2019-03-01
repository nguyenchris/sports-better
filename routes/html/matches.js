const express = require('express');

const isAuth = require('../../middleware/is-auth');
const matchesController = require('../../controllers/html/matches');

const router = express.Router();

router.get('/', isAuth, matchesController.getIndex);

module.exports = router;