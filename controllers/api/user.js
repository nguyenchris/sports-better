const db = require('../../models');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

// Post request /api/login
exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    const errorMsg = {
        error: 'Email or password is incorrect.'
    };
    if (!errors.isEmpty()) {
        res.status(422).json(errorMsg);
    }
    db.User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                return res.status(422).json(errorMsg);
            }
            const isMatch = user.validPassword(req.body.password);
            if (!isMatch) {
                return res.status(422).json({
                    error: errorMsg
                });
            } else {
                req.session.user = user;
                req.session.isLoggedIn = true;
                return res.status(201).json(true);
            }
        })
        .catch(err => console.log(err));
};

// Post request /api/signup
exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    db.User.findAll({
        where: {
            email: req.body.email
        }
    }).then(result => {
        if (!errors.isEmpty()) {
            return res.json({
                error: errors.array()[0].msg
            });
        } else if (result.length > 0) {
            return res.status(422).json({
                error: 'Email already taken.'
            });
        } else {
            db.User.create(req.body)
                .then(user => {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return res.status(201).json(true);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });
};

// Post request /api/logout
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        return res.status(201).send(true);
    });
};

exports.getUser = (req, res, next) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        imageUrl: req.user.imageUrl,
        losses: req.user.losses,
        wins: req.user.wins
    });
};
