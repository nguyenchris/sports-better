exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        authCSS: true,
        loginJS: true,
        title: 'Login'
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        authCSS: true,
        signupJS: true,
        title: 'Signup'
    })
}