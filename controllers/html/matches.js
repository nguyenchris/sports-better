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
  let winningTeamsArr = [];
  db.Match.findAll({
    where: {
      playedStatus: true
    }
  })
    .then(matches => {
      // Find all the winning team id's and push into one array
      matches.forEach(match => {
        winningTeamsArr.push(match.winningTeamId);
      });
      return db.User.findAll({
        include: [db.Bet]
      });
    })
    .then(users => {
      // Get properties for each user, calculate win total and loss amounts
      users.forEach(el => {
        const { name, imageUrl, wins, losses } = el;
        const total = el.Bets.reduce((total, bet) => {
          return (total += bet.amount);
        }, 0);
        const winTotal = el.Bets.reduce((acc, obj) => {
          if (winningTeamsArr.find(id => obj.selectedTeamId === id)) {
            return (acc += obj.amount);
          }
          return acc;
        }, 0);
        let lossTotal = total - winTotal;
        totalBets = el.Bets.length;
        fetchedUsers.push({
          name,
          imageUrl,
          wins,
          losses,
          total,
          totalBets,
          winTotal,
          lossTotal
        });
      });
      let rank = 1;
      fetchedUsers = fetchedUsers.sort((a, b) => b.winTotal - a.lossTotal);
      fetchedUsers = fetchedUsers.map(obj => {
        obj['rank'] = rank++;
        return obj;
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
