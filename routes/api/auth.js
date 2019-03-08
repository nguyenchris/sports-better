const express = require('express');
const authApiController = require('../../controllers/api/auth');
const {body, check} = require('express-validator/check');

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
  authApiController.postLogin
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
  authApiController.postSignup
);

router.post('/logout', authApiController.postLogout);

module.exports = router;
