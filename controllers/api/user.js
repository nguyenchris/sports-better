const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const db = require('../../models');

// Post request /api/login
exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    const errorMsg = {
        error: 'Email or password is incorrect.',
    };
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    console.log('nxt');
    db.User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then(user => {
            if (!user) {
                return res.status(422).json(errorMsg);
            }
            const isMatch = user.validPassword(req.body.password);
            if (!isMatch) {
                return res.status(422).json(errorMsg);
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            return res.status(201).json(true);
        })
        .catch(err => console.log(err));
};

// Post request /api/signup
exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    db.User.findAll({
        where: {
            email: req.body.email,
        },
    }).then(result => {
        if (!errors.isEmpty()) {
            return res.json({
                error: errors.array()[0].msg,
            });
        }
        if (result.length > 0) {
            return res.status(422).json({
                error: 'Email already taken.',
            });
        }
        db.User.create(req.body)
            .then(user => {
                req.session.user = user;
                req.session.isLoggedIn = true;
                return res.status(201).json(true);
            })
            .catch(err => {
                console.log(err);
            });
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
        wins: req.user.wins,
    });
};

exports.getUserMatchBets = (req, res, next) => {
    const matchesArr = JSON.parse(req.query.matches);
    console.log(matchesArr);
    req.user
        .getBets({
            where: {
                MatchId: matchesArr,
            },
        })
        .then(bets => {
            res.json({
                matchBets: bets,
            });
        });
};
