exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        loginCSS: true,
        loginJS: true
    });
};