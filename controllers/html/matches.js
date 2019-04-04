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
  let finishedMatchesArr = [];
  db.Match.findAll({
    where: {
      playedStatus: true
    }
  })
    .then(matches => {
      // Find all the winning team id's and push into one array
      matches.forEach(match => {
        winningTeamsArr.push(match.winningTeamId);
        finishedMatchesArr.push(match.id);
      });
      return db.User.findAll({
        include: [db.Bet]
      });
    })
    .then(users => {
      // Get properties for each user, calculate win total and loss amounts
      users.forEach(el => {
        const { name, imageUrl, wins, losses } = el;
        let gameNotDoneBets = 0;
        // Calculates total amount spent for bets
        const total = el.Bets.reduce((total, bet) => {
          return total + bet.amount;
        }, 0);

        // Calculates total amount won if the game has finished
        // if not finished add bet amount to gameNotDoneBets
        const winTotal = el.Bets.reduce((acc, obj) => {
          if (!finishedMatchesArr.find(id => obj.MatchId === id)) {
            gameNotDoneBets += obj.amount;
          } else {
            if (winningTeamsArr.find(id => obj.selectedTeamId == id)) {
              return acc + obj.amount;
            }
          }
          return acc;
        }, 0);
        // Calculate lossTotal by subtracting any bets from games which have not yet completed, then subtract winTotal in order to get final total lost
        let lossTotal = total - gameNotDoneBets - winTotal;
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
      let finalUsersSort = sortedUsers.map(obj => {
        obj['rank'] = rank++;
        return obj;
      });

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
