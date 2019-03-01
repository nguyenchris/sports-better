const express = require('express');
const authController = require('../../controllers/html/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

module.exports = router;