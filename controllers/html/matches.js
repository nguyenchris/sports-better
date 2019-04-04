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
      // const filteredUsers = users.filter(user => {
      //   return winningTeamsArr.some(id => !user.Bets.includes(id));
      // });
      // const filteredUsers = winningTeamsArr.some(
      //   id => !users[0].Bets.includes(id)
      // );

      // console.log(filteredUsers);
      // Get properties for each user, calculate win total and loss amounts
      users.forEach(el => {
        const { name, imageUrl, wins, losses } = el;
        const total = el.Bets.reduce((total, bet) => {
          return total + bet.amount;
        }, 0);
        const winTotal = el.Bets.reduce((acc, obj) => {
          if (winningTeamsArr.find(id => obj.selectedTeamId === id)) {
            return acc + obj.amount;
          }
          return acc;
        }, 0);
        let lossTotal = total - winTotal;
        let profit = null;
        if (winTotal < lossTotal) {
          profit = 0;
        } else {
          profit = winTotal - lossTotal;
        }
        totalBets = el.Bets.length;
        fetchedUsers.push({
          name,
          imageUrl,
          wins,
          losses,
          total,
          totalBets,
          winTotal,
          lossTotal,
          profit
        });
      });
      let rank = 1;
      let sortedUsers = fetchedUsers.sort((a, b) => b.profit - a.profit);
      console.log(sortedUsers);
      let finalUsersSort = sortedUsers.map(obj => {
        obj['rank'] = rank++;
        return obj;
      });
      console.log(finalUsersSort);

      res.render('leaders', {
        title: 'Leaders',
        activeLeaders: true,
        users: finalUsersSort
      });
    })
    .catch(err => {
      console.log(err);
      return next(err);
    });
};
