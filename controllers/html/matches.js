exports.getIndex = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        activeIndex: true
    });
};

exports.getMatches = (req, res, next) => {
    res.render('matches', {
        title: 'Matches',
        activeMatches: true
    });
};

exports.getLeaderboard = (req, res, next) => {
    res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true
    });
};