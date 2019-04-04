const db = require('../../models/index');
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
  res.render('matches', {
    title: 'Matches',
    activeMatches: true
  });
};

// Controller to get leaders in bet earnings
// Route: /leaders
exports.getLeaderboard = (req, res, next) => {
  let fetchedUsers = [];
  let total = null;
  let rank = null;
  let totalBets = null;
  db.User.findAll({
    include: [db.Bet]
  })
    .then(users => {
      users.forEach(el => {
        const { name, imageUrl, wins, losses } = el;
        const total = el.Bets.reduce((total, bet) => {
          return (total += bet.amount);
        }, 0);
        totalBets = el.Bets.length;
        fetchedUsers.push({
          name,
          imageUrl,
          wins,
          losses,
          total,
          totalBets
        });
      });
      res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true,
        users: fetchedUsers
      });
    })
    .catch(err => {
      console.log(err);
      return next(err);
    });
};
