const express = require('express');
const userApiController = require('../../controllers/api/user');
const { body, check } = require('express-validator/check');

const router = express.Router();

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({
                min: 5
            })
            .trim()
    ],
    userApiController.postLogin
);

router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({
            min: 5
        })
        .trim(),
    userApiController.postSignup
);

router.post('/logout', userApiController.postLogout);

router.get('/user', userApiController.getUser);

module.exports = router;
