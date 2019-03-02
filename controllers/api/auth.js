const db = require('../../models');
const {
    validationResult
} = require('express-validator/check');


exports.postLogin = (req, res, next) => {

    res.status(201).json(true);
};


exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    db.User
        .findAll({
            where: {
                email: req.body.email
            }
        })
        .then(result => {
            if (!errors.isEmpty()) {
                res.json({
                    errors: errors.array()[0].msg
                })
            } else if (result.length > 0) {
                res.status(422).json({
                    errors: 'Email already taken.'
                });
            } else {
                db.User
                    .create(req.body)
                    .then(user => {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        res.status(201).send(true);
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.status(201).send(true);
    })
}