const gameJson = require('../../todayGames.json');

// Controller to render homepage HTML
// Route: /
exports.getIndex = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        activeIndex: true
    });
};


// Route: /matches
exports.getMatches = async (req, res, next) => {
            console.log(newGameArray);
            res.render('matches', {
                title: 'Matches',
                activeMatches: true
            });
};

// Controller to get leaders in bet earnings
// Route: /leaders
exports.getLeaderboard = (req, res, next) => {
    res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true
    });
};