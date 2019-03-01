const express = require('express');
const authApiController = require('../../controllers/api/auth');

const router = express.Router();

router.post('/login', authApiController.postLogin);

module.exports = router;