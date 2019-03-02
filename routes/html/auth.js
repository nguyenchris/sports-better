const express = require('express');
const authHtmlController = require('../../controllers/html/auth');

const router = express.Router();

router.get('/login', authHtmlController.getLogin);
router.get('/signup', authHtmlController.getSignup);

module.exports = router;